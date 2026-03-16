"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

interface LessonDetail {
  id: string;
  title: string;
  subject: "Math" | "Science";
  content: string;
  videoUrl?: string;
  duration?: number;
  difficulty?: string;
  quizzes: Array<{ id: string; title: string }>;
}

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { student } = useAuth();

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lessons/${id}`);
        if (!res.ok) throw new Error("Lesson not found");
        const data = await res.json();
        setLesson(data);
      } catch {
        setError("Could not load this lesson. Please go back and try again.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchLesson();
  }, [id]);

  const handleSubmit = async () => {
    if (!lesson) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "lesson",
          studentId: student?.id,
          lessonId: lesson.id,
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitError("Failed to save your progress. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ height: 40, width: "60%", borderRadius: 10, background: "white", marginBottom: 16, animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: 20, width: "40%", borderRadius: 10, background: "white", marginBottom: 32, animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: 200, borderRadius: 16, background: "white", animation: "pulse 1.5s ease-in-out infinite" }} />
        <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.5} }`}</style>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>😔</p>
        <p style={{ color: "var(--color-text-muted)", marginBottom: 20, fontFamily: "var(--font-body)" }}>{error}</p>
        <Link href="/lessons" className="btn-primary" style={{ textDecoration: "none" }}>← Back to Lessons</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
      {/* Back */}
      <Link
        href="/lessons"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
          marginBottom: 28,
          transition: "color 0.15s",
        }}
      >
        ← Back to Lessons
      </Link>

      {/* Lesson Header */}
      <div className="animate-fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              background: lesson.subject === "Math" ? "#DBEAFE" : "#D1FAE5",
              color: lesson.subject === "Math" ? "#2563EB" : "#059669",
            }}
          >
            {lesson.subject === "Math" ? "📐" : "🔬"} {lesson.subject}
          </span>
          {lesson.duration != null && (
            <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontFamily: "var(--font-display)", fontWeight: 600, background: "#F1F5F9", color: "var(--color-text-muted)" }}>
              ⏱ {lesson.duration} min
            </span>
          )}
          {lesson.difficulty != null && (
            <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontFamily: "var(--font-display)", fontWeight: 600, background: "#F1F5F9", color: "var(--color-text-muted)" }}>
              {lesson.difficulty}
            </span>
          )}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(24px, 4vw, 36px)",
            letterSpacing: "-0.6px",
            lineHeight: 1.2,
          }}
        >
          {lesson.title}
        </h1>
      </div>

      {/* Lesson Content */}
      <div
        className="card animate-fade-up delay-100"
        style={{ padding: 32, marginBottom: 28, opacity: 0 }}
      >
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 16, color: "var(--color-primary)" }}>
          Lesson Content
        </h2>
        {lesson.videoUrl && (
          <div
            style={{
              background: "#0F172A",
              borderRadius: 12,
              aspectRatio: "16/9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
              overflow: "hidden",
            }}
          >
            <div style={{ textAlign: "center", color: "white" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>▶</div>
              <p style={{ fontSize: 14, opacity: 0.6, fontFamily: "var(--font-body)" }}>Video Lesson</p>
            </div>
          </div>
        )}
        <div
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: "var(--color-text)",
            fontFamily: "var(--font-body)",
            whiteSpace: "pre-wrap",
          }}
        >
          {lesson.content}
        </div>
      </div>

      {/* Mark as Complete */}
      {!submitted ? (
        <div
          className="card animate-fade-up delay-200"
          style={{ padding: 24, marginBottom: 28, opacity: 0, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}
        >
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Finished reading?</p>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
              Mark this lesson as complete to track your progress.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            {submitError && (
              <p style={{ fontSize: 13, color: "#DC2626", fontFamily: "var(--font-body)" }}>{submitError}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary"
              style={{ fontSize: 15, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
            >
              {submitting ? "Saving..." : "✓ Mark as Complete"}
            </button>
          </div>
        </div>
      ) : (
        <div
          className="card animate-fade-up delay-200"
          style={{ padding: 24, marginBottom: 28, background: "#D1FAE5", border: "1px solid #6EE7B7", opacity: 0, display: "flex", alignItems: "center", gap: 14 }}
        >
          <span style={{ fontSize: 28 }}>&#127881;</span>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#059669" }}>Lesson complete!</p>
            <p style={{ fontSize: 14, color: "#065F46", fontFamily: "var(--font-body)" }}>
              Your progress has been saved.{" "}
              <Link href="/progress" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>View your progress →</Link>
            </p>
          </div>
        </div>
      )}

      {/* Quiz Section — renders only when quiz questions are available */}
      {lesson.quizzes?.length > 0 && (
        <div className="animate-fade-up delay-300" style={{ opacity: 0 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 16 }}>
            Quizzes ({lesson.quizzes.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {lesson.quizzes.map((q) => (
              <div key={q.id} className="card" style={{ padding: "16px 20px" }}>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>{q.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}