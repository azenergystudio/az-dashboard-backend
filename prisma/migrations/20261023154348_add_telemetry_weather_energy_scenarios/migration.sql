-- CreateTable
CREATE TABLE "TelemetryReading" (
    "id" TEXT NOT NULL,
    "seqNo" INTEGER NOT NULL,
    "entityType" "HistoryEntityType" NOT NULL,
    "deviceId" TEXT,
    "equipmentId" TEXT,
    "parameterId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "quality" TEXT DEFAULT 'GOOD',
    "source" "DataSource" NOT NULL DEFAULT 'IMPORT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelemetryReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherStation" (
    "id" TEXT NOT NULL,
    "seqNo" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sourceName" TEXT,
    "sourceFile" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "organizationId" TEXT NOT NULL,
    "buildingId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeatherStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherReading" (
    "id" TEXT NOT NULL,
    "seqNo" INTEGER NOT NULL,
    "weatherStationId" TEXT NOT NULL,
    "parameterId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "source" "DataSource" NOT NULL DEFAULT 'IMPORT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeatherReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyEndUse" (
    "id" TEXT NOT NULL,
    "seqNo" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT NOT NULL DEFAULT 'kW',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnergyEndUse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyScenario" (
    "id" TEXT NOT NULL,
    "seqNo" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "scenarioType" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnergyScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyScenarioResult" (
    "id" TEXT NOT NULL,
    "seqNo" INTEGER NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "endUseId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "periodType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'kW',
    "source" "DataSource" NOT NULL DEFAULT 'IMPORT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnergyScenarioResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TelemetryReading_seqNo_key" ON "TelemetryReading"("seqNo");

-- CreateIndex
CREATE INDEX "TelemetryReading_entityType_recordedAt_idx" ON "TelemetryReading"("entityType", "recordedAt");

-- CreateIndex
CREATE INDEX "TelemetryReading_deviceId_parameterId_recordedAt_idx" ON "TelemetryReading"("deviceId", "parameterId", "recordedAt");

-- CreateIndex
CREATE INDEX "TelemetryReading_equipmentId_parameterId_recordedAt_idx" ON "TelemetryReading"("equipmentId", "parameterId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TelemetryReading_entityType_deviceId_equipmentId_parameterI_key" ON "TelemetryReading"("entityType", "deviceId", "equipmentId", "parameterId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WeatherStation_seqNo_key" ON "WeatherStation"("seqNo");

-- CreateIndex
CREATE UNIQUE INDEX "WeatherStation_name_key" ON "WeatherStation"("name");

-- CreateIndex
CREATE INDEX "WeatherStation_organizationId_idx" ON "WeatherStation"("organizationId");

-- CreateIndex
CREATE INDEX "WeatherStation_buildingId_idx" ON "WeatherStation"("buildingId");

-- CreateIndex
CREATE UNIQUE INDEX "WeatherReading_seqNo_key" ON "WeatherReading"("seqNo");

-- CreateIndex
CREATE INDEX "WeatherReading_recordedAt_idx" ON "WeatherReading"("recordedAt");

-- CreateIndex
CREATE INDEX "WeatherReading_parameterId_recordedAt_idx" ON "WeatherReading"("parameterId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WeatherReading_weatherStationId_parameterId_recordedAt_key" ON "WeatherReading"("weatherStationId", "parameterId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyEndUse_seqNo_key" ON "EnergyEndUse"("seqNo");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyEndUse_name_key" ON "EnergyEndUse"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyScenario_seqNo_key" ON "EnergyScenario"("seqNo");

-- CreateIndex
CREATE INDEX "EnergyScenario_organizationId_buildingId_idx" ON "EnergyScenario"("organizationId", "buildingId");

-- CreateIndex
CREATE INDEX "EnergyScenario_scenarioType_idx" ON "EnergyScenario"("scenarioType");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyScenario_buildingId_name_key" ON "EnergyScenario"("buildingId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyScenarioResult_seqNo_key" ON "EnergyScenarioResult"("seqNo");

-- CreateIndex
CREATE INDEX "EnergyScenarioResult_scenarioId_recordedAt_idx" ON "EnergyScenarioResult"("scenarioId", "recordedAt");

-- CreateIndex
CREATE INDEX "EnergyScenarioResult_endUseId_recordedAt_idx" ON "EnergyScenarioResult"("endUseId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyScenarioResult_scenarioId_endUseId_recordedAt_periodT_key" ON "EnergyScenarioResult"("scenarioId", "endUseId", "recordedAt", "periodType");

-- AddForeignKey
ALTER TABLE "TelemetryReading" ADD CONSTRAINT "TelemetryReading_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelemetryReading" ADD CONSTRAINT "TelemetryReading_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelemetryReading" ADD CONSTRAINT "TelemetryReading_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "Parameter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeatherStation" ADD CONSTRAINT "WeatherStation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeatherStation" ADD CONSTRAINT "WeatherStation_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeatherReading" ADD CONSTRAINT "WeatherReading_weatherStationId_fkey" FOREIGN KEY ("weatherStationId") REFERENCES "WeatherStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeatherReading" ADD CONSTRAINT "WeatherReading_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "Parameter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyScenario" ADD CONSTRAINT "EnergyScenario_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyScenario" ADD CONSTRAINT "EnergyScenario_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyScenarioResult" ADD CONSTRAINT "EnergyScenarioResult_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "EnergyScenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyScenarioResult" ADD CONSTRAINT "EnergyScenarioResult_endUseId_fkey" FOREIGN KEY ("endUseId") REFERENCES "EnergyEndUse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
