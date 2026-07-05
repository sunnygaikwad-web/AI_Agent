// ============================================================
// InterviewAI — Scoring Utilities
// ============================================================

import { QuestionScore, FinalReport, HiringRecommendation } from './types';

export function calculateTotalScore(score: QuestionScore): number {
  return (
    score.communication +
    score.technicalAccuracy +
    score.confidence +
    score.problemSolving +
    score.explanation
  );
}

export function getAverageScores(scores: QuestionScore[]): QuestionScore {
  if (scores.length === 0) {
    return {
      communication: 0,
      technicalAccuracy: 0,
      confidence: 0,
      problemSolving: 0,
      explanation: 0,
      total: 0,
    };
  }

  const avg = {
    communication: scores.reduce((a, s) => a + s.communication, 0) / scores.length,
    technicalAccuracy: scores.reduce((a, s) => a + s.technicalAccuracy, 0) / scores.length,
    confidence: scores.reduce((a, s) => a + s.confidence, 0) / scores.length,
    problemSolving: scores.reduce((a, s) => a + s.problemSolving, 0) / scores.length,
    explanation: scores.reduce((a, s) => a + s.explanation, 0) / scores.length,
    total: 0,
  };
  avg.total = calculateTotalScore(avg);
  return avg;
}

export function getScoreColor(score: number, max: number = 10): string {
  const ratio = score / max;
  if (ratio >= 0.9) return 'var(--neon-green)';
  if (ratio >= 0.7) return 'var(--neon-cyan)';
  if (ratio >= 0.5) return 'var(--neon-amber)';
  if (ratio >= 0.3) return 'var(--neon-orange)';
  return 'var(--neon-red)';
}

export function getScoreLabel(score: number, max: number = 10): string {
  const ratio = score / max;
  if (ratio >= 0.9) return 'Excellent';
  if (ratio >= 0.7) return 'Good';
  if (ratio >= 0.5) return 'Average';
  if (ratio >= 0.3) return 'Poor';
  return 'Very Poor';
}

export function getHiringRecommendation(overallScore: number): HiringRecommendation {
  if (overallScore >= 85) return 'strong_hire';
  if (overallScore >= 70) return 'hire';
  if (overallScore >= 50) return 'maybe';
  return 'reject';
}

export function getHiringLabel(recommendation: HiringRecommendation): string {
  switch (recommendation) {
    case 'strong_hire': return 'Strong Hire';
    case 'hire': return 'Hire';
    case 'maybe': return 'Maybe';
    case 'reject': return 'Reject';
  }
}

export function getHiringColor(recommendation: HiringRecommendation): string {
  switch (recommendation) {
    case 'strong_hire': return 'var(--neon-cyan)';
    case 'hire': return 'var(--neon-green)';
    case 'maybe': return 'var(--neon-amber)';
    case 'reject': return 'var(--neon-red)';
  }
}

export function getQuestionCountByDuration(duration: number): number {
  switch (duration) {
    case 15: return 5;
    case 30: return 10;
    case 45: return 15;
    case 60: return 20;
    default: return 10;
  }
}

export function formatRadarData(report: FinalReport) {
  return {
    labels: [
      'Communication',
      'Technical',
      'Confidence',
      'Coding',
      'Behavioral',
      'Problem Solving',
      'Project Knowledge',
      'Grammar',
      'Professionalism',
    ],
    datasets: [
      {
        label: 'Score',
        data: [
          report.categoryScores.communication,
          report.categoryScores.technical,
          report.categoryScores.confidence,
          report.categoryScores.coding,
          report.categoryScores.behavioral,
          report.categoryScores.problemSolving,
          report.categoryScores.projectKnowledge,
          report.categoryScores.grammar,
          report.categoryScores.professionalism,
        ],
        backgroundColor: 'rgba(0, 240, 255, 0.15)',
        borderColor: '#00f0ff',
        borderWidth: 2,
        pointBackgroundColor: '#00f0ff',
        pointBorderColor: '#00f0ff',
        pointHoverBackgroundColor: '#ff00e5',
        pointHoverBorderColor: '#ff00e5',
        pointRadius: 4,
      },
    ],
  };
}
