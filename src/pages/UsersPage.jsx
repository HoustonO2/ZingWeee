import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Plus, ShieldCheck, Lock, Edit2, Trash2, KeyRound, CheckCircle } from 'lucide-react';

export const UsersPage = ({ onOpenUserModal, onEditUser }) => {
  const { users, activeUser, isNonFamilyUser, switchUser, deleteUser } = useApp();

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Privacy & Security Enforcement Card */}
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.4)', color: '#d8b4fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                Multi-User Privacy & Non-Family Scope Enforcer
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '750px' }}>
                Users designated as <strong>Non-Family Standalone Members</strong> operate inside an isolated security vault. When logged in as a Non-Family member, the Whole Family Dashboard is completely disabled and hidden, and zero family bank accounts or transactions are accessible.
              </p>
            </div>
          </div>

          <button onClick={onOpenUserModal} className="btn-primary" style={{ padding: '9px 16px' }}>
            <Plus size={16} />
            <span>Add User Profile</span>
          </button>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc' }}>
            <CheckCircle size={16} color="#6366f1" />
            <span>Family Dashboard auto-hidden for non-family users</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc' }}>
            <CheckCircle size={16} color="#6366f1" />
            <span>State-level transaction & account data isolation</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc' }}>
            <CheckCircle size={16} color="#6366f1" />
            <span>Optional 4-digit PIN authentication per user</span>
          </div>
        </div>
      </div>

      {/* User Profiles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {users.map((usr) => {
          const isActive = usr.id === activeUser.id;
          const isNonFam = usr.memberType === 'non_family';

          return (
            <div
              key={usr.id}
              className="glass-card"
              style={{
                padding: '24px',
                borderColor: isActive ? 'var(--primary)' : 'var(--border-color)',
                background: isActive ? 'rgba(30, 41, 59, 0.85)' : 'var(--bg-card)',
                boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                position: 'relative',
              }}
            >
              {isActive && (
                <span className="badge badge-income" style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '0.65rem' }}>
                  ACTIVE SESSION
                </span>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: usr.avatarColor || 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                }}>
                  {usr.avatarInitials}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                    {usr.name}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                    {usr.email}
                  </span>
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Scope Group:</span>
                  <span className={isNonFam ? 'badge badge-nonfamily' : 'badge badge-family'} style={{ fontSize: '0.65rem' }}>
                    {isNonFam ? '🔒 Non-Family Standalone' : '🛡️ Family Vault Member'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Role / Label:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{usr.relationship || usr.role}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>Security PIN:</span>
                  <span className="mono-amount" style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    •••• ({usr.pin})
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <button
                  onClick={() => switchUser(usr.id, false)}
                  disabled={isActive}
                  className={isActive ? 'btn-secondary' : 'btn-primary'}
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem', justifyContent: 'center' }}
                >
                  <KeyRound size={14} />
                  <span>{isActive ? 'Current Active' : `Switch to ${usr.name.split(' ')[0]}`}</span>
                </button>

                <button
                  onClick={() => onEditUser(usr)}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  <Edit2 size={14} />
                </button>

                {users.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove profile for ${usr.name}?`)) deleteUser(usr.id);
                    }}
                    style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--expense-rose)', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
