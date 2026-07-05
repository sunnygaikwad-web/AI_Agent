'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  durationMinutes: number;
  startTime: Date | null;
  isActive: boolean;
}

export function Timer({ durationMinutes, startTime, isActive }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (!isActive || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
      const remaining = Math.max(0, durationMinutes * 60 - elapsed);
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime, durationMinutes]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / (durationMinutes * 60)) * 100;

  let timerClass = 'timer-display';
  if (percentage <= 10) timerClass += ' critical';
  else if (percentage <= 25) timerClass += ' warning';

  return (
    <div
      className={timerClass}
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
    >
      <Clock size={16} />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
