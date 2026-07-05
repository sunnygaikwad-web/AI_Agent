import { NextRequest, NextResponse } from 'next/server';
import { chatWithGemini } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText } = body;

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide resume text with at least 50 characters' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert Resume Reviewer and ATS (Applicant Tracking System) specialist.
Analyze the provided resume and give detailed feedback.

Respond with the following JSON format inside a code block:

\`\`\`resume_review
{
  "atsScore": <0-100>,
  "formatting": { "score": <0-10>, "feedback": "..." },
  "projects": { "score": <0-10>, "feedback": "..." },
  "skills": { "score": <0-10>, "feedback": "..." },
  "achievements": { "score": <0-10>, "feedback": "..." },
  "grammar": { "score": <0-10>, "feedback": "..." },
  "overallFeedback": "...",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}
\`\`\`

Also provide a brief written summary before the JSON block.`;

    const response = await chatWithGemini(systemPrompt, [
      { role: 'user', content: `Please review this resume:\n\n${resumeText}` },
    ]);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Resume API Error:', error);
    return NextResponse.json(
      { error: 'Failed to review resume' },
      { status: 500 }
    );
  }
}
