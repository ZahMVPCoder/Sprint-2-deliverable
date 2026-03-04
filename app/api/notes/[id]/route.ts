import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { NextRequest } from 'next/server';
// In Prisma 7, pass a driver adapter directly to PrismaClient
// PrismaPg handles the connection using DATABASE_URL env variable
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// This function handles GET requests to /api/notes/[id]
// In Next.js 15+, params is a Promise - you must await it to get the actual values
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // params is a Promise in Next.js 15+
) {
  // Await params to get the actual route parameters
  const { id } = await context.params;
  // Find a note by its id (convert id from string to number)
  const note = await prisma.note.findUnique({
    where: { id: parseInt(id) }
  });
  // If the note doesn't exist, return a 404 error
  if (!note) {
    return Response.json(
      { error: 'Note not found' },
      { status: 404 }
    );
  }
  // If found, return the note as JSON
  return Response.json(note);
}

// This function handles PUT requests to /api/notes/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // params is a Promise in Next.js 15+
) {
  // Await params to get the actual route parameters
  const { id } = await context.params;
  // Parse the request body as JSON
  const body = await request.json();
  // Update the note with the given id
  const note = await prisma.note.update({
    where: { id: parseInt(id) },
    data: {
      title: body.title,
      content: body.content,
    }
  });
  // Return the updated note as JSON
  return Response.json(note);
}

// This function handles DELETE requests to /api/notes/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // params is a Promise in Next.js 15+
) {
  // Await params to get the actual route parameters
  const { id } = await context.params;
  // Delete the note with the given id
  await prisma.note.delete({
    where: { id: parseInt(id) }
  });
  // Return a confirmation message
  return Response.json({ status: 'deleted' });
}
