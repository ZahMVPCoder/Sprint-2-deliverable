import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
// In Prisma 7, pass a driver adapter directly to PrismaClient
// PrismaPg handles the connection using DATABASE_URL env variable
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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
