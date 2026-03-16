"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProgressEntry {
  id: string;
  lessonId: string;
  lessonTitle: string;
  subject: string;
  score: number;
  completedAt: string;
}

interface ProgressData {
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
  entries: ProgressEntry[];
}

function ProgressBar({ value, max, color = "var(--color-primary)" }: { value: number; max: number; color?: string }) {
  const pct = max === 0 ? 0 : Math.min((value / max) * 100, 100);
  return (
    <div className="progress-bar-track">
      <div
        className="progress-bar-fill"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const bg = score >= 80 ? "#D1FAE5" : score >= 60 ? "#FEF3C7" : "#FEE2E2";
  const color = score >= 80 ? "#059669" : score >= 60 ? "#D97706" : "#DC2626";
  return (
    <span
      style={{
        padding: "4px 12px",
        borderRadius: 999,
        background: bg,
        color,
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      {score}%
    </span>
  );
}

export default function ProgressPage() {
  const { student } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!student) {
      router.push("/login");
      return;
    }

    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/progress?studentId=${student.id}`);
        if (!res.ok) throw new Error("Failed to fetch progress");
        const json = await res.json();
        // Ensure entries always exists regardless of API version
        setData({ ...json, entries: json.entries ?? [] });
      } catch {
        setError("Could not load your progress. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [student, router]);

  if (!student) return null;

  const completionPct =
    data && data.totalLessons > 0
      ? Math.round((data.completedLessons / data.totalLessons) * 100)
      : 0;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
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
          Your Progress
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: 16, fontFamily: "var(--font-body)" }}>
          Track your lessons and quiz performance over time.
        </p>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "14px 18px", marginBottom: 24, color: "#DC2626", fontSize: 14, fontFamily: "var(--font-body)" }}>
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {!loading && data && (
        <div
          className="animate-fade-up delay-100"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginBottom: 32,
            opacity: 0,
          }}
        >
          {[
            { label: "Lessons Completed", value: `${data.completedLessons} / ${data.totalLessons}`, icon: "📚", color: "#D1FAE5" },
            { label: "Completion Rate", value: `${completionPct}%`, icon: "✅", color: "#DBEAFE" },
            { label: "Average Score", value: `${data.averageScore}%`, icon: "⭐", color: "#FEF3C7" },
            { label: "Quizzes Taken", value: data.entries?.length ?? 0, icon: "📝", color: "#F3E8FF" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card"
              style={{ padding: 22 }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: stat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  marginBottom: 12,
                }}
              >
                {stat.icon}
              </div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, marginBottom: 4 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Completion Progress Bar */}
      {!loading && data && (
        <div
          className="card animate-fade-up delay-200"
          style={{ padding: 28, marginBottom: 28, opacity: 0 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>
              Overall Completion
            </h2>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--color-primary)" }}>
              {completionPct}%
            </span>
          </div>
          <ProgressBar value={data.completedLessons} max={data.totalLessons} />
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 10, fontFamily: "var(--font-body)" }}>
            {data.completedLessons} of {data.totalLessons} lessons completed
          </p>

          {/* Subject breakdown */}
          {data.entries.length > 0 && (
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              {(["Math", "Science", "English", "History"] as const).map((subj) => {
                const icons: Record<string, string> = { Math: "📐", Science: "🔬", English: "📚", History: "🏛️" };
                const colors: Record<string, string> = { Math: "var(--color-secondary)", Science: "var(--color-primary)", English: "#D97706", History: "#7C3AED" };
                const subjEntries = data.entries.filter((e) => e.subject === subj);
                const subjAvg = subjEntries.length
                  ? Math.round(subjEntries.reduce((s, e) => s + e.score, 0) / subjEntries.length)
                  : 0;
                return (
                  <div key={subj}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontFamily: "var(--font-display)", fontWeight: 600 }}>
                        {icons[subj]} {subj}
                      </span>
                      <span style={{ fontSize: 14, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
                        {subjEntries.length} quiz{subjEntries.length !== 1 ? "zes" : ""} · avg {subjAvg}%
                      </span>
                    </div>
                    <ProgressBar value={subjAvg} max={100} color={colors[subj]} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Quiz Score Table */}
      <div
        className="card animate-fade-up delay-300"
        style={{ padding: 28, opacity: 0 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>
            Quiz History
          </h2>
          <Link
            href="/lessons"
            style={{
              fontSize: 14,
              color: "var(--color-primary)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            + Take a Lesson
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ height: 50, borderRadius: 10, background: "var(--color-bg)", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : !data?.entries?.length ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>🎯</p>
            <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
              No quiz results yet.{" "}
              <Link href="/lessons" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>
                Start a lesson
              </Link>{" "}
              to see your scores here.
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto",
                gap: 12,
                padding: "8px 12px",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 12,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderBottom: "1px solid var(--color-border)",
                marginBottom: 8,
              }}
            >
              <span>Lesson</span>
              <span>Subject</span>
              <span>Score</span>
              <span>Date</span>
            </div>

            {/* Table rows */}
            {data.entries.map((entry, i) => (
              <div
                key={entry.id}
                className={`animate-slide-in delay-${Math.min((i % 5 + 1) * 100, 500)}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto auto",
                  gap: 12,
                  padding: "12px",
                  borderRadius: 10,
                  alignItems: "center",
                  background: i % 2 === 0 ? "transparent" : "var(--color-bg)",
                  opacity: 0,
                }}
              >
                <Link
                  href={`/lessons/${entry.lessonId}`}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--color-text)",
                    textDecoration: "none",
                  }}
                >
                  {entry.lessonTitle}
                </Link>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    background: ({ Math: "#DBEAFE", Science: "#D1FAE5", English: "#FEF3C7", History: "#EDE9FE" } as Record<string,string>)[entry.subject] ?? "#F1F5F9",
                    color: ({ Math: "#2563EB", Science: "#059669", English: "#D97706", History: "#7C3AED" } as Record<string,string>)[entry.subject] ?? "var(--color-text-muted)",
                  }}
                >
                  {entry.subject}
                </span>
                <ScoreBadge score={entry.score} />
                <span style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>
                  {new Date(entry.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.5} }
      `}</style>
    </div>
  );
}
