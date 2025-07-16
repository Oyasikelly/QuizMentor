/*
  Warnings:

  - You are about to drop the column `academicLevel` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `classYear` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_organizationId_employeeId_key";

-- DropIndex
DROP INDEX "users_organizationId_studentId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "academicLevel",
DROP COLUMN "classYear",
DROP COLUMN "employeeId",
DROP COLUMN "studentId";

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classYear" TEXT,
    "academicLevel" TEXT,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employeeId" TEXT,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_studentId_key" ON "students"("userId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_userId_key" ON "teachers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_userId_employeeId_key" ON "teachers"("userId", "employeeId");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
