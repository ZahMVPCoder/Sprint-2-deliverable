import { prisma } from '../../../lib/prisma.js';

// GET /api/progress?studentId=<id>
// Returns { totalLessons, completedLessons, averageScore, entries[] } for the progress page
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return Response.json({ error: 'studentId query parameter is required' }, { status: 400 });
  }

  const [completions, quizResults, totalLessons] = await Promise.all([
    prisma.lessonCompletion.findMany({
      where: { studentId: parseInt(studentId) },
      select: { lessonId: true },
    }),
    prisma.quizResult.findMany({
      where: { studentId: parseInt(studentId) },
      include: {
        quiz: {
          include: { lesson: { select: { id: true, title: true, subject: true } } },
        },
      },
      orderBy: { completedAt: 'desc' },
    }),
    prisma.lesson.count(),
  ]);

  const completedLessons = new Set(completions.map((c) => c.lessonId)).size;
  const scores = quizResults.map((r) => r.score);
  const averageScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  const entries = quizResults.map((r) => ({
    id: String(r.id),
    lessonId: String(r.quiz.lessonId),
    lessonTitle: r.quiz.lesson.title,
    subject: r.quiz.lesson.subject,
    score: r.score,
    completedAt: r.completedAt,
  }));

  return Response.json({ totalLessons, completedLessons, averageScore, entries });
}

// POST /api/progress — save a lesson completion or a quiz result
// Body: { type: "lesson"|"quiz", studentId, lessonId } or { type: "quiz", studentId, quizId, score }
export async function POST(request) {
  const body = await request.json();
  const { type, studentId } = body;

  if (!type || !studentId) {
    return Response.json({ error: 'type and studentId are required' }, { status: 400 });
  }

  if (type === 'lesson') {
    const { lessonId } = body;
    if (!lessonId) {
      return Response.json({ error: 'lessonId is required for type "lesson"' }, { status: 400 });
    }
    const completion = await prisma.lessonCompletion.create({
      data: { studentId: parseInt(studentId), lessonId: parseInt(lessonId) },
    });
    return Response.json(completion, { status: 201 });
  }

  if (type === 'quiz') {
    const { quizId, score } = body;
    if (!quizId || score === undefined) {
      return Response.json({ error: 'quizId and score are required for type "quiz"' }, { status: 400 });
    }
    const result = await prisma.quizResult.create({
      data: { studentId: parseInt(studentId), quizId: parseInt(quizId), score: parseInt(score) },
    });
    return Response.json(result, { status: 201 });
  }

  return Response.json({ error: 'type must be "lesson" or "quiz"' }, { status: 400 });
}
