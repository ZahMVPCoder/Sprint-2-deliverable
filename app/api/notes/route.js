import { prisma } from '../../../lib/prisma.js';

export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return Response.json(notes);
}

export async function POST(request) {
  const body = await request.json();
  const note = await prisma.note.create({
    data: {
      title: body.title,
      content: body.content,
    }
  });
  return Response.json(note, { status: 201 });
}
