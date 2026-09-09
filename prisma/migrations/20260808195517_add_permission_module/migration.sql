/*
  Warnings:

  - Added the required column `module` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "module" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Permission_module_idx" ON "Permission"("module");
