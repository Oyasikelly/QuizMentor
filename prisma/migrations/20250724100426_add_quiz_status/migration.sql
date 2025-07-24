-- CreateEnum
CREATE TYPE "QuizStatus" AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVED');

-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "status" "QuizStatus" NOT NULL DEFAULT 'DRAFT';
