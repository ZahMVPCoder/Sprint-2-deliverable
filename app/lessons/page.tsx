"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  subject: "Math" | "Science";
  description: string;
  duration: number;
  completed: boolean;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

type Filter = "All" | "Math" | "Science";

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
    Math: lessons.filter((l) => l.subject === "Math").length,
    Science: lessons.filter((l) => l.subject === "Science").length,
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 36 }}>
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
        {(["All", "Math", "Science"] as Filter[]).map((tab) => (
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
              {counts[tab]}
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
                      background: lesson.subject === "Math" ? "#DBEAFE" : "#D1FAE5",
                      color: lesson.subject === "Math" ? "#2563EB" : "#059669",
                    }}
                  >
                    {lesson.subject === "Math" ? "📐" : "🔬"} {lesson.subject}
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

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
