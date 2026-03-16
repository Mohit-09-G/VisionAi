"use client";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "16px 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 11,
          color: "var(--text3)",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span>© {new Date().getFullYear()} VisionAI · OAP Cabinet Inspection</span>
        <span style={{ display: "flex", gap: 12 }}>
          <span>SaaS demo UI</span>
          <span>·</span>
          <span>All rights reserved</span>
        </span>
      </div>
    </footer>
  );
}