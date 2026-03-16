import { prisma } from '../../../../lib/prisma.js';

// GET /api/quizzes/[id] — fetch a single quiz with all student results
export async function GET(request, context) {
  const { id } = await context.params;

  const quiz = await prisma.quiz.findUnique({
    where: { id: parseInt(id) },
    include: {
      lesson: { select: { id: true, title: true, subject: true } },
      results: {
        include: { student: { select: { id: true, name: true } } },
        orderBy: { completedAt: 'desc' },
      },
    },
  });

  if (!quiz) {
    return Response.json({ error: 'Quiz not found' }, { status: 404 });
  }

  return Response.json(quiz);
}

// PUT /api/quizzes/[id] — update a quiz title
export async function PUT(request, context) {
  const { id } = await context.params;
  const body = await request.json();

  const quiz = await prisma.quiz.update({
    where: { id: parseInt(id) },
    data: { title: body.title },
  });

  return Response.json(quiz);
}

// DELETE /api/quizzes/[id] — remove a quiz
export async function DELETE(request, context) {
  const { id } = await context.params;
  await prisma.quiz.delete({ where: { id: parseInt(id) } });
  return Response.json({ status: 'deleted' });
}
