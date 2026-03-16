"use client";

import { useCallback, useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { AnalysisResult } from "@/lib/types";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

const SYSTEM_PROMPT = `You are VisionAI, an expert fiber optic cabinet inspection AI. Analyze the provided image and run 6 OAP checks. Return ONLY valid JSON with no markdown or explanation.

JSON structure:
{
  "overallStatus": "pass" | "warning" | "fail",
  "summary": "2-3 sentence overall summary",
  "imageQuality": "good" | "acceptable" | "poor",
  "issueCount": number,
  "passCount": number,
  "analyzedAt": "ISO string",
  "checks": [
    {
      "id": "OAP-1",
      "title": "Cabinet ID / Type Detected",
      "description": "Confirm cabinet identity and configuration.",
      "priority": "P1",
      "status": "pass" | "warning" | "fail",
      "detail": "specific observation from image",
      "confidence": 0-100
    }
  ]
}

Run ALL 6 checks:
OAP-1: Cabinet ID / Type Detected — Can you identify the cabinet type/make?
OAP-2: Fiber Routing — Is routing clean with proper bend radius?
OAP-3: Frame Caps — Are protective dust covers present on ports?
OAP-4: Connections — Are connectors fully seated and aligned?
OAP-5: Fiber Caps — Are unused fiber ports protected?
OAP-6: Latch Check — Are connector latches properly engaged?

Be specific. Reference what you actually see. If image quality is poor, note it but still provide best assessment.`;

async function analyzeImage(dataUrl: string): Promise<AnalysisResult> {
  const mediaType = dataUrl.split(";")[0].split(":")[1];
  const base64Data = dataUrl.split(",")[1];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64Data },
            },
            {
              type: "text",
              text: "Analyze this fiber cabinet image and run all 6 OAP inspection checks. Return ONLY the JSON.",
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message || "API error");

  const raw = data.content
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("");

  const clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const result = JSON.parse(clean) as AnalysisResult;
  result.analyzedAt = new Date().toISOString();
  return result;
}

export function ImageUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { setImage, setLoading, setResult, setError } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);

  const analyze = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      try {
        const dataUrl = await fileToDataUrl(file);
        setImage(dataUrl);
        setLoading();
        const result = await analyzeImage(dataUrl);
        setResult(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    },
    [setError, setImage, setLoading, setResult]
  );

  const onPick = useCallback(async () => {
    const file = inputRef.current?.files?.[0];
    if (file) await analyze(file);
  }, [analyze]);

  return (
    <section className="glass-card" style={{ borderRadius: 24, padding: 28 }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onPick}
        style={{ display: "none" }}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
        onDrop={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) await analyze(file);
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
          cursor: "pointer",
          borderRadius: 16,
          border: `2px dashed ${isDragging ? "var(--blue)" : "rgba(0,85,255,0.25)"}`,
          background: isDragging ? "rgba(0,85,255,0.04)" : "rgba(0,85,255,0.02)",
          padding: "48px 32px",
          textAlign: "center",
          outline: "none",
          transition: "all 0.2s",
          boxShadow: isDragging ? "0 0 0 5px rgba(0,85,255,0.1)" : "none",
        }}
      >
        {/* Upload icon */}
        <div
          style={{
            width: 48,
            height: 48,
            background: "var(--blue-dim)",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.7" width={22} height={22}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16V7m0 0 3 3m-3-3-3 3M20 16.5a4.5 4.5 0 0 0-1.4-3.25 5.5 5.5 0 0 0-10.7 1.5A3.5 3.5 0 0 0 4 18.25c0 1.8 1.5 3.25 3.35 3.25H18.6c1.9 0 3.4-1.55 3.4-3.45Z"
            />
          </svg>
        </div>

        <h2 style={{ fontSize: 17, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
          Upload Cabinet Image
        </h2>
        <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>
          Drag &amp; drop or click to browse
        </p>
        <p style={{ fontSize: 11, color: "var(--text3)" }}>Supports JPG, PNG, WEBP</p>

        <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
          {["AI Powered", "Instant Results", "P1 Checks"].map((label) => (
            <span
              key={label}
              style={{
                border: "1px solid rgba(0,85,255,0.2)",
                background: "rgba(0,85,255,0.06)",
                color: "var(--blue)",
                borderRadius: 50,
                padding: "4px 12px",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="primary-btn" style={{ marginTop: 24, fontSize: 13, pointerEvents: "none" }}>
          Browse Files
        </div>
      </div>
    </section>
  );
}