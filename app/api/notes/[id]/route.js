import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
// In Prisma 7, pass a driver adapter directly to PrismaClient
// PrismaPg handles the connection using DATABASE_URL env variable
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Handles GET /api/notes/[id] - fetch a single note by id
export async function GET(request, context) {
  // Await params to get the actual route parameters
  const { id } = await context.params;
  const note = await prisma.note.findUnique({
    where: { id: parseInt(id) }
  });
  // If the note doesn't exist, return a 404 error
  if (!note) {
    return Response.json({ error: 'Note not found' }, { status: 404 });
  }
  return Response.json(note);
}

// Handles PUT /api/notes/[id] - update a note by id
export async function PUT(request, context) {
  const { id } = await context.params;
  const body = await request.json();
  const note = await prisma.note.update({
    where: { id: parseInt(id) },
    data: {
      title: body.title,
      content: body.content,
    }
  });
  return Response.json(note);
}

// Handles DELETE /api/notes/[id] - delete a note by id
export async function DELETE(request, context) {
  const { id } = await context.params;
  await prisma.note.delete({
    where: { id: parseInt(id) }
  });
  return Response.json({ status: 'deleted' });
}
