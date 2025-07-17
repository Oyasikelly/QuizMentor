-- CreateTable
CREATE TABLE "ManualGrade" (
    "id" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "pointsAwarded" INTEGER NOT NULL,
    "feedback" TEXT,
    "gradedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ManualGrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ManualGrade_answerId_key" ON "ManualGrade"("answerId");

-- AddForeignKey
ALTER TABLE "ManualGrade" ADD CONSTRAINT "ManualGrade_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "quiz_answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualGrade" ADD CONSTRAINT "ManualGrade_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
