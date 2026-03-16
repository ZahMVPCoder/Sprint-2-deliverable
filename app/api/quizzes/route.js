import { prisma } from '../../../lib/prisma.js';

// GET /api/quizzes — return all quizzes with their linked lesson title
export async function GET() {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    include: { lesson: { select: { id: true, title: true, subject: true } } },
  });
  return Response.json(quizzes);
}

// POST /api/quizzes — create a new quiz linked to a lesson
export async function POST(request) {
  const body = await request.json();
  const { lessonId, title } = body;

  if (!lessonId || !title) {
    return Response.json({ error: 'lessonId and title are required' }, { status: 400 });
  }

  const quiz = await prisma.quiz.create({
    data: { lessonId: parseInt(lessonId), title },
    include: { lesson: { select: { id: true, title: true } } },
  });

  return Response.json(quiz, { status: 201 });
}
