'use client';

import Link from 'next/link';
import { useInterview } from '@/context/InterviewContext';
import { Cpu } from 'lucide-react';

export function Navbar() {
  const { state } = useInterview();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo" id="navbar-logo">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={20} />
          INTERVIEW<span className="neon-text-magenta">AI</span>
        </span>
      </Link>
      <div className="navbar-links">
        {state.isInterviewActive && (
          <span
            className="phase-badge active"
            style={{ fontSize: '0.55rem' }}
          >
            {state.currentPhase.toUpperCase()} ROUND
          </span>
        )}
        <Link href="/" className="navbar-link" id="nav-home">
          Home
        </Link>
        {state.candidateInfo && (
          <Link href="/interview" className="navbar-link" id="nav-interview">
            Interview
          </Link>
        )}
      </div>
    </nav>
  );
}
