/*
  Warnings:

  - A unique constraint covering the columns `[imn]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "patients_clinicId_phoneNumber_idx";

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "cityOfResidence" TEXT,
ADD COLUMN     "countryOfOrigin" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "idCardNumber" TEXT,
ADD COLUMN     "imn" TEXT,
ADD COLUMN     "isMinor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "pinCode" TEXT,
ADD COLUMN     "profession" TEXT;

-- AlterTable
ALTER TABLE "visits" ADD COLUMN     "anamnesis" TEXT,
ADD COLUMN     "bilan" TEXT,
ADD COLUMN     "bloodPressure" TEXT,
ADD COLUMN     "bloodSugar" DOUBLE PRECISION,
ADD COLUMN     "cardioSystems" TEXT,
ADD COLUMN     "familyHistory" BOOLEAN,
ADD COLUMN     "familyHistoryDetails" TEXT,
ADD COLUMN     "generalSystems" TEXT,
ADD COLUMN     "heartRate" INTEGER,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "oxygenSaturation" INTEGER,
ADD COLUMN     "personalHistory" BOOLEAN,
ADD COLUMN     "personalHistoryDetails" TEXT,
ADD COLUMN     "respiratoryRate" INTEGER,
ADD COLUMN     "temperature" DOUBLE PRECISION,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "patients_imn_key" ON "patients"("imn");
