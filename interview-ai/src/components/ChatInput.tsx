'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Code, MessageSquare } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type your answer...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--border-default)',
        background: 'rgba(10, 10, 15, 0.9)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-end',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Code mode toggle */}
        <button
          onClick={() => setIsCodeMode(!isCodeMode)}
          className="btn btn-ghost btn-sm"
          title={isCodeMode ? 'Switch to text mode' : 'Switch to code mode'}
          style={{
            borderColor: isCodeMode ? 'var(--neon-cyan)' : 'var(--border-default)',
            color: isCodeMode ? 'var(--neon-cyan)' : 'var(--text-muted)',
            padding: '0.6rem',
            flexShrink: 0,
          }}
          id="toggle-code-mode"
        >
          {isCodeMode ? <Code size={18} /> : <MessageSquare size={18} />}
        </button>

        {/* Text area */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Waiting for interviewer...' : placeholder}
          disabled={disabled}
          className="input-field"
          id="chat-input"
          style={{
            fontFamily: isCodeMode ? 'var(--font-mono)' : 'var(--font-body)',
            fontSize: isCodeMode ? '0.875rem' : '0.95rem',
            minHeight: isCodeMode ? '120px' : '48px',
            maxHeight: '200px',
            resize: 'none',
            lineHeight: isCodeMode ? '1.5' : '1.6',
          }}
          rows={1}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="btn btn-primary btn-sm"
          id="send-message"
          style={{
            padding: '0.7rem',
            flexShrink: 0,
            opacity: disabled || !message.trim() ? 0.4 : 1,
            cursor: disabled || !message.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          <Send size={18} />
        </button>
      </div>

      {/* Character count & mode indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: '900px',
          margin: '0.5rem auto 0',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
        }}
      >
        <span>
          {isCodeMode ? '⟨/⟩ Code Mode' : '💬 Text Mode'} • Press Shift+Enter for new line
        </span>
        <span>{message.length} chars</span>
      </div>
    </div>
  );
}
