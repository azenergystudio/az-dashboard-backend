import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, HistoryEntityType } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { IngestTelemetryDto, TelemetryReadingItemDto } from './dto/create-telemetry-reading.dto';
import { LatestTelemetryQueryDto, TelemetryHistoryQueryDto } from './dto/telemetry-query.dto';

const MAX_QUERY_LIMIT = 5000;

@Injectable()
export class TelemetryService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertBuildingAccess(buildingId: string, user: JwtPayload) {
    const building = await this.prisma.building.findFirst({
      where: { id: buildingId, isActive: true },
      select: { id: true, name: true, organizationId: true, timezone: true },
    });

    if (!building) throw new NotFoundException('Building not found.');

    if (user.roleName !== 'SUPER_ADMIN') {
      if (!user.organizationId || building.organizationId !== user.organizationId) {
        throw new ForbiddenException('You do not have access to this building.');
      }
    }

    return building;
  }

  private async assertEntityInBuilding(
    entityType: HistoryEntityType,
    entityId: string,
    buildingId: string,
  ) {
    if (entityType === HistoryEntityType.DEVICE) {
      const device = await this.prisma.device.findFirst({
        where: {
          id: entityId,
          isActive: true,
          room: { floor: { buildingId, isActive: true } },
        },
        select: { id: true },
      });
      if (!device) throw new BadRequestException(`Device ${entityId} does not belong to the selected building or is inactive.`);
    } else {
      const equipment = await this.prisma.equipment.findFirst({
        where: {
          id: entityId,
          isActive: true,
          room: { floor: { buildingId, isActive: true } },
        },
        select: { id: true },
      });
      if (!equipment) throw new BadRequestException(`Equipment ${entityId} does not belong to the selected building or is inactive.`);
    }
  }

  private validateReadingEntity(reading: TelemetryReadingItemDto) {
    const hasDevice = Boolean(reading.deviceId);
    const hasEquipment = Boolean(reading.equipmentId);
    if (reading.entityType === HistoryEntityType.DEVICE && (!hasDevice || hasEquipment)) {
      throw new BadRequestException('DEVICE readings must include deviceId and must not include equipmentId.');
    }
    if (reading.entityType === HistoryEntityType.EQUIPMENT && (!hasEquipment || hasDevice)) {
      throw new BadRequestException('EQUIPMENT readings must include equipmentId and must not include deviceId.');
    }
    if (!Number.isFinite(reading.value)) throw new BadRequestException('Reading value must be a finite number.');
    if (Number.isNaN(new Date(reading.recordedAt).getTime())) throw new BadRequestException('recordedAt must be a valid date.');
  }

  async ingest(dto: IngestTelemetryDto, user: JwtPayload, sourceOverride?: DataSource) {
    await this.assertBuildingAccess(dto.buildingId, user);
    if (!dto.readings?.length) throw new BadRequestException('Provide at least one telemetry reading.');

    const entityChecks = new Map<string, Promise<void>>();
    for (const reading of dto.readings) {
      this.validateReadingEntity(reading);
      const entityId = reading.entityType === HistoryEntityType.DEVICE ? reading.deviceId! : reading.equipmentId!;
      const key = `${reading.entityType}:${entityId}`;
      if (!entityChecks.has(key)) {
        entityChecks.set(key, this.assertEntityInBuilding(reading.entityType, entityId, dto.buildingId));
      }
    }
    await Promise.all(entityChecks.values());

    const parameterIds = [...new Set(dto.readings.map((reading) => reading.parameterId))];
    const activeParameters = await this.prisma.parameter.findMany({
      where: { id: { in: parameterIds }, isActive: true },
      select: { id: true },
    });
    const activeParameterIds = new Set(activeParameters.map((parameter) => parameter.id));
    const missingParameterIds = parameterIds.filter((id) => !activeParameterIds.has(id));
    if (missingParameterIds.length) {
      throw new BadRequestException(`Unknown or inactive parameter IDs: ${missingParameterIds.join(', ')}`);
    }

    const source = sourceOverride ?? dto.source ?? DataSource.API;
    // Serialize telemetry batches while assigning seqNo because the existing schema uses a unique integer key.
    // A database advisory transaction lock prevents two concurrent batches from allocating the same seqNo range.
    const result = await this.prisma.$transaction(async (transaction) => {
      await transaction.$queryRaw`SELECT pg_advisory_xact_lock(772019)`;
      const telemetryReading = (transaction as any).telemetryReading;
      const last = await telemetryReading.findFirst({ orderBy: { seqNo: 'desc' }, select: { seqNo: true } });
      const nextSeqNo = (last?.seqNo ?? 0) + 1;
      const data = dto.readings.map((reading, index) => ({
        seqNo: nextSeqNo + index,
        entityType: reading.entityType,
        deviceId: reading.deviceId ?? null,
        equipmentId: reading.equipmentId ?? null,
        parameterId: reading.parameterId,
        recordedAt: new Date(reading.recordedAt),
        value: reading.value,
        quality: reading.quality ?? 'GOOD',
        source,
      }));
      return telemetryReading.createMany({ data, skipDuplicates: true });
    });
    return {
      buildingId: dto.buildingId,
      source,
      received: dto.readings.length,
      inserted: result.count,
      skippedAsDuplicates: dto.readings.length - result.count,
    };
  }

  async importCsv(buildingId: string, csv: string, user: JwtPayload) {
    const rows = this.parseCsv(csv);
    if (!rows.length) throw new BadRequestException('CSV contains no data rows.');
    const readings: TelemetryReadingItemDto[] = rows.map((row, index) => {
      const entityType = row.entityType?.trim().toUpperCase() as HistoryEntityType;
      const value = Number(row.value);
      if (!Object.values(HistoryEntityType).includes(entityType)) {
        throw new BadRequestException(`Invalid entityType on CSV line ${index + 2}. Use DEVICE or EQUIPMENT.`);
      }
      if (!row.parameterId || !row.recordedAt || !Number.isFinite(value)) {
        throw new BadRequestException(`CSV line ${index + 2} requires parameterId, recordedAt, and a numeric value.`);
      }
      return {
        entityType,
        deviceId: row.deviceId?.trim() || undefined,
        equipmentId: row.equipmentId?.trim() || undefined,
        parameterId: row.parameterId.trim(),
        recordedAt: row.recordedAt.trim(),
        value,
        quality: row.quality?.trim() || undefined,
      };
    });
    return this.ingest({ buildingId, source: DataSource.IMPORT, readings }, user, DataSource.IMPORT);
  }

  async history(query: TelemetryHistoryQueryDto, user: JwtPayload) {
    await this.assertBuildingAccess(query.buildingId, user);
    await this.assertEntityInBuilding(query.entityType, query.entityId, query.buildingId);

    const from = query.from ? new Date(query.from) : undefined;
    const to = query.to ? new Date(query.to) : undefined;
    if (from && to && from > to) throw new BadRequestException('from must be earlier than or equal to to.');
    const limit = this.parseLimit(query.limit, 1000);

    const where: any = {
      entityType: query.entityType,
      ...(query.entityType === HistoryEntityType.DEVICE
        ? { deviceId: query.entityId }
        : { equipmentId: query.entityId }),
      ...(query.parameterId ? { parameterId: query.parameterId } : {}),
      ...(from || to ? { recordedAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    };

    const readings = await (this.prisma as any).telemetryReading.findMany({
      where,
      orderBy: { recordedAt: 'asc' },
      take: limit,
      include: { parameter: { select: { id: true, name: true, unit: true } } },
    });

    return { buildingId: query.buildingId, entityType: query.entityType, entityId: query.entityId, count: readings.length, readings };
  }

  async latest(query: LatestTelemetryQueryDto, user: JwtPayload) {
    await this.assertBuildingAccess(query.buildingId, user);
    if (query.entityId && !query.entityType) throw new BadRequestException('entityType is required when entityId is provided.');
    if (query.entityId && query.entityType) await this.assertEntityInBuilding(query.entityType, query.entityId, query.buildingId);
    const limit = this.parseLimit(query.limit, 500);

    const where: any = {
      ...(query.parameterId ? { parameterId: query.parameterId } : {}),
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...(query.entityId && query.entityType === HistoryEntityType.DEVICE ? { deviceId: query.entityId } : {}),
      ...(query.entityId && query.entityType === HistoryEntityType.EQUIPMENT ? { equipmentId: query.entityId } : {}),
      OR: [
        { device: { is: { room: { is: { floor: { is: { buildingId: query.buildingId } } } } } }, entityType: HistoryEntityType.DEVICE },
        { equipment: { is: { room: { is: { floor: { is: { buildingId: query.buildingId } } } } } }, entityType: HistoryEntityType.EQUIPMENT },
      ],
    };

    const rows = await (this.prisma as any).telemetryReading.findMany({
      where,
      orderBy: [{ recordedAt: 'desc' }, { seqNo: 'desc' }],
      take: Math.min(limit * 20, MAX_QUERY_LIMIT),
      include: { parameter: { select: { id: true, name: true, unit: true } } },
    });

    // Return the latest row for each entity/parameter pair, not merely the latest N raw readings.
    const latestByKey = new Map<string, (typeof rows)[number]>();
    for (const row of rows) {
      const entityId = row.deviceId ?? row.equipmentId ?? 'unknown';
      const key = `${row.entityType}:${entityId}:${row.parameterId}`;
      if (!latestByKey.has(key)) latestByKey.set(key, row);
      if (latestByKey.size >= limit) break;
    }

    const readings = [...latestByKey.values()];
    return { buildingId: query.buildingId, count: readings.length, readings };
  }

  private parseLimit(value: string | undefined, fallback: number) {
    if (value === undefined) return fallback;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) throw new BadRequestException('limit must be a positive integer.');
    return Math.min(parsed, MAX_QUERY_LIMIT);
  }

  private parseCsv(csv: string): Record<string, string>[] {
    const lines = csv.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) return [];
    const parseLine = (line: string) => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { values.push(current); current = ''; }
        else current += char;
      }
      if (inQuotes) throw new BadRequestException('CSV contains an unclosed quoted field.');
      values.push(current);
      return values;
    };
    const headers = parseLine(lines[0]).map((header) => header.trim());
    const required = ['entityType', 'parameterId', 'recordedAt', 'value'];
    const missing = required.filter((header) => !headers.includes(header));
    if (missing.length) throw new BadRequestException(`CSV is missing required columns: ${missing.join(', ')}.`);
    return lines.slice(1).map((line) => {
      const values = parseLine(line);
      return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
    });
  }
}
