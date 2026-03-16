"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

const STEPS = [
  "Uploading image to AI engine…",
  "Detecting cabinet type (OAP-1)…",
  "Analyzing fiber routing (OAP-2)…",
  "Checking distribution frame caps (OAP-3)…",
  "Scanning fiber connections (OAP-4, OAP-5)…",
  "Verifying connector latches (OAP-6)…",
  "Generating inspection report…",
] as const;

export function LoadingAnalysis() {
  const previewUrl = useAppStore((s) => s.previewUrl);
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const percent = useMemo(() => Math.min(95, Math.max(0, progress)), [progress]);

  useEffect(() => {
    const stepTimer = window.setInterval(() => {
      setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
    }, 900);
    const progressTimer = window.setInterval(() => {
      setProgress((p) => Math.min(95, p + 0.7));
    }, 80);
    return () => {
      window.clearInterval(stepTimer);
      window.clearInterval(progressTimer);
    };
  }, []);

  return (
    <section className="glass-card" style={{ borderRadius: 24, overflow: "hidden" }}>
      {/* Preview strip */}
      <div
        style={{
          width: "100%",
          height: 180,
          position: "relative",
          background: "#e2e8f0",
          overflow: "hidden",
        }}
      >
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Uploaded preview"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }}
          />
        )}
        <div style={{ position: "absolute", inset: 0, background: "rgba(226,232,240,0.5)" }} />

        {/* Floating badge */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(255,255,255,0.92)",
            border: "1px solid var(--border2)",
            borderRadius: 50,
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text)",
            backdropFilter: "blur(8px)",
            whiteSpace: "nowrap",
          }}
        >
          {/* Ping dot */}
          <span style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "var(--blue)",
                opacity: 0.3,
                animation: "ping 1.2s ease-out infinite",
              }}
            />
            <span
              style={{
                position: "relative",
                display: "block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "var(--blue)",
              }}
            />
          </span>
          <span>Analyzing image</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--blue)" }}>
            {Math.round(percent)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(0,85,255,0.1)" }}>
        <div
          style={{
            height: "100%",
            background: "var(--blue)",
            width: `${percent}%`,
            transition: "width 0.15s linear",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Steps */}
      <div style={{ padding: "28px 32px" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
          Running OAP Inspection Checks…
        </p>
        <ol style={{ listStyle: "none", display: "grid", gap: 10 }}>
          {STEPS.map((step, idx) => {
            const completed = idx < stepIndex;
            const current = idx === stepIndex;

            const color = completed
              ? "var(--green)"
              : current
                ? "var(--text)"
                : "var(--text3)";

            const iconBg = completed
              ? "rgba(16,185,129,0.1)"
              : current
                ? "var(--blue-dim)"
                : "rgba(148,163,184,0.1)";

            const icon = completed ? "✓" : current ? "→" : "·";

            return (
              <li key={step} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </span>
                <span style={{ fontSize: 13, color, fontWeight: current ? 500 : 400 }}>
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </section>
  );
}