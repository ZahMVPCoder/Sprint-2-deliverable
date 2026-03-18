
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import type { Student } from "../context/AuthContext";

type Subject = "Math" | "Science" | "English" | "History";
type Step = "setup" | "loading" | "quiz" | "results";

interface Question {
  question: string;
  options: string[]; // ["A. ...", "B. ...", "C. ...", "D. ..."]
  answer: string;   // "A" | "B" | "C" | "D"
}

type ResultsSectionProps = {
  student: Student | null;
  subject: Subject | null;
  topic: string;
  questions: Question[];
  answers: { selected: string; correct: string }[];
  score: number;
  pct: number;
  scoreColor: string;
  scoreBg: string;
  scoreEmoji: string;
  scoreMsg: string;
  generate: () => void;
  reset: () => void;
};

function ResultsSection({
  student,
  subject,
  topic,
  questions,
  answers,
  score,
  pct,
  scoreColor,
  scoreBg,
  scoreEmoji,
  scoreMsg,
  generate,
  reset,
}: ResultsSectionProps) {
  useEffect(() => {
    if (!student?.id || !subject || !questions?.length || !answers?.length) return;
    const payload = {
      studentId: student.id,
      type: "quiz",
      subject,
      topic: topic || undefined,
      score,
      total: questions.length,
      correct: score,
      answers,
      questions,
    };
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }, [student, subject, topic, questions, answers, score]);
  return (
    <div>
      <div className="card animate-fade-up" style={{ padding: 32, textAlign: "center", marginBottom: 20 }}>
        <div style={{
          width: 80, height: 80,
          borderRadius: "50%",
          background: scoreBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
          fontSize: 36,
        }}>
          {scoreEmoji}
        </div>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 42, marginBottom: 4, color: scoreColor }}>
          {pct}%
        </p>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
          {score} out of {questions.length} correct
        </p>
        <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-body)", fontSize: 14 }}>
          {scoreMsg}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {questions.map((q, i) => {
          const a = answers[i];
          const correct = a?.selected === a?.correct;
          const correctOption = q.options.find((opt) => opt.startsWith(a?.correct + "."));
          return (
            <div key={i} className="card" style={{ padding: 20, borderLeft: `4px solid ${correct ? "#10B981" : "#EF4444"}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: correct ? 0 : 8 }}>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--color-text)", flex: 1, lineHeight: 1.5 }}>
                  {i + 1}. {q.question}
                </p>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{correct ? "✅" : "❌"}</span>
              </div>
              {!correct && correctOption && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#059669" }}>
                  ✓ Correct: {correctOption.replace(/^[A-D]\.\s*/, "")}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={generate}
          style={{
            flex: 1,
            padding: "14px 24px",
            borderRadius: 12,
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            border: "none",
            background: "var(--color-primary)",
            color: "white",
          }}
        >
          Retry Same Topic ↩
        </button>
        <button
          onClick={reset}
          style={{
            flex: 1,
            padding: "14px 24px",
            borderRadius: 12,
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            border: "1.5px solid var(--color-border)",
            background: "white",
            color: "var(--color-text)",
          }}
        >
          New Quiz +
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="card animate-fade-up" style={{ padding: 32, textAlign: "center", marginBottom: 20 }}>
        <div style={{
          width: 80, height: 80,
          borderRadius: "50%",
          background: scoreBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
          fontSize: 36,
        }}>
          {scoreEmoji}
        </div>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 42, marginBottom: 4, color: scoreColor }}>
          {pct}%
        </p>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
          {score} out of {questions.length} correct
        </p>
        <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-body)", fontSize: 14 }}>
          {scoreMsg}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {questions.map((q, i) => {
          const a = answers[i];
          const correct = a?.selected === a?.correct;
          const correctOption = q.options.find((opt) => opt.startsWith(a?.correct + "."));
          return (
            <div key={i} className="card" style={{ padding: 20, borderLeft: `4px solid ${correct ? "#10B981" : "#EF4444"}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: correct ? 0 : 8 }}>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--color-text)", flex: 1, lineHeight: 1.5 }}>
                  {i + 1}. {q.question}
                </p>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{correct ? "✅" : "❌"}</span>
              </div>
              {!correct && correctOption && (
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#059669" }}>
                  ✓ Correct: {correctOption.replace(/^[A-D]\.\s*/, "")}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={generate}
          style={{
            flex: 1,
            padding: "14px 24px",
            borderRadius: 12,
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            border: "none",
            background: "var(--color-primary)",
            color: "white",
          }}
        >
          Retry Same Topic ↩
        </button>
        <button
          onClick={reset}
          style={{
            flex: 1,
            padding: "14px 24px",
            borderRadius: 12,
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            border: "1.5px solid var(--color-border)",
            background: "white",
            color: "var(--color-text)",
          }}
        >
          New Quiz +
        </button>
      </div>
    </div>
  );
}
const SUBJECT_STYLE: Record<Subject, { bg: string; text: string; border: string; icon: string }> = {
  Math:    { bg: "#DBEAFE", text: "#2563EB", border: "#BFDBFE", icon: "📐" },
  Science: { bg: "#D1FAE5", text: "#059669", border: "#A7F3D0", icon: "🔬" },
  English: { bg: "#FEF3C7", text: "#D97706", border: "#FDE68A", icon: "📚" },
  History: { bg: "#EDE9FE", text: "#7C3AED", border: "#DDD6FE", icon: "🏛️" },
};

export default function AIQuizPage() {
  const { student } = useAuth();

  const [step, setStep]         = useState<Step>("setup");
  const [subject, setSubject]   = useState<Subject | null>(null);
  const [topic, setTopic]       = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers]   = useState<{ selected: string; correct: string }[]>([]);
  const [error, setError]       = useState("");

  const generate = async () => {
    if (!subject) return;
    setStep("loading");
    setError("");
    try {
      const res = await fetch("/api/ai-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic: topic.trim() || undefined,
          gradeLevel: student?.gradeLevel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate quiz");
      setQuestions(data.questions);
      setCurrent(0);
      setAnswers([]);
      setSelected(null);
      setStep("quiz");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStep("setup");
    }
  };

  const handleSelect = (letter: string) => {
    if (selected !== null) return;
    setSelected(letter);
  };

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, { selected, correct: questions[current].answer }];
    setAnswers(newAnswers);
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setStep("results");
    }
  };

  const reset = () => {
    setStep("setup");
    setSubject(null);
    setTopic("");
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setError("");
  };

  const score = answers.filter((a) => a.selected === a.correct).length;
  const pct   = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const scoreColor = pct >= 80 ? "#059669" : pct >= 60 ? "#D97706" : "#DC2626";
  const scoreBg    = pct >= 80 ? "#D1FAE5" : pct >= 60 ? "#FEF3C7" : "#FEE2E2";
  const scoreEmoji = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "💪";
  const scoreMsg   = pct >= 80
    ? "Excellent work! You really know your stuff."
    : pct >= 60
    ? "Good effort! Keep studying to improve."
    : "Keep practising — you'll get there!";

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
      {/* Page header */}
      <div className="animate-fade-up" style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.8px", marginBottom: 10 }}>
          ✨ AI Quiz Generator
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: 16, fontFamily: "var(--font-body)" }}>
          Choose a subject and let AI build a personalised quiz just for you.
        </p>
      </div>

      {/* ── SETUP ── */}
      {step === "setup" && (
        <div className="card animate-fade-up" style={{ padding: 32 }}>
          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 24, color: "#DC2626", fontSize: 14, fontFamily: "var(--font-body)" }}>
              {error}
            </div>
          )}

          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 14, color: "var(--color-text)" }}>
            Choose a subject
          </p>
          <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
            {(["Math", "Science", "English", "History"] as Subject[]).map((s) => {
              const style = SUBJECT_STYLE[s];
              const active = subject === s;
              return (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  style={{
                    flex: 1,
                    padding: "20px 16px",
                    borderRadius: 14,
                    border: `2px solid ${active ? style.border : "var(--color-border)"}`,
                    background: active ? style.bg : "white",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 17,
                    color: active ? style.text : "var(--color-text-muted)",
                  }}
                >
                  {style.icon} {s}
                </button>
              );
            })}
          </div>

          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 10, color: "var(--color-text)" }}>
            Topic{" "}
            <span style={{ fontWeight: 400, color: "var(--color-text-muted)", fontSize: 13 }}>(optional)</span>
          </p>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && subject) generate(); }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
            onBlur={(e)  => (e.target.style.borderColor = "var(--color-border)")}
                placeholder={subject ? ({ Math: "e.g. Fractions, Algebra", Science: "e.g. Photosynthesis, Cells", English: "e.g. Poetry, Grammar", History: "e.g. World War II, Ancient Rome" } as Record<Subject, string>)[subject] : "e.g. Enter a specific topic"}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 10,
              border: "1.5px solid var(--color-border)",
              fontFamily: "var(--font-body)",
              fontSize: 15,
              outline: "none",
              marginBottom: 28,
              color: "var(--color-text)",
              background: "white",
            }}
          />

          <button
            onClick={generate}
            disabled={!subject}
            style={{
              width: "100%",
              padding: "14px 24px",
              borderRadius: 12,
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              cursor: subject ? "pointer" : "not-allowed",
              opacity: subject ? 1 : 0.45,
              border: "none",
              background: "var(--color-primary)",
              color: "white",
              transition: "opacity 0.15s ease",
            }}
          >
            Generate Quiz →
          </button>
        </div>
      )}

      {/* ── LOADING ── */}
      {step === "loading" && (
        <div className="card animate-fade-up" style={{ padding: 60, textAlign: "center" }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: "50%",
            border: "4px solid var(--color-primary-light)",
            borderTopColor: "var(--color-primary)",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 20px",
          }} />
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Generating your {subject} quiz…
          </p>
          <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-body)", fontSize: 14 }}>
            This only takes a few seconds.
          </p>
        </div>
      )}

      {/* ── QUIZ ── */}
      {step === "quiz" && questions[current] && (() => {
        const q = questions[current];
        const letters = ["A", "B", "C", "D"];

        return (
          <div>
            {/* Progress header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--color-text-muted)" }}>
                Question {current + 1} of {questions.length}
              </span>
              {subject && (
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: SUBJECT_STYLE[subject].text }}>
                  {SUBJECT_STYLE[subject].icon} {subject}
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div style={{ height: 6, borderRadius: 999, background: "var(--color-border)", marginBottom: 24 }}>
              <div style={{
                height: "100%",
                borderRadius: 999,
                background: "var(--color-primary)",
                width: `${(current / questions.length) * 100}%`,
                transition: "width 0.35s ease",
              }} />
            </div>

            {/* Question card */}
            <div className="card animate-fade-up" style={{ padding: 28, marginBottom: 16 }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, lineHeight: 1.55, marginBottom: 24 }}>
                {q.question}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.options.map((opt, i) => {
                  const letter = letters[i];
                  const isSelected = selected === letter;
                  const isCorrect  = q.answer === letter;
                  const showResult = selected !== null;

                  let bg = "white", borderColor = "var(--color-border)", textColor = "var(--color-text)";
                  if (showResult) {
                    if (isCorrect)       { bg = "#D1FAE5"; borderColor = "#6EE7B7"; textColor = "#065F46"; }
                    else if (isSelected) { bg = "#FEE2E2"; borderColor = "#FCA5A5"; textColor = "#991B1B"; }
                  } else if (isSelected) {
                    bg = "var(--color-primary-light)";
                    borderColor = "var(--color-primary)";
                  }

                  return (
                    <button
                      key={letter}
                      onClick={() => handleSelect(letter)}
                      disabled={selected !== null}
                      style={{
                        padding: "13px 18px",
                        borderRadius: 12,
                        border: `1.5px solid ${borderColor}`,
                        background: bg,
                        cursor: selected !== null ? "default" : "pointer",
                        textAlign: "left",
                        fontFamily: "var(--font-body)",
                        fontSize: 15,
                        color: textColor,
                        transition: "all 0.15s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <span style={{
                        width: 28, height: 28,
                        borderRadius: "50%",
                        border: `1.5px solid ${borderColor}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 13,
                        flexShrink: 0,
                        background: isSelected && !showResult ? "var(--color-primary)" : "transparent",
                        color:      isSelected && !showResult ? "white" : "inherit",
                        transition: "all 0.15s ease",
                      }}>
                        {letter}
                      </span>
                      {/* Strip "A. " prefix if AI included it */}
                      {opt.replace(/^[A-D]\.\s*/, "")}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={selected === null}
              style={{
                width: "100%",
                padding: "14px 24px",
                borderRadius: 12,
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                cursor: selected ? "pointer" : "not-allowed",
                opacity: selected ? 1 : 0.4,
                border: "none",
                background: "var(--color-primary)",
                color: "white",
                transition: "opacity 0.15s ease",
              }}
            >
              {current + 1 < questions.length ? "Next Question →" : "See Results →"}
            </button>
          </div>
        );
      })()}

      {/* ── RESULTS ── */}
      {step === "results" && (
        <ResultsSection
          student={student}
          subject={subject}
          topic={topic}
          questions={questions}
          answers={answers}
          score={score}
          pct={pct}
          scoreColor={scoreColor}
          scoreBg={scoreBg}
          scoreEmoji={scoreEmoji}
          scoreMsg={scoreMsg}
          generate={generate}
          reset={reset}
        />
      )}


      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
