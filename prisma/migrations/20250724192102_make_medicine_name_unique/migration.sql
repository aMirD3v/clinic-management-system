/*
  Warnings:

  - A unique constraint covering the columns `[medicineName]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[batchNumber]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "batchNumber" TEXT,
ADD COLUMN     "costPrice" DOUBLE PRECISION,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "manufactureDate" TIMESTAMP(3),
ADD COLUMN     "manufacturer" TEXT,
ADD COLUMN     "maxStockLevel" INTEGER,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reorderLevel" INTEGER,
ADD COLUMN     "storageLocation" TEXT,
ALTER COLUMN "price" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stock_medicineName_key" ON "Stock"("medicineName");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_batchNumber_key" ON "Stock"("batchNumber");
