"use client";

import { create } from "zustand";
import type { AnalysisResult, AppState } from "@/lib/types";

interface AppStore {
  appState: AppState;
  previewUrl: string | null;
  result: AnalysisResult | null;
  error: string | null;

  setImage: (dataUrl: string) => void;
  setLoading: () => void;
  setResult: (result: AnalysisResult) => void;
  setError: (message: string) => void;
  reset: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  appState: "idle",
  previewUrl: null,
  result: null,
  error: null,

  setImage: (dataUrl) => set({ previewUrl: dataUrl, result: null, error: null }),
  setLoading: () => set({ appState: "loading" }),
  setResult: (result) => set({ appState: "done", result }),
  setError: (message) => set({ appState: "error", error: message }),
  reset: () => set({ appState: "idle", previewUrl: null, result: null, error: null }),
}));