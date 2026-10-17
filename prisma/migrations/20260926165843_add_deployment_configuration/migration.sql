-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PermissionModule" ADD VALUE 'PERMISSIONS';
ALTER TYPE "PermissionModule" ADD VALUE 'ROLE_PERMISSIONS';
ALTER TYPE "PermissionModule" ADD VALUE 'USER_PERMISSIONS';

-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "seqNo" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "organizationId" TEXT,
    "environment" TEXT NOT NULL DEFAULT 'production',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformConfiguration" (
    "id" TEXT NOT NULL,
    "deploymentId" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_seqNo_key" ON "Deployment"("seqNo");

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_slug_key" ON "Deployment"("slug");

-- CreateIndex
CREATE INDEX "Deployment_organizationId_idx" ON "Deployment"("organizationId");

-- CreateIndex
CREATE INDEX "Deployment_isActive_idx" ON "Deployment"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformConfiguration_deploymentId_key" ON "PlatformConfiguration"("deploymentId");

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformConfiguration" ADD CONSTRAINT "PlatformConfiguration_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
