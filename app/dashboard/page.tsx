"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ActivityItem {
  id: string;
  type: "lesson" | "quiz";
  title: string;
  subject: string;
  score?: number;
  completedAt: string;
}

interface StudentDetail {
  id: string;
  name: string;
  gradeLevel: number;
  lessonsCompleted: number;
  averageQuizScore: number;
  recentActivity: ActivityItem[];
}

function StatCard({
  label,
  value,
  icon,
  color,
  delay,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  delay: string;
}) {
  return (
    <div
      className={`card animate-fade-up ${delay}`}
      style={{ padding: 24, opacity: 0 }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      </div>
      <p style={{ fontSize: 28, fontFamily: "var(--font-display)", fontWeight: 800, marginBottom: 4 }}>
        {value}
      </p>
      <p style={{ fontSize: 14, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
        {label}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { student } = useAuth();
  const router = useRouter();
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!student) {
      router.push("/login");
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/students/${student.id}`);
        if (!res.ok) throw new Error("Failed to fetch student data");
        const data = await res.json();
        // Strip passwordHash if present
        const { passwordHash: _removed, ...safe } = data;
        setDetail(safe);
      } catch {
        setError("Could not load your dashboard. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [student, router]);

  if (!student) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 14, color: "var(--color-text-muted)", fontFamily: "var(--font-body)", marginBottom: 6 }}>
          Welcome back 👋
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 40px)",
            letterSpacing: "-0.8px",
          }}
        >
          {loading ? "Loading..." : detail?.name ?? student.name}
        </h1>
        {!loading && detail && (
          <p style={{ color: "var(--color-text-muted)", fontSize: 16, marginTop: 6, fontFamily: "var(--font-body)" }}>
            Grade {detail.gradeLevel} Student
          </p>
        )}
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
            fontFamily: "var(--font-body)",
          }}
        >
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginBottom: 36,
        }}
      >
        <StatCard
          label="Grade Level"
          value={loading ? "—" : `Grade ${detail?.gradeLevel ?? "—"}`}
          color="#D1FAE5"
          delay="delay-100"
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2L2 7l9 5 9-5-9-5zM2 12l9 5 9-5M2 17l9 5 9-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <StatCard
          label="Lessons Completed"
          value={loading ? "—" : detail?.lessonsCompleted ?? 0}
          color="#DBEAFE"
          delay="delay-200"
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="3" width="16" height="16" rx="4" stroke="#3B82F6" strokeWidth="2" />
              <path d="M8 11l2.5 2.5L14 8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <StatCard
          label="Avg Quiz Score"
          value={loading ? "—" : `${detail?.averageQuizScore ?? 0}%`}
          color="#FEF3C7"
          delay="delay-300"
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2l2.5 6.5H20l-5.5 4 2 6.5L11 15l-5.5 4 2-6.5L2 8.5h6.5L11 2z" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          }
        />
        <StatCard
          label="Subject Focus"
          value="Math & Science"
          color="#F3E8FF"
          delay="delay-400"
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#8B5CF6" strokeWidth="2" />
              <path d="M11 7v4l3 2" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          }
        />
      </div>

      {/* Recent Activity */}
      <div
        className="animate-fade-up delay-300"
        style={{
          background: "white",
          borderRadius: 20,
          border: "1px solid var(--color-border)",
          padding: 28,
          opacity: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20 }}>
            Recent Activity
          </h2>
          <Link
            href="/progress"
            style={{
              fontSize: 14,
              color: "var(--color-primary)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 60,
                  borderRadius: 10,
                  background: "var(--color-bg)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : !detail?.recentActivity?.length ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📚</p>
            <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
              No recent activity yet.{" "}
              <Link href="/lessons" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>
                Start a lesson!
              </Link>
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {detail.recentActivity.map((item, i) => (
              <div
                key={item.id}
                className={`animate-slide-in delay-${(i + 1) * 100}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "var(--color-bg)",
                  opacity: 0,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: item.type === "quiz" ? "#DBEAFE" : "#D1FAE5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.type === "quiz" ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 2l2 5h5l-4 3 1.5 5L9 12l-4.5 3L6 10 2 7h5L9 2z" stroke="#3B82F6" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M4 4h10v2H4zM4 8h10v2H4zM4 12h6v2H4z" fill="#10B981" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
                    {item.subject} · {new Date(item.completedAt).toLocaleDateString()}
                  </p>
                </div>
                {item.score != null && (
                  <div
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: item.score >= 70 ? "#D1FAE5" : "#FEE2E2",
                      color: item.score >= 70 ? "#059669" : "#DC2626",
                      fontSize: 13,
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {item.score}%
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
