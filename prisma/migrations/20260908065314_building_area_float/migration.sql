/*
  Warnings:

  - You are about to drop the column `BuildingType` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `NetFloorArea` on the `Building` table. All the data in the column will be lost.
  - The `grossFloorArea` column on the `Building` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Building" DROP COLUMN "BuildingType",
DROP COLUMN "NetFloorArea",
ADD COLUMN     "buildingType" TEXT,
ADD COLUMN     "netFloorArea" DOUBLE PRECISION,
DROP COLUMN "grossFloorArea",
ADD COLUMN     "grossFloorArea" DOUBLE PRECISION;
