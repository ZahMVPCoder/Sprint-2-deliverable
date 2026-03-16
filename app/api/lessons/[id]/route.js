import { prisma } from '../../../../lib/prisma.js';

// GET /api/lessons/[id] — fetch a single lesson and its quizzes
export async function GET(request, context) {
  const { id } = await context.params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: parseInt(id) },
    include: { quizzes: true },
  });

  if (!lesson) {
    return Response.json({ error: 'Lesson not found' }, { status: 404 });
  }

  return Response.json(lesson);
}

// PUT /api/lessons/[id] — update lesson content
export async function PUT(request, context) {
  const { id } = await context.params;
  const body = await request.json();

  const lesson = await prisma.lesson.update({
    where: { id: parseInt(id) },
    data: {
      title: body.title,
      subject: body.subject,
      content: body.content,
    },
  });

  return Response.json(lesson);
}

// DELETE /api/lessons/[id] — remove a lesson
export async function DELETE(request, context) {
  const { id } = await context.params;
  await prisma.lesson.delete({ where: { id: parseInt(id) } });
  return Response.json({ status: 'deleted' });
}
