'use client';

import Link from 'next/link';
import {
  Brain,
  Target,
  BarChart3,
  Code2,
  MessageSquare,
  Users,
  Zap,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem) clamp(2rem, 5vw, 4rem)',
          minHeight: '85vh',
          position: 'relative',
        }}
      >
        {/* Glow orb decoration */}
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, transparent 70%)',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 0, 229, 0.06) 0%, transparent 70%)',
            top: '30%',
            right: '15%',
            pointerEvents: 'none',
          }}
        />

        {/* Badge */}
        <div
          className="animate-fade-in-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            color: 'var(--neon-cyan)',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.1em',
            marginBottom: '2rem',
          }}
        >
          <Sparkles size={14} />
          AI-POWERED INTERVIEW COACH
        </div>

        {/* Title */}
        <h1
          className="animate-fade-in-up animate-flicker stagger-1"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            letterSpacing: '0.05em',
            background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-magenta) 50%, var(--neon-purple) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1.5rem',
            lineHeight: 1.1,
            opacity: 0,
          }}
        >
          INTERVIEW<span style={{ WebkitTextFillColor: 'var(--neon-magenta)', color: 'var(--neon-magenta)' }}>AI</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-in-up stagger-2"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            marginBottom: '0.75rem',
            lineHeight: 1.7,
            opacity: 0,
          }}
        >
          Your AI-powered mock interview coach that simulates{' '}
          <span className="neon-text-cyan">real interviews</span> at top companies.
          Get instant feedback, personalized scoring, and a roadmap to your dream job.
        </p>

        {/* Company tags */}
        <div
          className="animate-fade-in-up stagger-3"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '2.5rem',
            opacity: 0,
          }}
        >
          {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Infosys', 'TCS', 'Deloitte'].map(
            (company) => (
              <span
                key={company}
                style={{
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(139, 92, 246, 0.05)',
                }}
              >
                {company}
              </span>
            )
          )}
        </div>

        {/* CTA Buttons */}
        <div
          className="animate-fade-in-up stagger-4"
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            opacity: 0,
          }}
        >
          <Link href="/setup" className="btn btn-primary btn-lg" id="start-interview-cta">
            <Zap size={18} />
            Start Interview
            <ArrowRight size={18} />
          </Link>
          <a href="#features" className="btn btn-secondary btn-lg" id="learn-more-cta">
            Learn More
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section
        style={{
          padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)',
          borderTop: '1px solid var(--border-default)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          {[
            { value: '20+', label: 'Interview Types', icon: <Target size={20} /> },
            { value: '50+', label: 'Tech Topics', icon: <Code2 size={20} /> },
            { value: 'Real-time', label: 'AI Feedback', icon: <Brain size={20} /> },
            { value: '360°', label: 'Score Analysis', icon: <BarChart3 size={20} /> },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  color: 'var(--neon-cyan)',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-magenta))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        style={{
          padding: 'clamp(2.5rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem)',
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '0.75rem',
              letterSpacing: '0.05em',
            }}
          >
            <span className="neon-text-cyan">Interview</span>{' '}
            <span style={{ color: 'var(--text-primary)' }}>Features</span>
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              maxWidth: '500px',
              margin: '0 auto 3rem',
              fontSize: '0.95rem',
            }}
          >
            Everything you need to ace your next interview, powered by advanced AI.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              {
                icon: <MessageSquare size={28} />,
                title: 'Realistic Conversations',
                description:
                  'AI behaves exactly like a human interviewer — asks follow-ups, cross-questions, and adapts to your answers.',
                color: 'var(--neon-cyan)',
              },
              {
                icon: <Brain size={28} />,
                title: 'Adaptive Difficulty',
                description:
                  'Performing well? The AI increases difficulty. Struggling? It adjusts and helps you learn.',
                color: 'var(--neon-magenta)',
              },
              {
                icon: <BarChart3 size={28} />,
                title: 'Real-time Scoring',
                description:
                  'Get scored on Communication, Technical Accuracy, Confidence, Problem Solving, and Explanation after every answer.',
                color: 'var(--neon-purple)',
              },
              {
                icon: <Code2 size={28} />,
                title: 'Coding Round',
                description:
                  'Submit code directly in the chat. Get analysis on correctness, time/space complexity, edge cases, and optimization.',
                color: 'var(--neon-green)',
              },
              {
                icon: <Users size={28} />,
                title: 'Behavioral + HR',
                description:
                  'Practice behavioral questions, STAR method responses, and HR rounds with detailed feedback.',
                color: 'var(--neon-amber)',
              },
              {
                icon: <Shield size={28} />,
                title: 'Final Report & Roadmap',
                description:
                  'Get a comprehensive radar analysis, hiring recommendation, and personalized improvement roadmap.',
                color: 'var(--neon-pink)',
              },
            ].map((feature) => (
              <div key={feature.title} className="glass-card">
                <div
                  style={{
                    color: feature.color,
                    marginBottom: '1rem',
                    filter: `drop-shadow(0 0 8px ${feature.color})`,
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    marginBottom: '0.75rem',
                    color: feature.color,
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        style={{
          padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)',
          borderTop: '1px solid var(--border-default)',
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '3rem',
              letterSpacing: '0.05em',
            }}
          >
            <span className="neon-text-magenta">How It</span>{' '}
            <span style={{ color: 'var(--text-primary)' }}>Works</span>
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
              gap: '2rem',
              maxWidth: '900px',
              margin: '0 auto',
            }}
          >
            {[
              {
                step: '01',
                title: 'Setup Profile',
                desc: 'Enter your skills, target role, company, and difficulty level.',
              },
              {
                step: '02',
                title: 'Start Interview',
                desc: 'AI conducts a realistic multi-round interview customized for you.',
              },
              {
                step: '03',
                title: 'Get Feedback',
                desc: 'Receive instant scores and detailed feedback after every answer.',
              },
              {
                step: '04',
                title: 'View Report',
                desc: 'Get your comprehensive analysis with radar chart and hiring recommendation.',
              },
            ].map((item) => (
              <div key={item.step} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '1rem',
                    opacity: 0.7,
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: 'clamp(2.5rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem)',
          textAlign: 'center',
          borderTop: '1px solid var(--border-default)',
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              marginBottom: '1rem',
              letterSpacing: '0.05em',
            }}
          >
            Ready to{' '}
            <span className="neon-text-cyan">Ace</span>{' '}
            Your Interview?
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              maxWidth: '500px',
              margin: '0 auto 2rem',
              fontSize: '0.95rem',
            }}
          >
            Every mock interview brings you one step closer to your dream job.
          </p>
          <Link href="/setup" className="btn btn-primary btn-lg" id="bottom-cta">
            <Zap size={18} />
            Start Your Mock Interview
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '2rem',
          textAlign: 'center',
          borderTop: '1px solid var(--border-default)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
          INTERVIEW
          <span className="neon-text-magenta">AI</span>
        </span>{' '}
        © {new Date().getFullYear()} • Powered by Gemini AI
      </footer>
    </div>
  );
}
