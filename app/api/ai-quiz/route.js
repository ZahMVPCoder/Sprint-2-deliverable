import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/ai-quiz — generate a 5-question multiple-choice quiz using AI
export async function POST(request) {
  const body = await request.json();
  const { subject, topic, gradeLevel } = body;

  const VALID_SUBJECTS = ['Math', 'Science', 'English', 'History'];
  if (!subject || !VALID_SUBJECTS.includes(subject)) {
    return Response.json({ error: 'subject must be one of: Math, Science, English, History' }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
    return Response.json({ error: 'OpenAI API key is not configured.' }, { status: 503 });
  }

  const topicClause = topic ? ` specifically about "${topic}"` : '';
  const gradeClause = gradeLevel ? ` for a grade ${gradeLevel} student` : ' for a middle or high school student';

  const prompt = `Generate a 5-question multiple-choice quiz about ${subject}${topicClause}${gradeClause}.

Return ONLY valid JSON — no markdown, no explanation, just JSON — in this exact format:
{
  "questions": [
    {
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": "A"
    }
  ]
}

Rules:
- Each question must have exactly 4 options labelled A, B, C, D.
- The "answer" field must be the single letter (A, B, C, or D) of the correct option.
- Questions should be clear, educational, and appropriate for the grade level.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert tutor who creates clear, accurate multiple-choice quizzes for middle and high school students. Always respond with valid JSON only — no markdown code fences, no extra text.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const raw = completion.choices[0].message.content.trim();

    // Strip markdown code fences if the model includes them anyway
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    const parsed = JSON.parse(clean);

    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error('Unexpected response format from AI');
    }

    return Response.json(parsed);
  } catch (err) {
    console.error('AI quiz generation error:', err);
    return Response.json({ error: 'Failed to generate quiz. Please try again.' }, { status: 500 });
  }
}
