import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { BuildingsModule } from './buildings/buildings.module';
import { FloorsModule } from './floors/floors.module';
import { RoomsModule } from './rooms/rooms.module';
import { DeviceTypesModule } from './device-types/device-types.module';
import { DevicesModule } from './devices/devices.module';
import { EquipmentTypesModule } from './equipment-types/equipment-types.module';
import { EquipmentsModule } from './equipments/equipments.module';
import { EquipmentDeviceMappingsModule } from './equipment-device-mappings/equipment-device-mappings.module';
import { ParametersModule } from './parameters/parameters.module';
import { HistoryModelsModule } from './history-models/history-models.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { ImportsModule } from './imports/imports.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AiModule } from './ai/ai.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PermissionGuard } from './auth/guards/permission.guard';
import { AuthorizationModule } from './authorization/authorization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),

        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
      })
    }),

    PrismaModule,
    AuthModule,
    AuthorizationModule,
    UsersModule,
    OrganizationsModule,
    BuildingsModule,
    FloorsModule,
    RoomsModule,
    DeviceTypesModule,
    DevicesModule,
    EquipmentTypesModule,
    EquipmentsModule,
    EquipmentDeviceMappingsModule,
    ParametersModule,
    HistoryModelsModule,
    TelemetryModule,
    ImportsModule,
    DashboardModule,
    AiModule,
  ],

  controllers: [AppController],

  providers:  [ {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: PermissionGuard,
  },AppService],
})
export class AppModule {}