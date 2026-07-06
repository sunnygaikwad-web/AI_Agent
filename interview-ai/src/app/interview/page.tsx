'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useInterview } from '@/context/InterviewContext';
import { ChatMessage, TypingIndicator } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { Timer } from '@/components/Timer';
import { ChatMessage as ChatMessageType, InterviewPhase } from '@/lib/types';
import {
  MessageSquare,
  Brain,
  Code2,
  FolderGit2,
  Users,
  BarChart3,
  FileText,
} from 'lucide-react';

const phaseConfig: Record<
  InterviewPhase,
  { label: string; icon: React.ReactNode; color: string }
> = {
  setup: { label: 'Setup', icon: <FileText size={14} />, color: 'var(--text-muted)' },
  introduction: {
    label: 'Introduction',
    icon: <MessageSquare size={14} />,
    color: 'var(--neon-cyan)',
  },
  technical: { label: 'Technical', icon: <Brain size={14} />, color: 'var(--neon-purple)' },
  behavioral: { label: 'Behavioral', icon: <Users size={14} />, color: 'var(--neon-amber)' },
  coding: { label: 'Coding', icon: <Code2 size={14} />, color: 'var(--neon-green)' },
  project: { label: 'Project', icon: <FolderGit2 size={14} />, color: 'var(--neon-magenta)' },
  hr: { label: 'HR', icon: <Users size={14} />, color: 'var(--neon-pink)' },
  report: { label: 'Report', icon: <BarChart3 size={14} />, color: 'var(--neon-cyan)' },
};

const phaseOrder: InterviewPhase[] = [
  'introduction',
  'technical',
  'behavioral',
  'coding',
  'project',
  'hr',
];

export default function InterviewPage() {
  const router = useRouter();
  const { state, dispatch } = useInterview();
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showScoreSidebar, setShowScoreSidebar] = useState(true);
  const initializedRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, isTyping, scrollToBottom]);

  // Redirect if no candidate info
  useEffect(() => {
    if (!state.candidateInfo) {
      router.push('/setup');
    }
  }, [state.candidateInfo, router]);

  // Start interview with initial message
  useEffect(() => {
    if (state.candidateInfo && state.messages.length === 0 && !initializedRef.current) {
      initializedRef.current = true;
      startInterview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.candidateInfo]);

  const startInterview = async () => {
    setIsTyping(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: '',
          candidateInfo: state.candidateInfo,
          chatHistory: [],
          currentPhase: 'introduction',
          questionCount: 0,
          totalQuestions: state.totalQuestions,
          currentDifficulty: state.currentDifficulty,
          recentScores: [],
          isInitial: true,
        }),
      });

      const data = await response.json();

      if (data.error) {
        const errorMsg: ChatMessageType = {
          id: crypto.randomUUID(),
          role: 'interviewer',
          content: `⚠️ **Connection Error**: ${data.details || data.error}\n\nPlease make sure your Gemini API key is set in the \`.env.local\` file and restart the server.`,
          timestamp: new Date(),
        };
        dispatch({ type: 'ADD_MESSAGE', payload: errorMsg });
      } else {
        const aiMessage: ChatMessageType = {
          id: crypto.randomUUID(),
          role: 'interviewer',
          content: data.response,
          timestamp: new Date(),
          phase: 'introduction',
        };
        dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
      }
    } catch (error) {
      const errorMsg: ChatMessageType = {
        id: crypto.randomUUID(),
        role: 'interviewer',
        content: `⚠️ **Error**: Failed to connect to the AI service. Please check your setup and try again.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: errorMsg });
    }
    setIsTyping(false);
  };

  const handleSendMessage = async (message: string) => {
    if (!state.candidateInfo) return;

    // Add candidate message
    const candidateMsg: ChatMessageType = {
      id: crypto.randomUUID(),
      role: 'candidate',
      content: message,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: candidateMsg });
    dispatch({ type: 'INCREMENT_QUESTION' });

    setIsTyping(true);

    try {
      const chatHistory = [...state.messages, candidateMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const recentTotals = state.questionScores.slice(-3).map((s) => s.total);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          candidateInfo: state.candidateInfo,
          chatHistory,
          currentPhase: state.currentPhase,
          questionCount: state.questionCount + 1,
          totalQuestions: state.totalQuestions,
          currentDifficulty: state.currentDifficulty,
          recentScores: recentTotals,
        }),
      });

      const data = await response.json();

      if (data.error) {
        const errorMsg: ChatMessageType = {
          id: crypto.randomUUID(),
          role: 'interviewer',
          content: `⚠️ ${data.details || data.error}`,
          timestamp: new Date(),
        };
        dispatch({ type: 'ADD_MESSAGE', payload: errorMsg });
      } else {
        const aiMessage: ChatMessageType = {
          id: crypto.randomUUID(),
          role: 'interviewer',
          content: data.response,
          timestamp: new Date(),
          phase: state.currentPhase,
          score: data.scores
            ? {
                communication: data.scores.communication,
                technicalAccuracy: data.scores.technicalAccuracy,
                confidence: data.scores.confidence,
                problemSolving: data.scores.problemSolving,
                explanation: data.scores.explanation,
                total:
                  data.scores.communication +
                  data.scores.technicalAccuracy +
                  data.scores.confidence +
                  data.scores.problemSolving +
                  data.scores.explanation,
              }
            : undefined,
          feedback: data.feedback || undefined,
        };

        dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });

        // Add score if present
        if (data.scores) {
          dispatch({
            type: 'ADD_SCORE',
            payload: {
              communication: data.scores.communication,
              technicalAccuracy: data.scores.technicalAccuracy,
              confidence: data.scores.confidence,
              problemSolving: data.scores.problemSolving,
              explanation: data.scores.explanation,
              total:
                data.scores.communication +
                data.scores.technicalAccuracy +
                data.scores.confidence +
                data.scores.problemSolving +
                data.scores.explanation,
            },
          });
        }

        // Phase transition
        if (data.nextPhase && data.nextPhase !== state.currentPhase) {
          dispatch({ type: 'SET_PHASE', payload: data.nextPhase as InterviewPhase });
        }

        // End interview
        if (data.shouldEndInterview) {
          dispatch({ type: 'END_INTERVIEW' });
          setTimeout(() => router.push('/report'), 2000);
        }
      }
    } catch (error) {
      const errorMsg: ChatMessageType = {
        id: crypto.randomUUID(),
        role: 'interviewer',
        content: `⚠️ Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: errorMsg });
    }

    setIsTyping(false);
  };

  const handleEndInterview = async () => {
    dispatch({ type: 'END_INTERVIEW' });
    router.push('/report');
  };

  if (!state.candidateInfo) return null;

  const avgScore =
    state.questionScores.length > 0
      ? state.questionScores.reduce((a, s) => a + s.total, 0) / state.questionScores.length
      : 0;

  return (
    <div className="interview-layout" style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>
      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div
          className="interview-topbar"
          style={{
            padding: '0.75rem 1.5rem',
            borderBottom: '1px solid var(--border-default)',
            background: 'rgba(10, 10, 15, 0.9)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Phase badges */}
          <div className="interview-phases" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', maxWidth: '100%', paddingBottom: '0.25rem' }}>
            {phaseOrder.map((phase) => {
              const config = phaseConfig[phase];
              const phaseIdx = phaseOrder.indexOf(phase);
              const currentIdx = phaseOrder.indexOf(state.currentPhase);
              const status =
                phaseIdx < currentIdx
                  ? 'completed'
                  : phaseIdx === currentIdx
                  ? 'active'
                  : 'upcoming';

              return (
                <span key={phase} className={`phase-badge ${status}`}>
                  {config.icon}
                  {config.label}
                </span>
              );
            })}
          </div>

          {/* Timer and controls */}
          <div className="interview-controls" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Timer
              durationMinutes={state.interviewDuration}
              startTime={state.interviewStartTime}
              isActive={state.isInterviewActive}
            />
            <button
              className="btn btn-sm"
              onClick={() => setShowScoreSidebar(!showScoreSidebar)}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
                fontSize: '0.7rem',
                padding: '0.4rem 0.8rem',
                cursor: 'pointer',
              }}
              id="toggle-sidebar"
            >
              <BarChart3 size={14} />
            </button>
            <button
              className="btn btn-sm"
              onClick={handleEndInterview}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--neon-red)',
                fontSize: '0.7rem',
                padding: '0.4rem 0.8rem',
                cursor: 'pointer',
              }}
              id="end-interview"
            >
              End Interview
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="chat-container" style={{ flex: 1 }}>
          {state.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <ChatInput onSend={handleSendMessage} disabled={isTyping || !state.isInterviewActive} />
      </div>

      {/* Score Sidebar — hidden on mobile via CSS */}
      {showScoreSidebar && (
        <div
          className="interview-sidebar"
          style={{
            width: '280px',
            borderLeft: '1px solid var(--border-default)',
            background: 'rgba(10, 10, 15, 0.95)',
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
            className="neon-text-cyan"
          >
            Live Scoreboard
          </h3>

          <hr className="neon-divider" style={{ margin: '0' }} />

          {/* Questions answered */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--neon-cyan)',
              }}
            >
              {state.questionScores.length}
            </div>
            <div
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Questions Evaluated
            </div>
          </div>

          {/* Average score */}
          <div
            style={{
              textAlign: 'center',
              padding: '1rem',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: 700,
                color:
                  avgScore >= 40
                    ? 'var(--neon-green)'
                    : avgScore >= 30
                    ? 'var(--neon-cyan)'
                    : avgScore >= 20
                    ? 'var(--neon-amber)'
                    : 'var(--neon-red)',
              }}
            >
              {avgScore.toFixed(1)}
            </div>
            <div
              style={{
                fontSize: '0.6rem',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Avg Score / 50
            </div>
          </div>

          {/* Individual category averages */}
          {state.questionScores.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  label: 'Communication',
                  avg:
                    state.questionScores.reduce((a, s) => a + s.communication, 0) /
                    state.questionScores.length,
                },
                {
                  label: 'Technical',
                  avg:
                    state.questionScores.reduce((a, s) => a + s.technicalAccuracy, 0) /
                    state.questionScores.length,
                },
                {
                  label: 'Confidence',
                  avg:
                    state.questionScores.reduce((a, s) => a + s.confidence, 0) /
                    state.questionScores.length,
                },
                {
                  label: 'Problem Solving',
                  avg:
                    state.questionScores.reduce((a, s) => a + s.problemSolving, 0) /
                    state.questionScores.length,
                },
                {
                  label: 'Explanation',
                  avg:
                    state.questionScores.reduce((a, s) => a + s.explanation, 0) /
                    state.questionScores.length,
                },
              ].map((cat) => (
                <div key={cat.label}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-heading)',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {cat.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--neon-cyan)',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {cat.avg.toFixed(1)}
                    </span>
                  </div>
                  <div className="score-bar" style={{ height: '4px' }}>
                    <div
                      className="score-bar-fill"
                      style={{
                        width: `${(cat.avg / 10) * 100}%`,
                        backgroundColor: 'var(--neon-cyan)',
                        color: 'var(--neon-cyan)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Current difficulty */}
          <div
            style={{
              textAlign: 'center',
              padding: '0.75rem',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <div
              style={{
                fontSize: '0.6rem',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: 'var(--font-heading)',
                marginBottom: '0.25rem',
              }}
            >
              Difficulty
            </div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--neon-purple)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {state.currentDifficulty}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
