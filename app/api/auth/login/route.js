import { prisma } from '../../../../lib/prisma.js';
import { verifyPassword } from '../../../../lib/auth.js';

// POST /api/auth/login — authenticate a student with email + password
export async function POST(request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return Response.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const student = await prisma.student.findUnique({ where: { email } });

  // Use a generic message to avoid leaking whether the email exists
  if (!student || !verifyPassword(password, student.passwordHash)) {
    return Response.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Return safe student data — never expose the password hash
  const { passwordHash: _, ...safeStudent } = student;
  return Response.json({ student: safeStudent });
}
