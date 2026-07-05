'use client';

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}
          >
            <div
              className={`stepper-dot ${
                index < currentStep
                  ? 'completed'
                  : index === currentStep
                  ? 'active'
                  : ''
              }`}
            />
            <span
              style={{
                fontSize: '0.5rem',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color:
                  index < currentStep
                    ? 'var(--neon-green)'
                    : index === currentStep
                    ? 'var(--neon-cyan)'
                    : 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`stepper-line ${index < currentStep ? 'completed' : ''}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
