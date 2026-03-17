"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { student, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/lessons", label: "Lessons" },
    { href: "/ai-quiz", label: "AI Quiz ✨" },
    { href: "/progress", label: "Progress" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav
      style={{
        background: "white",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #10B981, #3B82F6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" fill="white" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 20,
              color: "var(--color-text)",
              letterSpacing: "-0.5px",
            }}
          >
            Bright<span style={{ color: "var(--color-primary)" }}>Path</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontFamily: "var(--font-display)",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: 15,
                  color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                  background: isActive ? "var(--color-primary-light)" : "transparent",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.color = "var(--color-primary)";
                    (e.target as HTMLElement).style.background = "#F0FDF4";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.color = "var(--color-text-muted)";
                    (e.target as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth Button */}
        <div>
          {mounted && student ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link
                href="/dashboard"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #10B981, #3B82F6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--color-text)",
                  }}
                >
                  {student.name.split(" ")[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--color-text-muted)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = "#EF4444";
                  (e.target as HTMLElement).style.color = "#EF4444";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = "var(--color-border)";
                  (e.target as HTMLElement).style.color = "var(--color-text-muted)";
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link
                href="/signup"
                style={{
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid var(--color-border)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--color-text)",
                  background: "white",
                  display: "inline-block",
                }}
              >
                Sign up
              </Link>
              <Link href="/login" className="btn-primary" style={{ textDecoration: "none", display: "inline-block", fontSize: 14 }}>
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
