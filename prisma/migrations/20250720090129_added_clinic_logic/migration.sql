-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('WAITING_FOR_NURSE', 'READY_FOR_DOCTOR', 'SENT_TO_LAB', 'LAB_RESULTS_READY', 'READY_FOR_PHARMACY', 'COMPLETED');

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "VisitStatus" NOT NULL DEFAULT 'WAITING_FOR_NURSE',
    "assignedDoctorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NurseNote" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "bloodPressure" TEXT NOT NULL,
    "temperature" TEXT NOT NULL,
    "pulse" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "NurseNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorNote" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "prescription" TEXT,
    "requestLabTest" BOOLEAN NOT NULL,
    "notes" TEXT,

    CONSTRAINT "DoctorNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabResult" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "LabResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NurseNote_visitId_key" ON "NurseNote"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorNote_visitId_key" ON "DoctorNote"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "LabResult_visitId_key" ON "LabResult"("visitId");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_assignedDoctorId_fkey" FOREIGN KEY ("assignedDoctorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NurseNote" ADD CONSTRAINT "NurseNote_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorNote" ADD CONSTRAINT "DoctorNote_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabResult" ADD CONSTRAINT "LabResult_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
