/*
  Warnings:

  - You are about to drop the column `result` on the `LabResult` table. All the data in the column will be lost.
  - Added the required column `results` to the `LabResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LabResult" DROP COLUMN "result",
ADD COLUMN     "results" JSONB NOT NULL;
