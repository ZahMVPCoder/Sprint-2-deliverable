import { prisma } from '../../../lib/prisma.js';

// GET /api/lessons — return all lessons ordered by newest first
export async function GET() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return Response.json(lessons);
}

// POST /api/lessons — create a new lesson
export async function POST(request) {
  const body = await request.json();
  const { title, subject, content } = body;

  if (!title || !subject || !content) {
    return Response.json({ error: 'title, subject, and content are required' }, { status: 400 });
  }

  const lesson = await prisma.lesson.create({
    data: { title, subject, content },
  });

  return Response.json(lesson, { status: 201 });
}
