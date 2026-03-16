"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  subject: "Math" | "Science" | "English" | "History";
  description: string;
  duration: number;
  completed: boolean;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

type Filter = "All" | "Math" | "Science" | "English" | "History";

const SUBJECT_STYLE: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  Math:    { bg: "#DBEAFE", text: "#2563EB", border: "#BFDBFE", icon: "📐" },
  Science: { bg: "#D1FAE5", text: "#059669", border: "#A7F3D0", icon: "🔬" },
  English: { bg: "#FEF3C7", text: "#D97706", border: "#FDE68A", icon: "📚" },
  History: { bg: "#EDE9FE", text: "#7C3AED", border: "#DDD6FE", icon: "🏛️" },
};

const difficultyColor: Record<string, string> = {
  Beginner: "#D1FAE5",
  Intermediate: "#FEF3C7",
  Advanced: "#FEE2E2",
};
const difficultyText: Record<string, string> = {
  Beginner: "#059669",
  Intermediate: "#D97706",
  Advanced: "#DC2626",
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add-lesson modal
  const [showModal, setShowModal]       = useState(false);
  const [newTitle, setNewTitle]         = useState("");
  const [newSubject, setNewSubject]     = useState<"Math" | "Science" | "English" | "History" | "">(");
  const [newContent, setNewContent]     = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const [submitError, setSubmitError]   = useState("");

  const openModal = () => {
    setNewTitle(""); setNewSubject(""); setNewContent(""); setSubmitError("");
    setShowModal(true);
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubject || !newContent.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim(), subject: newSubject, content: newContent.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create lesson");
      setLessons((prev) => [data, ...prev]);
      setShowModal(false);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch("/api/lessons");
        if (!res.ok) throw new Error("Failed to fetch lessons");
        const data = await res.json();
        setLessons(data);
      } catch {
        setError("Could not load lessons. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  const filtered = filter === "All" ? lessons : lessons.filter((l) => l.subject === filter);

  const counts = {
    All: lessons.length,
    Math:    lessons.filter((l) => l.subject === "Math").length,
    Science: lessons.filter((l) => l.subject === "Science").length,
    English: lessons.filter((l) => l.subject === "English").length,
    History: lessons.filter((l) => l.subject === "History").length,
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 36, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 40px)",
              letterSpacing: "-0.8px",
              marginBottom: 10,
            }}
          >
            Lessons
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: 16, fontFamily: "var(--font-body)" }}>
            Browse all available lessons in Math and Science.
          </p>
        </div>
        <button
          onClick={openModal}
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            border: "none",
            background: "var(--color-primary)",
            color: "white",
            boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
            whiteSpace: "nowrap",
            marginTop: 4,
          }}
        >
          + Add Lesson
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        className="animate-fade-up delay-100"
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 28,
          opacity: 0,
          flexWrap: "wrap",
        }}
      >
        {(["All", "Math", "Science", "English", "History"] as Filter[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: "8px 20px",
              borderRadius: 999,
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              border: "none",
              transition: "all 0.15s ease",
              background: filter === tab ? "var(--color-primary)" : "white",
              color: filter === tab ? "white" : "var(--color-text-muted)",
              boxShadow: filter === tab
                ? "0 2px 8px rgba(16,185,129,0.3)"
                : "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            {tab}{" "}
            <span
              style={{
                opacity: 0.75,
                fontSize: 12,
                marginLeft: 4,
              }}
            >
              {counts[tab as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 24,
            color: "#DC2626",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {/* Lessons Grid */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                height: 200,
                borderRadius: 16,
                background: "white",
                border: "1px solid var(--color-border)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
          <p style={{ color: "var(--color-text-muted)", fontSize: 16, fontFamily: "var(--font-body)" }}>
            No {filter !== "All" ? filter : ""} lessons found.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {filtered.map((lesson, i) => (
            <Link
              key={lesson.id}
              href={`/lessons/${lesson.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className={`card animate-fade-up delay-${Math.min((i % 6 + 1) * 100, 500)}`}
                style={{
                  padding: 24,
                  opacity: 0,
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                {/* Completed badge */}
                {lesson.completed && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Completed"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                {/* Subject pill */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      background: SUBJECT_STYLE[lesson.subject]?.bg ?? "#F1F5F9",
                      color: SUBJECT_STYLE[lesson.subject]?.text ?? "var(--color-text-muted)",
                    }}
                  >
                    {SUBJECT_STYLE[lesson.subject]?.icon ?? "📖"} {lesson.subject}
                  </span>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      background: difficultyColor[lesson.difficulty],
                      color: difficultyText[lesson.difficulty],
                    }}
                  >
                    {lesson.difficulty}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 17,
                    marginBottom: 10,
                    lineHeight: 1.3,
                    color: "var(--color-text)",
                    paddingRight: lesson.completed ? 32 : 0,
                  }}
                >
                  {lesson.title}
                </h3>

                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-muted)",
                    lineHeight: 1.6,
                    fontFamily: "var(--font-body)",
                    marginBottom: 16,
                  }}
                >
                  {lesson.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "auto",
                    paddingTop: 12,
                    borderTop: "1px solid var(--color-border)",
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
                    ⏱ {lesson.duration} min
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--color-primary)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                    }}
                  >
                    {lesson.completed ? "Review →" : "Start →"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Add Lesson Modal ── */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(15,23,42,0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 20,
              padding: 32,
              width: "100%",
              maxWidth: 540,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              animation: "slideUp 0.2s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, margin: 0 }}>Add New Lesson</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "var(--color-text-muted)", lineHeight: 1, padding: 4 }}
              >
                ×
              </button>
            </div>

            {submitError && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 20, color: "#DC2626", fontSize: 14, fontFamily: "var(--font-body)" }}>
                {submitError}
              </div>
            )}

            <form onSubmit={handleAddLesson}>
              {/* Title */}
              <label style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Title *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Introduction to Algebra"
                required
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 10,
                  border: "1.5px solid var(--color-border)", fontFamily: "var(--font-body)",
                  fontSize: 15, outline: "none", marginBottom: 18, color: "var(--color-text)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                onBlur={(e)  => (e.target.style.borderColor = "var(--color-border)")}
              />

              {/* Subject */}
              <label style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Subject *</label>
              <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                {(["Math", "Science", "English", "History"] as const).map((s) => {
                  const ss = SUBJECT_STYLE[s];
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewSubject(s)}
                      style={{
                        flex: 1, padding: "10px 0", borderRadius: 10,
                        border: `1.5px solid ${newSubject === s ? ss.border : "var(--color-border)"}`,
                        background: newSubject === s ? ss.bg : "white",
                        color: newSubject === s ? ss.text : "var(--color-text-muted)",
                        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, cursor: "pointer",
                      }}
                    >
                      {ss.icon} {s}
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <label style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Content *</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write the lesson content here…"
                required
                rows={5}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 10,
                  border: "1.5px solid var(--color-border)", fontFamily: "var(--font-body)",
                  fontSize: 15, outline: "none", marginBottom: 24, color: "var(--color-text)",
                  resize: "vertical", lineHeight: 1.6,
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                onBlur={(e)  => (e.target.style.borderColor = "var(--color-border)")}
              />

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1, padding: "12px 0", borderRadius: 10,
                    border: "1.5px solid var(--color-border)", background: "white",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
                    cursor: "pointer", color: "var(--color-text-muted)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newTitle.trim() || !newSubject || !newContent.trim()}
                  style={{
                    flex: 2, padding: "12px 0", borderRadius: 10,
                    border: "none", background: "var(--color-primary)", color: "white",
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
                    cursor: submitting || !newTitle.trim() || !newSubject || !newContent.trim() ? "not-allowed" : "pointer",
                    opacity: submitting || !newTitle.trim() || !newSubject || !newContent.trim() ? 0.5 : 1,
                  }}
                >
                  {submitting ? "Creating…" : "Create Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
