"use client";

import { useMemo } from "react";
import type { OAPCheck } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

const STATUS_META = {
  pass: {
    icon: "✓",
    color: "var(--green)",
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.2)",
    badgeBg: "rgba(16,185,129,0.1)",
    leftBorder: "var(--green)",
  },
  fail: {
    icon: "✗",
    color: "var(--red)",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.2)",
    badgeBg: "rgba(239,68,68,0.1)",
    leftBorder: "var(--red)",
  },
  warning: {
    icon: "⚠",
    color: "var(--amber)",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.2)",
    badgeBg: "rgba(245,158,11,0.1)",
    leftBorder: "var(--amber)",
  },
  pending: {
    icon: "·",
    color: "var(--text3)",
    bg: "rgba(148,163,184,0.06)",
    border: "rgba(148,163,184,0.2)",
    badgeBg: "rgba(148,163,184,0.1)",
    leftBorder: "var(--text3)",
  },
} as const;

function CheckCard({ check }: { check: OAPCheck }) {
  const meta = STATUS_META[check.status] ?? STATUS_META.pending;
  const confidence = typeof check.confidence === "number" ? check.confidence : 0;
  const pct = Math.min(100, Math.max(0, confidence));

  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: 16,
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${meta.leftBorder}`,
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text3)" }}>
          {check.id}
        </span>
        <span
          style={{
            borderRadius: 50,
            padding: "2px 8px",
            fontSize: 10,
            fontWeight: 700,
            background: meta.badgeBg,
            color: meta.color,
            border: `1px solid ${meta.border}`,
          }}
        >
          {meta.icon} {check.status.toUpperCase()}
        </span>
        <span
          style={{
            border: "1px solid var(--border2)",
            borderRadius: 50,
            padding: "2px 7px",
            fontSize: 10,
            fontWeight: 600,
            color: "var(--text2)",
          }}
        >
          {check.priority}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text3)",
            fontFamily: "var(--mono)",
          }}
        >
          {Math.round(confidence)}%
        </span>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
        {check.title}
      </div>
      <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>
        {check.detail}
      </div>

      {/* Confidence bar */}
      <div
        style={{
          height: 3,
          background: "rgba(148,163,184,0.15)",
          borderRadius: 2,
          marginTop: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: meta.leftBorder,
            borderRadius: 2,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export function AnalysisResults() {
  const { result, previewUrl, reset } = useAppStore();

  const checks = result?.checks ?? [];
  const stats = useMemo(() => ({
    passed: checks.filter((c) => c.status === "pass").length,
    failed: checks.filter((c) => c.status === "fail").length,
    warned: checks.filter((c) => c.status === "warning").length,
  }), [checks]);

  const p1 = useMemo(() => checks.filter((c) => c.priority === "P1"), [checks]);
  const p2 = useMemo(() => checks.filter((c) => c.priority === "P2"), [checks]);

  const overallStatus = result?.overallStatus ?? "warning";
  const overall = STATUS_META[overallStatus] ?? STATUS_META.pending;

  return (
    <div style={{ display: "grid", gap: 28 }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: "var(--text)" }}>
            Inspection Report
          </h1>
          <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 3, fontFamily: "var(--mono)" }}>
            {result?.analyzedAt ? formatDate(result.analyzedAt) : ""}
          </p>
        </div>
        <button type="button" onClick={reset} className="secondary-btn">
          ← New Analysis
        </button>
      </div>

      {/* Overall card */}
      <section
        style={{
          borderRadius: 24,
          padding: "28px 32px",
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 28,
          alignItems: "start",
          border: `1px solid ${overall.border}`,
          background: overall.bg,
        }}
        className="overall-responsive"
      >
        {/* Thumbnail */}
        <div style={{ width: "100%", height: 170, borderRadius: 12, overflow: "hidden", background: "#e2e8f0" }}>
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Analyzed" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--text3)" }}>
              No preview
            </div>
          )}
        </div>

        <div>
          {/* Badge */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              borderRadius: 50,
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 700,
              background: overall.badgeBg,
              color: overall.color,
              border: `1px solid ${overall.border}`,
              marginBottom: 10,
            }}
          >
            {overall.icon} Overall: {overallStatus.toUpperCase()}
          </span>

          <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, marginBottom: 18 }}>
            {result?.summary || "No summary returned."}
          </p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[
              { label: "Passed", value: stats.passed, color: "var(--green)" },
              { label: "Failed", value: stats.failed, color: "var(--red)" },
              { label: "Warnings", value: stats.warned, color: "var(--amber)" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  background: "white",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "12px 16px",
                }}
              >
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
              </div>
            ))}
          </div>

          {result?.imageQuality && (
            <p style={{ marginTop: 12, fontSize: 12, color: "var(--text2)" }}>
              Image quality:{" "}
              <strong
                style={{
                  color:
                    result.imageQuality === "good"
                      ? "var(--green)"
                      : result.imageQuality === "poor"
                        ? "var(--red)"
                        : "var(--amber)",
                }}
              >
                {result.imageQuality}
              </strong>
            </p>
          )}
        </div>
      </section>

      {/* P1 Checks */}
      {(p1.length > 0 || (p2.length === 0 && checks.length > 0)) && (
        <section>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--blue)",
              marginBottom: 12,
            }}
          >
            Priority 1 — Critical Checks
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="checks-responsive">
            {(p1.length > 0 ? p1 : checks).map((c) => (
              <CheckCard key={c.id} check={c} />
            ))}
          </div>
        </section>
      )}

      {/* P2 Checks */}
      {p2.length > 0 && (
        <section>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text3)",
              marginBottom: 12,
            }}
          >
            Priority 2 — Additional Checks
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="checks-responsive">
            {p2.map((c) => (
              <CheckCard key={c.id} check={c} />
            ))}
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 720px) {
          .overall-responsive { grid-template-columns: 1fr !important; }
          .checks-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}