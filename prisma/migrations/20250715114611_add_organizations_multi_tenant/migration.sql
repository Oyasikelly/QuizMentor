/*
  Warnings:

  - You are about to drop the column `department` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `institution` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,employeeId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,studentId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `quiz_answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `quiz_attempts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `quizzes` table without a default value. This is not possible if the table is not empty.
  - Made the column `organizationId` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('UNIVERSITY', 'SECONDARY_SCHOOL', 'PRIMARY_SCHOOL', 'STUDY_GROUP', 'TRAINING_CENTER', 'COLLEGE', 'INSTITUTE');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('DEPARTMENT', 'FACULTY', 'CLASS', 'GRADE', 'GROUP', 'SECTION', 'STREAM', 'YEAR', 'DIVISION');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'ADMIN';
ALTER TYPE "UserRole" ADD VALUE 'SUPER_ADMIN';

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organizationId_fkey";

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "address" TEXT,
ADD COLUMN     "domain" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "subscriptionPlan" TEXT NOT NULL DEFAULT 'basic',
ADD COLUMN     "type" "OrganizationType" NOT NULL;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "quiz_answers" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "quiz_attempts" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "department",
DROP COLUMN "institution",
ADD COLUMN     "academicLevel" TEXT,
ADD COLUMN     "classYear" TEXT,
ADD COLUMN     "employeeId" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "unitId" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "role" DROP DEFAULT,
ALTER COLUMN "organizationId" SET NOT NULL;

-- CreateTable
CREATE TABLE "organizational_units" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "UnitType" NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "headId" TEXT,
    "academicYear" TEXT,
    "level" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizational_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "unitId" TEXT,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizational_units_organizationId_name_type_key" ON "organizational_units"("organizationId", "name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_organizationId_name_key" ON "subjects"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_organizationId_employeeId_key" ON "users"("organizationId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "users_organizationId_studentId_key" ON "users"("organizationId", "studentId");

-- AddForeignKey
ALTER TABLE "organizational_units" ADD CONSTRAINT "organizational_units_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizational_units" ADD CONSTRAINT "organizational_units_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "organizational_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "organizational_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "organizational_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;
