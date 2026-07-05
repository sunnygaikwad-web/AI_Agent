'use client';

import { getScoreColor, getScoreLabel } from '@/lib/scoring';

interface ScoreCardProps {
  label: string;
  score: number;
  maxScore: number;
  delay?: number;
}

export function ScoreCard({ label, score, maxScore, delay = 0 }: ScoreCardProps) {
  const percentage = (score / maxScore) * 100;
  const color = getScoreColor(score, maxScore);
  const scoreLabel = getScoreLabel(score, maxScore);

  return (
    <div
      className="report-score-card animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div
        className="score-number"
        style={{ color, textShadow: `0 0 10px ${color}` }}
      >
        {Math.round(score)}
      </div>
      <div style={{ margin: '0.5rem 0' }}>
        <div className="score-bar" style={{ height: '6px' }}>
          <div
            className="score-bar-fill"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
              color: color,
              transition: `width 1.5s ease-out ${delay}ms`,
            }}
          />
        </div>
      </div>
      <div className="score-label">{label}</div>
      <div
        style={{
          fontSize: '0.65rem',
          color: color,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.1em',
          marginTop: '0.25rem',
        }}
      >
        {scoreLabel}
      </div>
    </div>
  );
}
