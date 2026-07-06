'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInterview } from '@/context/InterviewContext';
import { ScoreCard } from '@/components/ScoreCard';
import { RadarChart } from '@/components/RadarChart';
import { HiringBadge } from '@/components/HiringBadge';
import { FinalReport } from '@/lib/types';
import { getHiringRecommendation } from '@/lib/scoring';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Map,
  RefreshCw,
  Download,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function ReportPage() {
  const router = useRouter();
  const { state, dispatch } = useInterview();
  const [report, setReport] = useState<FinalReport | null>(state.finalReport);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Dynamic import to avoid SSR issues
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('report-content');
      if (!element) return;
      
      const opt = {
        margin:       10,
        filename:     `${state.candidateInfo?.fullName?.replace(/\s+/g, '_') || 'Candidate'}_Interview_Report.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          backgroundColor: '#0a0a0f', // Match the dark theme background
          onclone: (clonedDoc: any) => {
            // Force opacity 1 and remove animations on all elements in the cloned DOM
            const elements = clonedDoc.querySelectorAll('*');
            elements.forEach((el: any) => {
              if (el.style.opacity === '0') el.style.opacity = '1';
              el.style.animation = 'none';
              el.style.transform = 'none';
            });
          }
        },
        jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const generateReport = useCallback(async () => {
    if (!state.candidateInfo || state.questionScores.length === 0) return;

    setIsGenerating(true);

    try {
      // Generate report from scores
      const scores = state.questionScores;
      const avgComm = scores.reduce((a, s) => a + s.communication, 0) / scores.length;
      const avgTech = scores.reduce((a, s) => a + s.technicalAccuracy, 0) / scores.length;
      const avgConf = scores.reduce((a, s) => a + s.confidence, 0) / scores.length;
      const avgPS = scores.reduce((a, s) => a + s.problemSolving, 0) / scores.length;
      const avgExp = scores.reduce((a, s) => a + s.explanation, 0) / scores.length;

      const overall = ((avgComm + avgTech + avgConf + avgPS + avgExp) / 50) * 100;

      const generatedReport: FinalReport = {
        overallScore: Math.round(overall),
        categoryScores: {
          communication: Math.round(avgComm * 10),
          technical: Math.round(avgTech * 10),
          confidence: Math.round(avgConf * 10),
          coding: Math.round(((avgTech + avgPS) / 2) * 10),
          behavioral: Math.round(((avgComm + avgConf) / 2) * 10),
          problemSolving: Math.round(avgPS * 10),
          projectKnowledge: Math.round(((avgTech + avgExp) / 2) * 10),
          grammar: Math.round(((avgComm + avgExp) / 2) * 10),
          professionalism: Math.round(((avgConf + avgComm) / 2) * 10),
        },
        strongAreas: [],
        averageAreas: [],
        weakAreas: [],
        hiringRecommendation: getHiringRecommendation(Math.round(overall)),
        roadmap: [],
        resources: [],
      };

      // Categorize areas
      const categories = Object.entries(generatedReport.categoryScores);
      categories.forEach(([key, value]) => {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
        if (value >= 75) generatedReport.strongAreas.push(label);
        else if (value >= 50) generatedReport.averageAreas.push(label);
        else generatedReport.weakAreas.push(label);
      });

      // Try to get AI-generated report
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: '',
            candidateInfo: state.candidateInfo,
            chatHistory: state.messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            currentPhase: 'report',
            questionCount: state.questionCount,
            totalQuestions: state.totalQuestions,
            currentDifficulty: state.currentDifficulty,
            recentScores: scores,
            isGenerateReport: true,
          }),
        });

        const data = await response.json();
        if (data.response) {
          setAiSummary(data.response);

          // Try to parse enhanced report data
          const reportMatch = data.rawResponse?.match(
            /```final_report\s*\n([\s\S]*?)\n\s*```/
          );
          if (reportMatch) {
            try {
              const aiReport = JSON.parse(reportMatch[1]);
              generatedReport.roadmap = aiReport.roadmap || [];
              generatedReport.resources = aiReport.resources || [];
              if (aiReport.strongAreas) generatedReport.strongAreas = aiReport.strongAreas;
              if (aiReport.averageAreas) generatedReport.averageAreas = aiReport.averageAreas;
              if (aiReport.weakAreas) generatedReport.weakAreas = aiReport.weakAreas;
              if (aiReport.hiringRecommendation)
                generatedReport.hiringRecommendation = aiReport.hiringRecommendation;
            } catch {
              // Use locally generated data
            }
          }
        }
      } catch {
        // If AI fails, use locally generated report
      }

      setReport(generatedReport);
      dispatch({ type: 'SET_FINAL_REPORT', payload: generatedReport });
    } catch (error) {
      console.error('Report generation error:', error);
    }

    setIsGenerating(false);
  }, [state.candidateInfo, state.questionScores, state.messages, state.questionCount, state.totalQuestions, state.currentDifficulty, dispatch]);

  useEffect(() => {
    if (!state.candidateInfo) {
      router.push('/setup');
      return;
    }

    if (!report && state.questionScores.length > 0) {
      generateReport();
    }
  }, [state.candidateInfo, report, state.questionScores.length, generateReport, router]);

  if (!state.candidateInfo) return null;

  if (isGenerating || !report) {
    return (
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <div className="animate-float-glow" style={{ marginBottom: '2rem' }}>
          <BarChart3
            size={64}
            style={{ color: 'var(--neon-cyan)', filter: 'drop-shadow(0 0 15px var(--neon-cyan))' }}
          />
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            letterSpacing: '0.1em',
            marginBottom: '1rem',
          }}
          className="neon-text-cyan"
        >
          Generating Your Report
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Analyzing your interview performance...
        </p>
        <div className="typing-indicator" style={{ marginTop: '1.5rem' }}>
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>
      </div>
    );
  }

  // If no scores (went straight to report), show message
  if (state.questionScores.length === 0) {
    return (
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          gap: '1.5rem',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            letterSpacing: '0.1em',
          }}
        >
          No Interview Data
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Complete an interview first to generate a report.
        </p>
        <Link href="/setup" className="btn btn-primary">
          Start Interview <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '1000px', padding: 'clamp(1rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1rem) 4rem' }}>
      {/* Report Content Container (for PDF Generation) */}
      <div id="report-content" style={{ padding: '1rem', background: 'var(--bg-primary)' }}>
        {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="animate-fade-in-up">
          <Sparkles
            size={32}
            style={{
              color: 'var(--neon-cyan)',
              filter: 'drop-shadow(0 0 10px var(--neon-cyan))',
              marginBottom: '1rem',
            }}
          />
        </div>
        <h1
          className="animate-fade-in-up stagger-1"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            marginBottom: '0.5rem',
            opacity: 0,
          }}
        >
          <span className="neon-text-cyan">Interview</span> Report
        </h1>
        <p
          className="animate-fade-in-up stagger-2"
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            opacity: 0,
          }}
        >
          {state.candidateInfo.fullName} • {state.candidateInfo.desiredRole} at{' '}
          {state.candidateInfo.targetCompany}
        </p>
      </div>

      {/* Overall Score & Hiring Recommendation */}
      <div
        className="report-hero"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '3rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
        }}
      >
        <div
          className="glass-card animate-score-reveal"
          style={{
            textAlign: 'center',
            padding: '2rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: 0,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '4rem',
              fontWeight: 900,
              background: `linear-gradient(135deg, ${
                report.overallScore >= 70
                  ? 'var(--neon-green), var(--neon-cyan)'
                  : report.overallScore >= 50
                  ? 'var(--neon-cyan), var(--neon-purple)'
                  : 'var(--neon-red), var(--neon-orange)'
              })`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {report.overallScore}
          </div>
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Overall Score / 100
          </div>
        </div>

        <div className="animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
          <HiringBadge recommendation={report.hiringRecommendation} />
        </div>
      </div>

      {/* Radar Chart */}
      <div style={{ marginBottom: '3rem' }}>
        <RadarChart report={report} />
      </div>

      {/* Category Scores Grid */}
      <div style={{ marginBottom: '3rem' }}>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.85rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}
          className="neon-text-cyan"
        >
          Category Breakdown
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))',
            gap: '1rem',
          }}
        >
          {Object.entries(report.categoryScores).map(([key, value], index) => (
            <ScoreCard
              key={key}
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
              score={value}
              maxScore={100}
              delay={index * 100}
            />
          ))}
        </div>
      </div>

      {/* Strengths / Average / Weak Areas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        {/* Strong Areas */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--neon-green)' }} />
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--neon-green)',
              }}
            >
              Strong Areas
            </h3>
          </div>
          {report.strongAreas.length > 0 ? (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {report.strongAreas.map((area, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--neon-green)',
                    padding: '0.5rem',
                    background: 'rgba(57, 255, 20, 0.05)',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '2px solid var(--neon-green)',
                    paddingLeft: '0.75rem',
                  }}
                >
                  {area}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Keep practicing to develop strong areas!
            </p>
          )}
        </div>

        {/* Average Areas */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Minus size={18} style={{ color: 'var(--neon-amber)' }} />
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--neon-amber)',
              }}
            >
              Average Areas
            </h3>
          </div>
          {report.averageAreas.length > 0 ? (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {report.averageAreas.map((area, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--neon-amber)',
                    padding: '0.5rem',
                    background: 'rgba(245, 158, 11, 0.05)',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '2px solid var(--neon-amber)',
                    paddingLeft: '0.75rem',
                  }}
                >
                  {area}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No average areas.</p>
          )}
        </div>

        {/* Weak Areas */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <TrendingDown size={18} style={{ color: 'var(--neon-red)' }} />
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--neon-red)',
              }}
            >
              Weak Areas
            </h3>
          </div>
          {report.weakAreas.length > 0 ? (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {report.weakAreas.map((area, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--neon-red)',
                    padding: '0.5rem',
                    background: 'rgba(239, 68, 68, 0.05)',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '2px solid var(--neon-red)',
                    paddingLeft: '0.75rem',
                  }}
                >
                  {area}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Great — no weak areas identified!
            </p>
          )}
        </div>
      </div>

      {/* AI Summary */}
      {aiSummary && (
        <div className="glass-card" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Sparkles size={18} style={{ color: 'var(--neon-cyan)' }} />
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--neon-cyan)',
              }}
            >
              AI Assessment
            </h3>
          </div>
          <div
            style={{
              fontSize: '0.9rem',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {aiSummary}
          </div>
        </div>
      )}

      {/* Roadmap */}
      {report.roadmap.length > 0 && (
        <div className="glass-card" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Map size={18} style={{ color: 'var(--neon-purple)' }} />
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--neon-purple)',
              }}
            >
              Personalized Roadmap
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {report.roadmap.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  padding: '0.75rem',
                  background: 'rgba(139, 92, 246, 0.05)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '2px solid var(--neon-purple)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--neon-purple)',
                    flexShrink: 0,
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources */}
      {report.resources.length > 0 && (
        <div className="glass-card" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <BookOpen size={18} style={{ color: 'var(--neon-cyan)' }} />
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--neon-cyan)',
              }}
            >
              Recommended Resources
            </h3>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: '0.75rem',
            }}
          >
            {report.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  padding: '0.75rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  transition: 'all 0.25s ease',
                  textDecoration: 'none',
                }}
              >
                <div
                  style={{
                    fontSize: '0.6rem',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--neon-cyan)',
                    marginBottom: '0.25rem',
                  }}
                >
                  {resource.type} • {resource.category}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {resource.name}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <Link
          href="/setup"
          className="btn btn-primary btn-lg"
          onClick={() => dispatch({ type: 'RESET' })}
          id="new-interview"
        >
          <RefreshCw size={18} />
          New Interview
        </Link>
        <button
          className="btn btn-secondary btn-lg"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          style={{ opacity: isDownloading ? 0.7 : 1, cursor: isDownloading ? 'not-allowed' : 'pointer' }}
          id="download-report"
        >
          {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>
    </div>
  );
}
