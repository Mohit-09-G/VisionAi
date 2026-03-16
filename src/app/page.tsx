"use client";

import { useAppStore } from "@/store/useAppStore";
import { Header } from "@/components/Header";
import { ImageUploader } from "@/components/ImageUploader";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Footer } from "@/components/Footer";

const OAP_TAGS = [
  "OAP-1 Cabinet ID",
  "OAP-2 Fiber Routing",
  "OAP-3 Frame Caps",
  "OAP-4 Connections",
  "OAP-5 Fiber Caps",
  "OAP-6 Latch Check",
];

export default function HomePage() {
  const { appState, error, reset } = useAppStore();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* ── IDLE ── */}
      {appState === "idle" && (
        <main
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            width: "100%",
            padding: "0 2rem",
            flex: 1,
          }}
        >
          {/* Hero */}
          <section id="hero" style={{ padding: "56px 0 40px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.6fr 1fr",
                gap: 40,
                alignItems: "start",
              }}
              className="hero-responsive"
            >
              {/* Left */}
              <div>
                {/* Live badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "white",
                    border: "1px solid var(--border2)",
                    borderRadius: 50,
                    padding: "5px 12px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--text2)",
                    marginBottom: 18,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      background: "var(--green)",
                      borderRadius: "50%",
                    }}
                  />
                  Live demo · VisionAI OAP
                </div>

                <h1
                  style={{
                    fontSize: "clamp(28px, 4vw, 46px)",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: "-1px",
                    color: "var(--text)",
                    marginBottom: 14,
                  }}
                >
                  AI-Powered{" "}
                  <span style={{ color: "var(--blue)" }}>Fiber Cabinet</span>
                  <br />
                  Inspection System
                </h1>

                <p
                  style={{
                    fontSize: 15,
                    color: "var(--text2)",
                    maxWidth: 520,
                    marginBottom: 24,
                    lineHeight: 1.7,
                  }}
                >
                  Upload a cabinet image and let VisionAI surface routing issues, missing
                  caps, latch failures, and connection problems in seconds.
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
                  <a href="#upload" className="primary-btn" style={{ fontSize: 13 }}>
                    Get started · Upload image
                  </a>
                </div>

                {/* OAP tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {OAP_TAGS.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "white",
                        border: "1px solid var(--border2)",
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 11,
                        fontWeight: 500,
                        color: "var(--text2)",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — How it works */}
              <div
                id="how-it-works"
                style={{
                  background: "white",
                  border: "1px solid var(--border2)",
                  borderRadius: 18,
                  padding: 24,
                }}
                className="how-card-responsive"
              >
                <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
                  How this works
                </h3>
                <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.7, marginBottom: 16 }}>
                  Upload any fiber cabinet photo. VisionAI performs 6 OAP inspection checks and generates a detailed report with confidence scores.
                </p>
                <ol style={{ listStyle: "none" }}>
                  {[
                    "Drop or select a cabinet image",
                    "Analyze smarter with VisionAI",
                    "Get OAP checks with confidence scores",
                  ].map((step, i) => (
                    <li
                      key={step}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        padding: "7px 0",
                        borderTop: i === 0 ? "none" : "1px solid var(--border)",
                        fontSize: 12,
                        color: "var(--text2)",
                      }}
                    >
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          background: "var(--blue-dim)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "var(--blue)",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Upload section */}
          <section id="upload" style={{ paddingBottom: 56 }}>
            <ImageUploader />
          </section>

          <style>{`
            @media (max-width: 720px) {
              .hero-responsive { grid-template-columns: 1fr !important; }
              .how-card-responsive { display: none !important; }
            }
          `}</style>
        </main>
      )}

      {/* ── LOADING ── */}
      {appState === "loading" && (
        <main
          style={{
            maxWidth: 700,
            margin: "0 auto",
            width: "100%",
            padding: "48px 2rem",
            flex: 1,
          }}
        >
          <LoadingAnalysis />
        </main>
      )}

      {/* ── DONE ── */}
      {appState === "done" && (
        <main
          id="results"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            width: "100%",
            padding: "48px 2rem 56px",
            flex: 1,
          }}
        >
          <AnalysisResults />
        </main>
      )}

      {/* ── ERROR ── */}
      {appState === "error" && (
        <main
          style={{
            maxWidth: 600,
            margin: "0 auto",
            width: "100%",
            padding: "56px 2rem",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              borderRadius: 24,
              border: "1px solid rgba(239,68,68,0.2)",
              padding: "40px 36px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                background: "rgba(239,68,68,0.08)",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: 20,
              }}
            >
              ✗
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: "var(--text)" }}>
              Analysis Failed
            </h2>
            <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 24, lineHeight: 1.6 }}>
              {error || "Unknown error"}
            </p>
            <button type="button" onClick={reset} className="primary-btn" style={{ fontSize: 13 }}>
              Try Again
            </button>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}