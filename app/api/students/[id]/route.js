import { prisma } from '../../../../lib/prisma.js';

// GET /api/students/[id] — fetch a single student with computed progress summary
export async function GET(request, context) {
  const { id } = await context.params;

  const student = await prisma.student.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      name: true,
      email: true,
      gradeLevel: true,
      createdAt: true,
      completions: {
        include: { lesson: { select: { id: true, title: true, subject: true } } },
        orderBy: { completedAt: 'desc' },
      },
      quizResults: {
        include: {
          quiz: {
            include: { lesson: { select: { id: true, title: true, subject: true } } },
          },
        },
        orderBy: { completedAt: 'desc' },
      },
    },
  });

  if (!student) {
    return Response.json({ error: 'Student not found' }, { status: 404 });
  }

  const lessonsCompleted = student.completions.length;
  const scores = student.quizResults.map((r) => r.score);
  const averageQuizScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  const recentActivity = [
    ...student.completions.map((c) => ({
      id: `lesson-${c.id}`,
      type: 'lesson',
      title: c.lesson.title,
      subject: c.lesson.subject,
      completedAt: c.completedAt,
    })),
    ...student.quizResults.map((r) => ({
      id: `quiz-${r.id}`,
      type: 'quiz',
      title: r.quiz.title,
      subject: r.quiz.lesson?.subject ?? 'Math',
      score: r.score,
      completedAt: r.completedAt,
    })),
  ]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  return Response.json({
    id: student.id,
    name: student.name,
    email: student.email,
    gradeLevel: student.gradeLevel,
    createdAt: student.createdAt,
    lessonsCompleted,
    averageQuizScore,
    recentActivity,
  });
}

// PUT /api/students/[id] — update a student's name or grade level
export async function PUT(request, context) {
  const { id } = await context.params;
  const body = await request.json();

  const student = await prisma.student.update({
    where: { id: parseInt(id) },
    data: {
      name: body.name,
      gradeLevel: body.gradeLevel,
    },
    select: { id: true, name: true, email: true, gradeLevel: true, createdAt: true },
  });

  return Response.json(student);
}

// DELETE /api/students/[id] — remove a student account
export async function DELETE(request, context) {
  const { id } = await context.params;
  await prisma.student.delete({ where: { id: parseInt(id) } });
  return Response.json({ status: 'deleted' });
}
