'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInterview } from '@/context/InterviewContext';
import { CandidateInfo } from '@/lib/types';
import { ProgressStepper } from '@/components/ProgressStepper';
import {
  User,
  GraduationCap,
  Building2,
  Calendar,
  Briefcase,
  Target,
  Code2,
  Lightbulb,
  FolderGit2,
  Gauge,
  Clock,
  ArrowRight,
  ArrowLeft,
  Rocket,
} from 'lucide-react';

const steps = [
  'Personal',
  'Education',
  'Experience',
  'Target',
  'Skills',
  'Projects',
  'Difficulty',
  'Duration',
];

const difficultyOptions = [
  { id: 'easy', label: 'Easy', icon: '🟢', desc: 'Basic concepts & fundamentals' },
  { id: 'medium', label: 'Medium', icon: '🟡', desc: 'Intermediate questions & scenarios' },
  { id: 'hard', label: 'Hard', icon: '🟠', desc: 'Advanced topics & system design' },
  { id: 'faang', label: 'FAANG', icon: '🔴', desc: 'Google/Meta level questions' },
] as const;

const durationOptions = [
  { value: 15, label: '15 min', desc: 'Quick round — ~5 questions' },
  { value: 30, label: '30 min', desc: 'Standard — ~10 questions' },
  { value: 45, label: '45 min', desc: 'Extended — ~15 questions' },
  { value: 60, label: '60 min', desc: 'Full interview — ~20 questions' },
] as const;

export default function SetupPage() {
  const router = useRouter();
  const { dispatch } = useInterview();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<Partial<CandidateInfo>>({
    fullName: '',
    degree: '',
    college: '',
    graduationYear: '',
    experience: 'fresher',
    desiredRole: '',
    targetCompany: '',
    programmingLanguages: '',
    skills: '',
    projects: '',
    difficulty: 'medium',
    interviewDuration: 30,
  });

  const updateField = (field: keyof CandidateInfo, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!formData.fullName?.trim();
      case 1:
        return !!formData.degree?.trim() && !!formData.college?.trim() && !!formData.graduationYear?.trim();
      case 2:
        return !!formData.experience;
      case 3:
        return !!formData.desiredRole?.trim() && !!formData.targetCompany?.trim();
      case 4:
        return !!formData.programmingLanguages?.trim() && !!formData.skills?.trim();
      case 5:
        return !!formData.projects?.trim();
      case 6:
        return !!formData.difficulty;
      case 7:
        return !!formData.interviewDuration;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const candidateInfo = formData as CandidateInfo;
    dispatch({ type: 'SET_CANDIDATE_INFO', payload: candidateInfo });
    dispatch({ type: 'START_INTERVIEW' });
    router.push('/interview');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="glass-card animate-fade-in-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <User size={24} style={{ color: 'var(--neon-cyan)' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                }}
              >
                Personal Information
              </h2>
            </div>
            <div>
              <label className="input-label" htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                className="input-field"
                placeholder="Enter your full name"
                value={formData.fullName || ''}
                onChange={(e) => updateField('fullName', e.target.value)}
                autoFocus
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="glass-card animate-fade-in-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <GraduationCap size={24} style={{ color: 'var(--neon-cyan)' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                }}
              >
                Education
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="input-label" htmlFor="degree">
                  <GraduationCap size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Degree
                </label>
                <input
                  type="text"
                  id="degree"
                  className="input-field"
                  placeholder="e.g., B.Tech in Computer Science"
                  value={formData.degree || ''}
                  onChange={(e) => updateField('degree', e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="input-label" htmlFor="college">
                  <Building2 size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  College / University
                </label>
                <input
                  type="text"
                  id="college"
                  className="input-field"
                  placeholder="e.g., IIT Delhi, MIT, Stanford"
                  value={formData.college || ''}
                  onChange={(e) => updateField('college', e.target.value)}
                />
              </div>
              <div>
                <label className="input-label" htmlFor="graduationYear">
                  <Calendar size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Graduation Year
                </label>
                <input
                  type="text"
                  id="graduationYear"
                  className="input-field"
                  placeholder="e.g., 2024"
                  value={formData.graduationYear || ''}
                  onChange={(e) => updateField('graduationYear', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="glass-card animate-fade-in-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Briefcase size={24} style={{ color: 'var(--neon-cyan)' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                }}
              >
                Experience Level
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { id: 'fresher', label: 'Fresher', desc: '0-1 years experience', icon: '🎓' },
                { id: 'experienced', label: 'Experienced', desc: '1+ years experience', icon: '💼' },
              ].map((option) => (
                <div
                  key={option.id}
                  className={`difficulty-card ${formData.experience === option.id ? 'selected' : ''}`}
                  onClick={() => updateField('experience', option.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="difficulty-icon">{option.icon}</div>
                  <div className="difficulty-name" style={{ color: formData.experience === option.id ? 'var(--neon-cyan)' : 'var(--text-primary)' }}>
                    {option.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {option.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="glass-card animate-fade-in-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Target size={24} style={{ color: 'var(--neon-cyan)' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                }}
              >
                Target Position
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="input-label" htmlFor="desiredRole">Desired Role</label>
                <input
                  type="text"
                  id="desiredRole"
                  className="input-field"
                  placeholder="e.g., Software Engineer, ML Engineer, Frontend Developer"
                  value={formData.desiredRole || ''}
                  onChange={(e) => updateField('desiredRole', e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="input-label" htmlFor="targetCompany">Target Company</label>
                <input
                  type="text"
                  id="targetCompany"
                  className="input-field"
                  placeholder="e.g., Google, Microsoft, Amazon, Any"
                  value={formData.targetCompany || ''}
                  onChange={(e) => updateField('targetCompany', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="glass-card animate-fade-in-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Code2 size={24} style={{ color: 'var(--neon-cyan)' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                }}
              >
                Technical Skills
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="input-label" htmlFor="programmingLanguages">
                  <Code2 size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Programming Languages
                </label>
                <input
                  type="text"
                  id="programmingLanguages"
                  className="input-field"
                  placeholder="e.g., Python, Java, JavaScript, C++"
                  value={formData.programmingLanguages || ''}
                  onChange={(e) => updateField('programmingLanguages', e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="input-label" htmlFor="skills">
                  <Lightbulb size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Skills & Technologies
                </label>
                <textarea
                  id="skills"
                  className="input-field"
                  placeholder="e.g., React, Node.js, Docker, AWS, Machine Learning, SQL, Git..."
                  value={formData.skills || ''}
                  onChange={(e) => updateField('skills', e.target.value)}
                  style={{ minHeight: '80px' }}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="glass-card animate-fade-in-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <FolderGit2 size={24} style={{ color: 'var(--neon-cyan)' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                }}
              >
                Projects
              </h2>
            </div>
            <div>
              <label className="input-label" htmlFor="projects">Describe Your Projects</label>
              <textarea
                id="projects"
                className="input-field"
                placeholder="Describe your major projects. Include the tech stack, your role, and key features.

Example:
1. E-Commerce Platform — Built with React, Node.js, MongoDB. Implemented payment gateway, user auth, and admin dashboard.
2. ML Image Classifier — Python, TensorFlow. Trained CNN model with 95% accuracy on custom dataset."
                value={formData.projects || ''}
                onChange={(e) => updateField('projects', e.target.value)}
                style={{ minHeight: '180px' }}
                autoFocus
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="glass-card animate-fade-in-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Gauge size={24} style={{ color: 'var(--neon-cyan)' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                }}
              >
                Difficulty Level
              </h2>
            </div>
            <div className="difficulty-grid">
              {difficultyOptions.map((option) => (
                <div
                  key={option.id}
                  className={`difficulty-card ${option.id} ${formData.difficulty === option.id ? 'selected' : ''}`}
                  onClick={() => updateField('difficulty', option.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="difficulty-icon">{option.icon}</div>
                  <div className="difficulty-name">{option.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {option.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="glass-card animate-fade-in-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Clock size={24} style={{ color: 'var(--neon-cyan)' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                }}
              >
                Interview Duration
              </h2>
            </div>
            <div className="difficulty-grid">
              {durationOptions.map((option) => (
                <div
                  key={option.value}
                  className={`difficulty-card ${formData.interviewDuration === option.value ? 'selected' : ''}`}
                  onClick={() => updateField('interviewDuration', option.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: formData.interviewDuration === option.value ? 'var(--neon-cyan)' : 'var(--text-primary)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {option.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {option.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px', padding: 'clamp(1rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1rem)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            marginBottom: '0.5rem',
          }}
        >
          <span className="neon-text-cyan">Setup</span> Your Interview
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Tell us about yourself so we can customize your interview experience.
        </p>
      </div>

      {/* Progress Stepper */}
      <ProgressStepper steps={steps} currentStep={currentStep} />

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '2rem',
          gap: '1rem',
        }}
      >
        <button
          className="btn btn-ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
          style={{
            opacity: currentStep === 0 ? 0.3 : 1,
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
          }}
          id="setup-back"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {currentStep === steps.length - 1 ? (
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={!isStepValid()}
            style={{
              opacity: !isStepValid() ? 0.5 : 1,
              cursor: !isStepValid() ? 'not-allowed' : 'pointer',
            }}
            id="start-interview"
          >
            <Rocket size={18} />
            Start Interview
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isStepValid()}
            style={{
              opacity: !isStepValid() ? 0.5 : 1,
              cursor: !isStepValid() ? 'not-allowed' : 'pointer',
            }}
            id="setup-next"
          >
            Next
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
