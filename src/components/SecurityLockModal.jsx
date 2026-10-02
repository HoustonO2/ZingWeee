import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const SecurityLockModal = () => {
  const { isPinLocked, activeUser, handleUnlock, lockError } = useApp();
  const [pinInput, setPinInput] = useState('');

  if (!isPinLocked) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    handleUnlock(pinInput);
  };

  const handleQuickDigit = (digit) => {
    if (pinInput.length < 4) {
      const next = pinInput + digit;
      setPinInput(next);
      if (next.length === 4) {
        handleUnlock(next);
      }
    }
  };

  const handleClear = () => setPinInput('');

  return (
    <div className="modal-overlay" style={{ zIndex: 9999, background: 'rgba(9, 13, 22, 0.95)' }}>
      <div className="modal-content" style={{ maxWidth: '420px', padding: '32px', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(236, 72, 153, 0.15)',
          border: '1px solid rgba(236, 72, 153, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px',
          color: 'var(--security-lock)',
        }}>
          <Lock size={32} />
        </div>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
          Personal Data Locked
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          Enter PIN code to access <strong>{activeUser.name}</strong>'s vault.
        </p>

        <form onSubmit={onSubmit} style={{ marginTop: '24px' }}>
          {/* Masked PIN Display */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}>
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                style={{
                  width: '44px',
                  height: '52px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: pinInput.length > idx ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: '#fff',
                  fontWeight: 700,
                  boxShadow: pinInput.length > idx ? 'var(--shadow-glow)' : 'none',
                }}
              >
                {pinInput.length > idx ? '•' : ''}
              </div>
            ))}
          </div>

          {lockError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: 'var(--expense-rose)',
              fontSize: '0.82rem',
              marginBottom: '16px',
            }}>
              <ShieldAlert size={15} />
              <span>{lockError}</span>
            </div>
          )}

          {/* Keypad */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            maxWidth: '280px',
            margin: '0 auto 20px',
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => handleQuickDigit(num.toString())}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-color)',
                  color: '#fff',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: 'var(--expense-rose)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleQuickDigit('0')}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '1.2rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              0
            </button>
            <button
              type="submit"
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-gradient)',
                border: 'none',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              OK
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
            Demo PIN for {activeUser.name}: <strong style={{ color: 'var(--accent-cyan)' }}>{activeUser.pin || '1234'}</strong>
          </div>
        </form>
      </div>
    </div>
  );
};
