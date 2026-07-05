'use client';

import { useEffect, useRef } from 'react';

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particleCount = 30;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const x = Math.random() * 100;
      const size = Math.random() * 2 + 1;
      const duration = Math.random() * 15 + 15;
      const delay = Math.random() * 20;

      const colors = [
        'var(--neon-cyan)',
        'var(--neon-magenta)',
        'var(--neon-purple)',
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.left = `${x}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = color;
      particle.style.boxShadow = `0 0 ${size * 3}px ${color}`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;

      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, []);

  return <div ref={containerRef} className="particle-container" />;
}
