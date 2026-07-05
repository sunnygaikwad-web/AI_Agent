'use client';

// ============================================================
// InterviewAI — Interview Context (Global State)
// ============================================================

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  CandidateInfo,
  ChatMessage,
  InterviewPhase,
  InterviewState,
  QuestionScore,
  FinalReport,
} from '@/lib/types';
import { getQuestionCountByDuration } from '@/lib/scoring';

const initialState: InterviewState = {
  candidateInfo: null,
  messages: [],
  currentPhase: 'setup',
  questionScores: [],
  currentDifficulty: 'medium',
  questionCount: 0,
  totalQuestions: 10,
  isInterviewActive: false,
  isLoading: false,
  interviewStartTime: null,
  interviewDuration: 30,
  finalReport: null,
};

type InterviewAction =
  | { type: 'SET_CANDIDATE_INFO'; payload: CandidateInfo }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_PHASE'; payload: InterviewPhase }
  | { type: 'ADD_SCORE'; payload: QuestionScore }
  | { type: 'SET_DIFFICULTY'; payload: 'easy' | 'medium' | 'hard' | 'faang' }
  | { type: 'INCREMENT_QUESTION' }
  | { type: 'START_INTERVIEW' }
  | { type: 'END_INTERVIEW' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FINAL_REPORT'; payload: FinalReport }
  | { type: 'RESET' };

function interviewReducer(state: InterviewState, action: InterviewAction): InterviewState {
  switch (action.type) {
    case 'SET_CANDIDATE_INFO':
      return {
        ...state,
        candidateInfo: action.payload,
        currentDifficulty: action.payload.difficulty,
        interviewDuration: action.payload.interviewDuration,
        totalQuestions: getQuestionCountByDuration(action.payload.interviewDuration),
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_PHASE':
      return { ...state, currentPhase: action.payload };
    case 'ADD_SCORE':
      return {
        ...state,
        questionScores: [...state.questionScores, action.payload],
      };
    case 'SET_DIFFICULTY':
      return { ...state, currentDifficulty: action.payload };
    case 'INCREMENT_QUESTION':
      return { ...state, questionCount: state.questionCount + 1 };
    case 'START_INTERVIEW':
      return {
        ...state,
        isInterviewActive: true,
        interviewStartTime: new Date(),
        currentPhase: 'introduction',
      };
    case 'END_INTERVIEW':
      return {
        ...state,
        isInterviewActive: false,
        currentPhase: 'report',
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_FINAL_REPORT':
      return { ...state, finalReport: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface InterviewContextType {
  state: InterviewState;
  dispatch: React.Dispatch<InterviewAction>;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(interviewReducer, initialState);

  return (
    <InterviewContext.Provider value={{ state, dispatch }}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}
