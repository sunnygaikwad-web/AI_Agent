import type { Metadata } from "next";
import "./globals.css";
import { InterviewProvider } from "@/context/InterviewContext";
import { Navbar } from "@/components/Navbar";
import { ParticleBackground } from "@/components/ParticleBackground";

export const metadata: Metadata = {
  title: "InterviewAI — AI Mock Interview Coach",
  description:
    "Practice for your dream job with InterviewAI. Our AI-powered mock interview coach simulates real interviews at Google, Microsoft, Amazon, Meta, and more. Get instant feedback, scores, and personalized improvement roadmaps.",
  keywords: [
    "mock interview",
    "AI interview coach",
    "FAANG interview prep",
    "coding interview",
    "behavioral interview",
    "technical interview",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <InterviewProvider>
          <div className="scanline-overlay" />
          <ParticleBackground />
          <div className="grid-background" />
          <Navbar />
          <main className="page-wrapper">{children}</main>
        </InterviewProvider>
      </body>
    </html>
  );
}
