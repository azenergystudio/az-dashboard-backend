/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,name]` on the table `Building` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialNumber]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seqNo]` on the table `EquipmentDevice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seqNo` to the `EquipmentDevice` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `module` on the `Permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PermissionModule" AS ENUM ('AUTH', 'USERS', 'ORGANIZATIONS', 'BUILDINGS', 'FLOORS', 'ROOMS', 'DEVICE_TYPES', 'DEVICES', 'EQUIPMENT_TYPES', 'EQUIPMENTS', 'PARAMETERS', 'HISTORY_MODELS', 'TELEMETRY', 'IMPORTS', 'REPORTS', 'AI', 'AUDIT', 'SETTINGS');

-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('DIGITAL_DELIVERY', 'DIGITAL_TWIN', 'IMPORT', 'API', 'MANUAL');

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "requestId" TEXT;

-- AlterTable
ALTER TABLE "Building" ADD COLUMN     "BuildingType" TEXT,
ADD COLUMN     "NetFloorArea" TEXT,
ADD COLUMN     "grossFloorArea" TEXT;

-- AlterTable
ALTER TABLE "EquipmentDevice" ADD COLUMN     "seqNo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Floor" ADD COLUMN     "grossFloorArea" TEXT;

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "module",
ADD COLUMN     "module" "PermissionModule" NOT NULL;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "modelId" INTEGER;

-- CreateTable
CREATE TABLE "DeviceRoomMapping" (
    "id" TEXT NOT NULL,
    "seqNo" INTEGER NOT NULL,
    "deviceId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceRoomMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentRoomMapping" (
    "id" TEXT NOT NULL,
    "seqNo" INTEGER NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentRoomMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lighting" (
    "id" TEXT NOT NULL,
    "seqNo" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wattage" DOUBLE PRECISION NOT NULL,
    "manufacturer" TEXT,
    "model" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lighting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LightingInstallation" (
    "id" TEXT NOT NULL,
    "seqNo" INTEGER NOT NULL,
    "lightingId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LightingInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" TEXT NOT NULL,
    "seqNo" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceRoomMapping_seqNo_key" ON "DeviceRoomMapping"("seqNo");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceRoomMapping_deviceId_roomId_key" ON "DeviceRoomMapping"("deviceId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentRoomMapping_seqNo_key" ON "EquipmentRoomMapping"("seqNo");

-- CreateIndex
CREATE INDEX "EquipmentRoomMapping_equipmentId_idx" ON "EquipmentRoomMapping"("equipmentId");

-- CreateIndex
CREATE INDEX "EquipmentRoomMapping_roomId_idx" ON "EquipmentRoomMapping"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentRoomMapping_equipmentId_roomId_key" ON "EquipmentRoomMapping"("equipmentId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Lighting_seqNo_key" ON "Lighting"("seqNo");

-- CreateIndex
CREATE UNIQUE INDEX "Lighting_tag_key" ON "Lighting"("tag");

-- CreateIndex
CREATE INDEX "Lighting_isActive_idx" ON "Lighting"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "LightingInstallation_seqNo_key" ON "LightingInstallation"("seqNo");

-- CreateIndex
CREATE INDEX "LightingInstallation_lightingId_idx" ON "LightingInstallation"("lightingId");

-- CreateIndex
CREATE INDEX "LightingInstallation_roomId_idx" ON "LightingInstallation"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "LightingInstallation_lightingId_roomId_key" ON "LightingInstallation"("lightingId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_seqNo_key" ON "Sensor"("seqNo");

-- CreateIndex
CREATE UNIQUE INDEX "Building_organizationId_name_key" ON "Building"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Device_serialNumber_key" ON "Device"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentDevice_seqNo_key" ON "EquipmentDevice"("seqNo");

-- CreateIndex
CREATE INDEX "Permission_module_idx" ON "Permission"("module");

-- AddForeignKey
ALTER TABLE "DeviceRoomMapping" ADD CONSTRAINT "DeviceRoomMapping_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceRoomMapping" ADD CONSTRAINT "DeviceRoomMapping_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentRoomMapping" ADD CONSTRAINT "EquipmentRoomMapping_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentRoomMapping" ADD CONSTRAINT "EquipmentRoomMapping_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LightingInstallation" ADD CONSTRAINT "LightingInstallation_lightingId_fkey" FOREIGN KEY ("lightingId") REFERENCES "Lighting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LightingInstallation" ADD CONSTRAINT "LightingInstallation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
