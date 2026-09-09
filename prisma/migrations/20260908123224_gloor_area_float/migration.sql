/*
  Warnings:

  - The `grossFloorArea` column on the `Floor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Floor" DROP COLUMN "grossFloorArea",
ADD COLUMN     "grossFloorArea" DOUBLE PRECISION;
