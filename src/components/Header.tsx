"use client";

import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(250,250,248,0.88)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
      }}
    >
      <nav
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 58,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: "var(--blue)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.5px",
            }}
          >
            VA
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>VisionAI</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>OAP Cabinet Inspection</div>
          </div>
        </div>

        {/* Desktop nav */}
        <div
          className="hidden md:flex"
          style={{ alignItems: "center", gap: 24 }}
        >
          <a
            href="#how-it-works"
            style={{ fontSize: 13, color: "var(--text2)", textDecoration: "none", fontWeight: 500 }}
          >
            How it works
          </a>
          <a
            href="#results"
            style={{ fontSize: 13, color: "var(--text2)", textDecoration: "none", fontWeight: 500 }}
          >
            Results
          </a>
          <a href="#upload" className="primary-btn" style={{ fontSize: 13 }}>
            Upload Image
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          style={{
            display: "flex",
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            border: "1px solid var(--border2)",
            background: "white",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 14,
              height: 10,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  height: 1.5,
                  width: "100%",
                  background: "var(--text2)",
                  borderRadius: 2,
                }}
              />
            ))}
          </span>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            background: "rgba(250,250,248,0.97)",
            padding: "8px 16px 16px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { href: "#how-it-works", label: "How it works" },
              { href: "#results", label: "Results" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  padding: "8px 10px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text2)",
                  textDecoration: "none",
                  borderRadius: 8,
                }}
              >
                {label}
              </a>
            ))}
            <a
              href="#upload"
              className="primary-btn"
              onClick={() => setOpen(false)}
              style={{ marginTop: 6, fontSize: 13, justifyContent: "center" }}
            >
              Upload Image
            </a>
          </div>
        </div>
      )}
    </header>
  );
}