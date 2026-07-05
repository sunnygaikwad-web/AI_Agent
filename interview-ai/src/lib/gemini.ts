// ============================================================
// InterviewAI — Gemini API Service
// ============================================================

import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function chatWithGemini(
  systemPrompt: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  const client = getClient();

  const contents = messages.map((msg) => ({
    role: msg.role === 'interviewer' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.8,
      maxOutputTokens: 4096,
      topP: 0.95,
    },
  });

  return response.text || 'I apologize, I was unable to generate a response. Let us continue with the interview.';
}

export function parseEvaluation(response: string): {
  cleanResponse: string;
  scores: {
    communication: number;
    technicalAccuracy: number;
    confidence: number;
    problemSolving: number;
    explanation: number;
  } | null;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    missingConcepts: string[];
    howToImprove: string[];
    idealAnswer: string;
  } | null;
  nextPhase: string | null;
  shouldEndInterview: boolean;
} {
  // Extract the evaluation JSON block
  const evalMatch = response.match(/```evaluation\s*\n([\s\S]*?)\n\s*```/);

  let cleanResponse = response;
  let scores = null;
  let feedback = null;
  let nextPhase = null;
  let shouldEndInterview = false;

  if (evalMatch) {
    // Remove the evaluation block from the displayed response
    cleanResponse = response.replace(/```evaluation\s*\n[\s\S]*?\n\s*```/, '').trim();

    try {
      const evalData = JSON.parse(evalMatch[1]);
      scores = evalData.scores || null;
      feedback = evalData.feedback || null;
      nextPhase = evalData.nextPhase || null;
      shouldEndInterview = evalData.shouldEndInterview || false;
    } catch {
      // If JSON parsing fails, just return the clean response
      console.error('Failed to parse evaluation JSON');
    }
  }

  return { cleanResponse, scores, feedback, nextPhase, shouldEndInterview };
}

export function parseFinalReport(response: string) {
  const reportMatch = response.match(/```final_report\s*\n([\s\S]*?)\n\s*```/);

  if (reportMatch) {
    try {
      return JSON.parse(reportMatch[1]);
    } catch {
      console.error('Failed to parse final report JSON');
      return null;
    }
  }
  return null;
}
