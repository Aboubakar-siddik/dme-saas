-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "sex" TEXT,
    "bloodGroup" TEXT,
    "allergies" TEXT,
    "medicalHistory" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "patients_clinicId_lastName_firstName_idx" ON "patients"("clinicId", "lastName", "firstName");

-- CreateIndex
CREATE INDEX "patients_clinicId_phoneNumber_idx" ON "patients"("clinicId", "phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "patients_clinicId_phoneNumber_key" ON "patients"("clinicId", "phoneNumber");
