export type CheckStatus = "pass" | "warning" | "fail" | "pending";
export type Priority = "P1" | "P2";
export type ImageQuality = "good" | "acceptable" | "poor";
export type OverallStatus = "pass" | "warning" | "fail";
export type AppState = "idle" | "loading" | "done" | "error";

export interface OAPCheck {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: CheckStatus;
  detail: string;
  confidence: number;
}

export interface AnalysisResult {
  checks: OAPCheck[];
  overallStatus: OverallStatus;
  summary: string;
  issueCount: number;
  passCount: number;
  imageQuality: ImageQuality;
  analyzedAt: string;
}