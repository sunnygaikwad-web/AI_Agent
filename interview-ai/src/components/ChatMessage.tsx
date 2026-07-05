'use client';

import { renderMarkdown } from '@/lib/markdown';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import { getScoreColor } from '@/lib/scoring';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  showFeedback?: boolean;
}

export function ChatMessage({ message, showFeedback = true }: ChatMessageProps) {
  const isInterviewer = message.role === 'interviewer';

  return (
    <div className={`message-bubble ${message.role}`}>
      <div className={`message-role ${message.role}`}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {isInterviewer ? <Bot size={14} /> : <User size={14} />}
          {isInterviewer ? 'InterviewAI' : 'You'}
        </span>
      </div>

      <div
        className="message-content"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
      />

      {/* Score display */}
      {showFeedback && message.score && (
        <div className="feedback-panel">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            {[
              { label: 'Communication', value: message.score.communication },
              { label: 'Technical', value: message.score.technicalAccuracy },
              { label: 'Confidence', value: message.score.confidence },
              { label: 'Problem Solving', value: message.score.problemSolving },
              { label: 'Explanation', value: message.score.explanation },
            ].map((item) => (
              <div key={item.label} className="score-gauge">
                <span
                  className="score-value"
                  style={{
                    color: getScoreColor(item.value),
                    fontSize: '1.1rem',
                  }}
                >
                  {item.value}
                </span>
                <span
                  style={{
                    fontSize: '0.55rem',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontFamily: 'var(--font-heading)',
                    textAlign: 'center',
                  }}
                >
                  {item.label}
                </span>
                <div className="score-bar">
                  <div
                    className="score-bar-fill"
                    style={{
                      width: `${(item.value / 10) * 100}%`,
                      backgroundColor: getScoreColor(item.value),
                      color: getScoreColor(item.value),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              textAlign: 'center',
              padding: '0.5rem',
              borderTop: '1px solid var(--border-default)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.65rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.1em',
              }}
            >
              TOTAL SCORE:{' '}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: getScoreColor(message.score.total, 50),
              }}
            >
              {message.score.total}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              /50
            </span>
          </div>
        </div>
      )}

      {/* Feedback details */}
      {showFeedback && message.feedback && (
        <div className="feedback-panel" style={{ marginTop: '0.5rem' }}>
          {message.feedback.strengths.length > 0 && (
            <div className="feedback-section">
              <div className="feedback-label strengths">✦ Strengths</div>
              <ul style={{ paddingLeft: '1rem', fontSize: '0.85rem' }}>
                {message.feedback.strengths.map((s, i) => (
                  <li key={i} style={{ color: 'var(--neon-green)', marginBottom: '0.25rem' }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {message.feedback.weaknesses.length > 0 && (
            <div className="feedback-section">
              <div className="feedback-label weaknesses">✦ Weaknesses</div>
              <ul style={{ paddingLeft: '1rem', fontSize: '0.85rem' }}>
                {message.feedback.weaknesses.map((w, i) => (
                  <li key={i} style={{ color: 'var(--neon-red)', marginBottom: '0.25rem' }}>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {message.feedback.missingConcepts.length > 0 && (
            <div className="feedback-section">
              <div className="feedback-label missing">✦ Missing Concepts</div>
              <ul style={{ paddingLeft: '1rem', fontSize: '0.85rem' }}>
                {message.feedback.missingConcepts.map((m, i) => (
                  <li key={i} style={{ color: 'var(--neon-amber)', marginBottom: '0.25rem' }}>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {message.feedback.howToImprove.length > 0 && (
            <div className="feedback-section">
              <div className="feedback-label improve">✦ How to Improve</div>
              <ul style={{ paddingLeft: '1rem', fontSize: '0.85rem' }}>
                {message.feedback.howToImprove.map((h, i) => (
                  <li key={i} style={{ color: 'var(--neon-purple)', marginBottom: '0.25rem' }}>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {message.feedback.idealAnswer && (
            <div className="feedback-section">
              <div className="feedback-label ideal">✦ Ideal Answer</div>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  paddingLeft: '0.5rem',
                  borderLeft: '2px solid var(--neon-cyan)',
                }}
              >
                {message.feedback.idealAnswer}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="message-timestamp">
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="message-bubble interviewer" style={{ maxWidth: '120px', padding: '1rem' }}>
      <div className="typing-indicator">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
    </div>
  );
}
