-- CreateTable: BrightPath Student accounts
CREATE TABLE "Student" (
    "id"           SERIAL NOT NULL,
    "name"         TEXT NOT NULL,
    "email"        TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "gradeLevel"   TEXT NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Lessons (math & science content)
CREATE TABLE "Lesson" (
    "id"        SERIAL NOT NULL,
    "title"     TEXT NOT NULL,
    "subject"   TEXT NOT NULL,
    "content"   TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Quizzes linked to lessons
CREATE TABLE "Quiz" (
    "id"        SERIAL NOT NULL,
    "lessonId"  INTEGER NOT NULL,
    "title"     TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Quiz results per student
CREATE TABLE "QuizResult" (
    "id"          SERIAL NOT NULL,
    "studentId"   INTEGER NOT NULL,
    "quizId"      INTEGER NOT NULL,
    "score"       INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuizResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Lesson completion tracking
CREATE TABLE "LessonCompletion" (
    "id"          SERIAL NOT NULL,
    "studentId"   INTEGER NOT NULL,
    "lessonId"    INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LessonCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Unique email per student
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- AddForeignKey: Quiz -> Lesson
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_lessonId_fkey"
    FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: QuizResult -> Student
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_studentId_fkey"
    FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: QuizResult -> Quiz
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_quizId_fkey"
    FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: LessonCompletion -> Student
ALTER TABLE "LessonCompletion" ADD CONSTRAINT "LessonCompletion_studentId_fkey"
    FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: LessonCompletion -> Lesson
ALTER TABLE "LessonCompletion" ADD CONSTRAINT "LessonCompletion_lessonId_fkey"
    FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
