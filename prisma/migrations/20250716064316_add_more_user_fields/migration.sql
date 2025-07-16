-- AlterTable
ALTER TABLE "students" ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "department" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "subjectsTaught" TEXT;
