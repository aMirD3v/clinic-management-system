-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "studentInfoId" TEXT;

-- CreateTable
CREATE TABLE "StudentInfo" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER,
    "email" TEXT,
    "phone" TEXT,
    "college" TEXT,
    "department" TEXT,
    "profileImageUrl" TEXT,

    CONSTRAINT "StudentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentInfo_studentId_key" ON "StudentInfo"("studentId");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_studentInfoId_fkey" FOREIGN KEY ("studentInfoId") REFERENCES "StudentInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
