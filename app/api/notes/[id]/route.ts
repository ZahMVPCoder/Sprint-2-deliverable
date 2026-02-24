import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  const note = await prisma.note.findUnique({
    where: { id: parseInt(params.id) }
  });
  if (!note) {
    return Response.json(
      { error: 'Note not found' }, 
      { status: 404 }
    );
  }
  return Response.json(note);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const note = await prisma.note.update({
    where: { id: parseInt(params.id) },
    data: {
      title: body.title,
      content: body.content,
    }
  });
  return Response.json(note);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.note.delete({
    where: { id: parseInt(params.id) }
  });
  return Response.json({ status: 'deleted' });
}
