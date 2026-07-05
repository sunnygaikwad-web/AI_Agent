'use client';

import { HiringRecommendation } from '@/lib/types';
import { getHiringLabel, getHiringColor } from '@/lib/scoring';
import { Award, ThumbsUp, HelpCircle, ThumbsDown } from 'lucide-react';

interface HiringBadgeProps {
  recommendation: HiringRecommendation;
}

export function HiringBadge({ recommendation }: HiringBadgeProps) {
  const label = getHiringLabel(recommendation);
  const color = getHiringColor(recommendation);

  const icons: Record<HiringRecommendation, React.ReactNode> = {
    strong_hire: <Award size={22} />,
    hire: <ThumbsUp size={22} />,
    maybe: <HelpCircle size={22} />,
    reject: <ThumbsDown size={22} />,
  };

  return (
    <div
      className={`hiring-badge ${recommendation}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
      id="hiring-recommendation"
    >
      <span style={{ color }}>{icons[recommendation]}</span>
      <span>{label}</span>
    </div>
  );
}
