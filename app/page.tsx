import Link from "next/link";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="8" fill="#D1FAE5" />
        <path d="M8 14l4 4 8-8" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Structured Lessons",
    description:
      "Step-by-step video lessons in Math and Science, designed for middle and high school students to learn at their own pace.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="8" fill="#DBEAFE" />
        <circle cx="14" cy="14" r="5" stroke="#3B82F6" strokeWidth="2.5" />
        <path d="M14 9V7M14 21v-2M9 14H7M21 14h-2" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Interactive Quizzes",
    description:
      "Reinforce every lesson with built-in quizzes. Get instant feedback and track how your understanding grows over time.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="8" fill="#D1FAE5" />
        <path d="M7 20l4-8 3 5 3-3 4 6" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Progress Tracking",
    description:
      "Visual dashboards show exactly where you stand — lessons completed, quiz scores, and areas to focus on next.",
  },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 24px 64px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        <div className="animate-fade-up">
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--color-primary-light)",
              color: "var(--color-primary-dark)",
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 13,
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--color-primary)",
                display: "inline-block",
              }}
            />
            Math &amp; Science Tutoring
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              color: "var(--color-text)",
              marginBottom: 20,
            }}
          >
            Learn smarter,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #10B981, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              go further.
            </span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "var(--color-text-muted)",
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 480,
              fontFamily: "var(--font-body)",
            }}
          >
            BrightPath helps middle and high school students master Math and
            Science through structured lessons, interactive quizzes, and
            real-time progress tracking.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/login" className="btn-primary" style={{ textDecoration: "none", fontSize: 16 }}>
              Get Started Free →
            </Link>
            <Link href="/lessons" className="btn-secondary" style={{ textDecoration: "none", fontSize: 16 }}>
              Browse Lessons
            </Link>
          </div>

          {/* Social proof */}
          <div
            style={{
              marginTop: 40,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ display: "flex" }}>
              {["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"].map((color, i) => (
                <div
                  key={i}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: color,
                    border: "2px solid white",
                    marginLeft: i === 0 ? 0 : -10,
                  }}
                />
              ))}
            </div>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
              <strong style={{ color: "var(--color-text)" }}>2,400+ students</strong> already learning
            </p>
          </div>
        </div>

        {/* Hero Visual */}
        <div
          className="animate-fade-in"
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              background: "white",
              borderRadius: 24,
              padding: 28,
              border: "1px solid var(--color-border)",
              boxShadow: "0 20px 60px rgba(16,185,129,0.12), 0 4px 16px rgba(0,0,0,0.06)",
            }}
          >
            {/* Mock dashboard card */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: "var(--color-text-muted)", fontFamily: "var(--font-display)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Your Progress
              </p>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 4 }}>
                Keep it up, Alex! 🎉
              </h3>
            </div>

            {[
              { label: "Algebra Basics", pct: 85, color: "#10B981" },
              { label: "Cell Biology", pct: 62, color: "#3B82F6" },
              { label: "Geometry", pct: 40, color: "#F59E0B" },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontFamily: "var(--font-display)", fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 14, color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>{item.pct}%</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: 20,
                padding: "12px 16px",
                background: "var(--color-primary-light)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 20 }}>⚡</span>
              <div>
                <p style={{ fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--color-primary-dark)" }}>
                  Next: Quadratic Equations
                </p>
                <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>Lesson 4 · 12 min</p>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div
            style={{
              position: "absolute",
              top: -16,
              right: -16,
              background: "var(--color-secondary)",
              color: "white",
              borderRadius: 12,
              padding: "10px 14px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 13,
              boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
            }}
          >
            📊 Live Tracking
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 40px)",
              letterSpacing: "-0.8px",
              marginBottom: 12,
            }}
          >
            Everything you need to succeed
          </h2>
          <p style={{ fontSize: 17, color: "var(--color-text-muted)", maxWidth: 480, margin: "0 auto" }}>
            Built for students who want real results — not just more content.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`card animate-fade-up delay-${(i + 1) * 100}`}
              style={{ padding: 28, opacity: 0 }}
            >
              <div style={{ marginBottom: 16 }}>{feature.icon}</div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 10,
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--color-text-muted)",
                  lineHeight: 1.65,
                  fontFamily: "var(--font-body)",
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "0 24px 80px" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
            borderRadius: 24,
            padding: "52px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(24px, 3vw, 36px)",
                color: "white",
                letterSpacing: "-0.5px",
                marginBottom: 10,
              }}
            >
              Ready to start your journey?
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-body)" }}>
              Join thousands of students already improving their grades on BrightPath.
            </p>
          </div>
          <Link
            href="/login"
            style={{
              textDecoration: "none",
              background: "white",
              color: "var(--color-primary-dark)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              padding: "14px 32px",
              borderRadius: 12,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              transition: "transform 0.15s ease",
              flexShrink: 0,
            }}
          >
            Create Your Free Account →
          </Link>
        </div>
      </section>
    </div>
  );
}
