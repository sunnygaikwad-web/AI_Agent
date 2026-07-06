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
    model: 'gemini-1.5-flash',
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

export async function extractResumeData(base64Data: string, mimeType: string): Promise<Partial<import('./types').CandidateInfo>> {
  const client = getClient();
  const systemPrompt = `You are an expert HR assistant. Your task is to read the provided resume and extract the candidate's information into a JSON format that matches the following schema:
{
  "fullName": "string",
  "degree": "string (e.g., B.Tech in Computer Science, BS in Software Engineering)",
  "college": "string (e.g., University Name)",
  "graduationYear": "string (e.g., 2024)",
  "experience": "string: 'fresher' or 'experienced'",
  "desiredRole": "string (e.g., Software Engineer, Frontend Developer)",
  "targetCompany": "string (guess based on resume or leave empty string if not applicable)",
  "programmingLanguages": "string (comma separated list of programming languages)",
  "skills": "string (comma separated list of other skills, tools, frameworks)",
  "projects": "string (a brief summary of 1-3 major projects. Include tech stack and key features. Format as a string, e.g., '1. Project A - Built with X, Y. 2. Project B - Built with Z.')"
}

Instructions:
- Return ONLY valid JSON inside a \`\`\`json block.
- Do not make up information. If something is completely missing, return an empty string for that field, except for experience which should default to 'fresher' if unclear.
- Ensure the JSON is properly formatted and escaped.`;

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          { 
            role: 'user', 
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType,
                }
              },
              { text: 'Extract the information from this resume.' }
            ] 
          }
        ],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
        },
      });

      const text = response.text || '';
      if (!text.trim()) {
        throw new Error('Gemini returned an empty response. The resume may not be readable.');
      }

      const jsonMatch = text.match(/```(?:json)?\s*\n([\s\S]*?)\n\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      } else {
        return JSON.parse(text);
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const msg = lastError.message || '';

      // If it's a rate limit error, wait and retry
      if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        const delayMs = (attempt + 1) * 5000; // 5s, 10s, 15s
        console.warn(`Rate limited on attempt ${attempt + 1}/${maxRetries}. Retrying in ${delayMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      // For non-rate-limit errors, throw immediately
      throw lastError;
    }
  }

  // All retries exhausted
  throw new Error('Gemini API rate limit reached. Please wait about 30 seconds and try uploading your resume again.');
}

