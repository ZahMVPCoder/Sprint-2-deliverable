import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return Response.json(notes);
}

export async function POST(request: Request) {
  const body = await request.json();
  const note = await prisma.note.create({
    data: {
      title: body.title,
      content: body.content,
    }
  });
  return Response.json(note, { status: 201 });
}

/*New features (feature/*)

Emergency fixes (hotfix/*)

Action: Create a new branch named feature/docker-setup and push it to GitHub. Stay on this branch for the rest of the sprint.*/