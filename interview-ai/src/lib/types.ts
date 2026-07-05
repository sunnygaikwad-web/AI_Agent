// ============================================================
// InterviewAI — Type Definitions
// ============================================================

export interface CandidateInfo {
  fullName: string;
  degree: string;
  college: string;
  graduationYear: string;
  experience: 'fresher' | 'experienced';
  desiredRole: string;
  targetCompany: string;
  programmingLanguages: string;
  skills: string;
  projects: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'faang';
  interviewDuration: 15 | 30 | 45 | 60;
}

export type InterviewPhase =
  | 'setup'
  | 'introduction'
  | 'technical'
  | 'behavioral'
  | 'coding'
  | 'project'
  | 'hr'
  | 'report';

export interface QuestionScore {
  communication: number;
  technicalAccuracy: number;
  confidence: number;
  problemSolving: number;
  explanation: number;
  total: number;
}

export interface QuestionFeedback {
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  howToImprove: string[];
  idealAnswer: string;
}

export interface ChatMessage {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: Date;
  score?: QuestionScore;
  feedback?: QuestionFeedback;
  phase?: InterviewPhase;
}

export interface FinalReport {
  overallScore: number;
  categoryScores: {
    communication: number;
    technical: number;
    confidence: number;
    coding: number;
    behavioral: number;
    problemSolving: number;
    projectKnowledge: number;
    grammar: number;
    professionalism: number;
  };
  strongAreas: string[];
  averageAreas: string[];
  weakAreas: string[];
  hiringRecommendation: HiringRecommendation;
  roadmap: string[];
  resources: ResourceRecommendation[];
}

export type HiringRecommendation = 'reject' | 'maybe' | 'hire' | 'strong_hire';

export interface ResourceRecommendation {
  category: string;
  name: string;
  url?: string;
  type: 'youtube' | 'documentation' | 'course' | 'website' | 'book';
}

export interface InterviewState {
  candidateInfo: CandidateInfo | null;
  messages: ChatMessage[];
  currentPhase: InterviewPhase;
  questionScores: QuestionScore[];
  currentDifficulty: 'easy' | 'medium' | 'hard' | 'faang';
  questionCount: number;
  totalQuestions: number;
  isInterviewActive: boolean;
  isLoading: boolean;
  interviewStartTime: Date | null;
  interviewDuration: number;
  finalReport: FinalReport | null;
}
