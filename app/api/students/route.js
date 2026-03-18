import { prisma } from '../../../lib/prisma.js';
import { hashPassword } from '../../../lib/auth.js';

// GET /api/students — return all students (passwords never exposed)
export async function GET() {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, gradeLevel: true, createdAt: true },
  });
  return Response.json(students);
}

// POST /api/students — register a new student account
export async function POST(request) {
  const body = await request.json();
  const { name, email, password, gradeLevel } = body;

  if (!name || !email || !password || !gradeLevel) {
    return Response.json({ error: 'name, email, password, and gradeLevel are required' }, { status: 400 });
  }

  const student = await prisma.student.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      gradeLevel,
    },
    select: { id: true, name: true, email: true, gradeLevel: true, createdAt: true },
  });

  // Add lessonsCompleted and averageQuizScore (default 0)
  const safeStudent = {
    ...student,
    lessonsCompleted: 0,
    averageQuizScore: 0,
  };
  return Response.json(safeStudent, { status: 201 });
}
