import { NextRequest, NextResponse } from 'next/server';
import { chatWithGemini, parseEvaluation } from '@/lib/gemini';
import { buildSystemPrompt, buildInitialMessage, buildFinalReportPrompt } from '@/lib/prompts';
import { CandidateInfo, InterviewPhase } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      candidateInfo,
      chatHistory,
      currentPhase,
      questionCount,
      totalQuestions,
      currentDifficulty,
      recentScores,
      isInitial,
      isGenerateReport,
    } = body as {
      message: string;
      candidateInfo: CandidateInfo;
      chatHistory: { role: string; content: string }[];
      currentPhase: string;
      questionCount: number;
      totalQuestions: number;
      currentDifficulty: string;
      recentScores: number[];
      isInitial?: boolean;
      isGenerateReport?: boolean;
    };

    if (!candidateInfo) {
      return NextResponse.json(
        { error: 'Candidate information is required' },
        { status: 400 }
      );
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt(
      candidateInfo,
      currentPhase as InterviewPhase,
      questionCount,
      totalQuestions,
      currentDifficulty,
      recentScores || []
    );

    let messages: { role: string; content: string }[];

    if (isGenerateReport) {
      // Generate final report
      const reportPrompt = buildFinalReportPrompt(
        candidateInfo,
        recentScores as unknown as { communication: number; technicalAccuracy: number; confidence: number; problemSolving: number; explanation: number }[],
        chatHistory.map((m) => `${m.role}: ${m.content}`).join('\n\n')
      );
      messages = [
        ...chatHistory,
        { role: 'user', content: reportPrompt },
      ];
    } else if (isInitial) {
      // First message - start the interview
      const initialMsg = buildInitialMessage(candidateInfo);
      messages = [{ role: 'user', content: initialMsg }];
    } else {
      // Regular chat message
      messages = [
        ...chatHistory,
        { role: 'user', content: message },
      ];
    }

    // Call Gemini
    const response = await chatWithGemini(systemPrompt, messages);

    // Parse evaluation from response
    const parsed = parseEvaluation(response);

    return NextResponse.json({
      response: parsed.cleanResponse,
      scores: parsed.scores,
      feedback: parsed.feedback,
      nextPhase: parsed.nextPhase,
      shouldEndInterview: parsed.shouldEndInterview,
      rawResponse: response,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
