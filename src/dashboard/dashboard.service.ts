import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

type DashboardQuery = {
  buildingId: string;
  from?: string;
  to?: string;
};

const POWER_UNITS = new Set(['kw', 'kilowatt', 'kilowatts']);

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(query: DashboardQuery, user: JwtPayload) {
    const buildingId = query.buildingId?.trim();
    if (!buildingId) {
      throw new BadRequestException('buildingId is required.');
    }

    const from = this.parseDate(query.from, 'from');
    const to = this.parseDate(query.to, 'to');
    if (from && to && from > to) {
      throw new BadRequestException('from must be earlier than or equal to to.');
    }

    // Keep the organization boundary on the server. Never trust a buildingId
    // supplied by the frontend without checking ownership.
    const building = await this.prisma.building.findUnique({
      where: { id: buildingId },
      select: {
        id: true,
        name: true,
        timezone: true,
        grossFloorArea: true,
        netFloorArea: true,
        organizationId: true,
        organization: { select: { id: true, name: true } },
      },
    });

    if (!building) {
      throw new NotFoundException('Building not found.');
    }

    const isSuperAdmin = user.roleName?.toUpperCase() === 'SUPER_ADMIN';
    if (!isSuperAdmin && building.organizationId !== user.organizationId) {
      throw new ForbiddenException('You do not have access to this building.');
    }

    const timeFilter =
      from || to
        ? {
            recordedAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {};

    const readings = await this.prisma.telemetryReading.findMany({
      where: {
        ...timeFilter,
        OR: [
          {
            entityType: 'DEVICE' as any,
            device: {
              is: {
                room: { is: { floor: { is: { buildingId } } } },
              },
            },
          },
          {
            entityType: 'EQUIPMENT' as any,
            equipment: {
              is: {
                room: { is: { floor: { is: { buildingId } } } },
              },
            },
          },
        ],
      },
      orderBy: [{ recordedAt: 'asc' }, { seqNo: 'asc' }],
      include: {
        parameter: { select: { id: true, name: true, unit: true } },
        device: {
          select: {
            id: true,
            tag: true,
            name: true,
            room: {
              select: {
                id: true,
                name: true,
                floor: { select: { id: true, name: true, buildingId: true } },
              },
            },
          },
        },
        equipment: {
          select: {
            id: true,
            tag: true,
            name: true,
            room: {
              select: {
                id: true,
                name: true,
                floor: { select: { id: true, name: true, buildingId: true } },
              },
            },
          },
        },
      },
    });

    const toEntity = (reading: (typeof readings)[number]) => {
      const entity = reading.entityType === 'DEVICE' ? reading.device : reading.equipment;
      return {
        entityType: reading.entityType,
        entityId: reading.deviceId ?? reading.equipmentId,
        entityTag: entity?.tag ?? null,
        entityName: entity?.name ?? null,
        room: entity?.room?.name ?? null,
        floor: entity?.room?.floor?.name ?? null,
      };
    };

    // The source records are sparse and may contain multiple metrics at one
    // timestamp. Preserve actual timestamps; do not create interpolated points.
    const trendByTimestamp = new Map<string, {
      timestamp: string;
      readings: number;
      valuesByParameter: Record<string, { parameterId: string; name: string; unit: string | null; sum: number; count: number }>;
    }>();

    const parameterSummary = new Map<string, {
      parameterId: string;
      name: string;
      unit: string | null;
      readingCount: number;
      min: number;
      max: number;
      latestValue: number;
      latestAt: string;
    }>();

    const latestByEntityParameter = new Map<string, (typeof readings)[number]>();
    const equipmentIds = new Set<string>();
    const deviceIds = new Set<string>();

    for (const reading of readings) {
      const timestamp = reading.recordedAt.toISOString();
      let point = trendByTimestamp.get(timestamp);
      if (!point) {
        point = { timestamp, readings: 0, valuesByParameter: {} };
        trendByTimestamp.set(timestamp, point);
      }
      point.readings += 1;

      const p = reading.parameter;
      const bucket = point.valuesByParameter[p.id] ?? {
        parameterId: p.id,
        name: p.name,
        unit: p.unit,
        sum: 0,
        count: 0,
      };
      bucket.sum += reading.value;
      bucket.count += 1;
      point.valuesByParameter[p.id] = bucket;

      const summary = parameterSummary.get(p.id);
      if (!summary) {
        parameterSummary.set(p.id, {
          parameterId: p.id,
          name: p.name,
          unit: p.unit,
          readingCount: 1,
          min: reading.value,
          max: reading.value,
          latestValue: reading.value,
          latestAt: timestamp,
        });
      } else {
        summary.readingCount += 1;
        summary.min = Math.min(summary.min, reading.value);
        summary.max = Math.max(summary.max, reading.value);
        if (reading.recordedAt.toISOString() >= summary.latestAt) {
          summary.latestValue = reading.value;
          summary.latestAt = timestamp;
        }
      }

      const entityId = reading.deviceId ?? reading.equipmentId ?? 'unknown';
      const key = `${reading.entityType}:${entityId}:${p.id}`;
      const previous = latestByEntityParameter.get(key);
      if (!previous || reading.recordedAt > previous.recordedAt) {
        latestByEntityParameter.set(key, reading);
      }

      if (reading.deviceId) deviceIds.add(reading.deviceId);
      if (reading.equipmentId) equipmentIds.add(reading.equipmentId);
    }

    const latestPowerReadings = [...latestByEntityParameter.values()]
      .filter((reading) => POWER_UNITS.has((reading.parameter.unit ?? '').trim().toLowerCase()))
      .map((reading) => ({
        ...toEntity(reading),
        parameterId: reading.parameter.id,
        parameter: reading.parameter.name,
        value: reading.value,
        unit: reading.parameter.unit,
        recordedAt: reading.recordedAt.toISOString(),
      }))
      .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));

    const trend = [...trendByTimestamp.values()].map((point) => ({
      timestamp: point.timestamp,
      readings: point.readings,
      parameters: Object.values(point.valuesByParameter).map((value) => ({
        parameterId: value.parameterId,
        name: value.name,
        unit: value.unit,
        // Average avoids implying that separate equipment/device measurements
        // are necessarily additive.
        value: Number((value.sum / value.count).toFixed(4)),
        sampleCount: value.count,
      })),
    }));

    const entityLatest = [...latestByEntityParameter.values()].map((reading) => ({
      ...toEntity(reading),
      parameterId: reading.parameter.id,
      parameter: reading.parameter.name,
      value: reading.value,
      unit: reading.parameter.unit,
      quality: reading.quality,
      source: reading.source,
      recordedAt: reading.recordedAt.toISOString(),
    }));

    const latestTimestamp = readings.length
      ? readings[readings.length - 1].recordedAt.toISOString()
      : null;

    return {
      building: {
        id: building.id,
        name: building.name,
        timezone: building.timezone,
        grossFloorArea: building.grossFloorArea,
        netFloorArea: building.netFloorArea,
        organization: building.organization,
      },
      period: {
        from: from?.toISOString() ?? (readings[0]?.recordedAt.toISOString() ?? null),
        to: to?.toISOString() ?? latestTimestamp,
        appliedFrom: from?.toISOString() ?? null,
        appliedTo: to?.toISOString() ?? null,
      },
      summary: {
        telemetryReadingCount: readings.length,
        deviceCount: deviceIds.size,
        equipmentCount: equipmentIds.size,
        parameterCount: parameterSummary.size,
        latestReadingAt: latestTimestamp,
        // The available test data contains power readings (kW), not a validated
        // energy counter (kWh). A single total is intentionally not inferred:
        // device and equipment measurements may overlap.
        energyConsumptionKwh: null,
        energyConsumptionUnavailableReason:
          'No validated kWh counter or integration interval is available in the current dataset.',
        currentPowerKw: null,
        currentPowerUnavailableReason:
          'A total cannot be calculated safely until device/equipment meter overlap is defined.',
        energyCost: null,
        energyCostUnavailableReason: 'No energy tariff is configured in the available schema/data.',
        renewableSharePercent: null,
        renewableShareUnavailableReason: 'No renewable generation and total-energy measurements are available.',
        emissionsKgCo2e: null,
        emissionsUnavailableReason: 'No emissions factor and validated energy consumption are available.',
      },
      trends: {
        // One point per real recorded timestamp. Values are grouped by parameter
        // and averaged only when multiple samples of that parameter share a timestamp.
        series: trend,
      },
      parameters: [...parameterSummary.values()]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => ({ ...item, latestAt: item.latestAt })),
      latestPowerReadings,
      latestReadings: entityLatest.sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)),
      equipment: {
        count: equipmentIds.size,
        latestReadings: entityLatest.filter((item) => item.entityType === 'EQUIPMENT'),
      },
      devices: {
        count: deviceIds.size,
        latestReadings: entityLatest.filter((item) => item.entityType === 'DEVICE'),
      },
      alerts: {
        items: [],
        unavailableReason: 'No alert/alarm model or alert records are available in the current schema.',
      },
      environmentalImpact: {
        emissionsKgCo2e: null,
        unavailableReason: 'Cannot calculate without validated energy consumption and an emissions factor.',
      },
      dataQuality: {
        readingsWithoutQuality: readings.filter((reading) => !reading.quality).length,
        sourceCounts: readings.reduce<Record<string, number>>(
          (counts, reading) => {
            counts[reading.source] = (counts[reading.source] ?? 0) + 1;
            return counts;
          },
          {},
        ),
        note: 'Only stored readings are returned. No missing timestamps or values are generated.',
      },
    };
  }

  private parseDate(value: string | undefined, field: string): Date | undefined {
    if (value === undefined || value.trim() === '') return undefined;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`${field} must be a valid ISO-8601 date/time.`);
    }
    return date
  }
}
