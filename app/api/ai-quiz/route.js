
// Use Ollama HTTP API instead of OpenAI
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://host.docker.internal:11434/api/chat';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

// POST /api/ai-quiz — generate a 5-question multiple-choice quiz using AI
export async function POST(request) {
  const body = await request.json();
  const { subject, topic, gradeLevel } = body;

  const VALID_SUBJECTS = ['Math', 'Science', 'English', 'History'];
  if (!subject || !VALID_SUBJECTS.includes(subject)) {
    return Response.json({ error: 'subject must be one of: Math, Science, English, History' }, { status: 400 });
  }


  if (!OLLAMA_MODEL) {
    return Response.json({ error: 'Ollama model is not configured.' }, { status: 503 });
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
    // Ollama expects: { model, messages: [{role, content}], stream }
    const ollamaRes = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert tutor who creates clear, accurate multiple-choice quizzes for middle and high school students. Always respond with valid JSON only — no markdown code fences, no extra text.'
          },
          { role: 'user', content: prompt }
        ],
        stream: false
      })
    });
    if (!ollamaRes.ok) {
      const errText = await ollamaRes.text();
      throw new Error(`Ollama error: ${ollamaRes.status} ${errText}`);
    }
    const ollamaData = await ollamaRes.json();
    // Ollama returns { message: { content: string } }
    const raw = ollamaData.message?.content?.trim?.() || '';
    // Strip markdown code fences if present
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
