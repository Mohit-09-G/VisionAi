import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VisionAI – OAP Cabinet Inspection",
  description: "AI-powered fiber optic cabinet inspection system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}