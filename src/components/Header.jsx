import React from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Shield, Lock, UserCheck, Calendar } from 'lucide-react';

export const Header = ({ onOpenTransactionModal, onOpenAccountModal }) => {
  const {
    activeTab,
    activeUser,
    isNonFamilyUser,
    familyUsers,
    selectedMemberId,
    setSelectedMemberId,
    setIsPinLocked,
  } = useApp();

  const getTitleAndSubtitle = () => {
    switch (activeTab) {
      case 'family_dashboard':
        return {
          title: 'Whole Family Financial Dashboard',
          subtitle: 'Consolidated net worth, joint cashflows, member contributions & shared budgets.',
        };
      case 'member_dashboard':
        return {
          title: isNonFamilyUser ? 'Personal Financial Dashboard' : 'Individual Member Dashboard',
          subtitle: isNonFamilyUser
            ? 'Private bank accounts, category spending breakdown, and personal insights.'
            : 'Select any family member from the dropdown to view their detailed finances.',
        };
      case 'accounts':
        return {
          title: 'Extensible Bank Accounts',
          subtitle: 'Manage checking, savings, credit cards, investments & custom accounts.',
        };
      case 'categories':
        return {
          title: 'Categories & Budget Limits',
          subtitle: 'Configure custom income/expense categories, colors, icons, and spending caps.',
        };
      case 'transactions':
        return {
          title: 'Transaction Ledger & History',
          subtitle: 'Search, filter, export, import and record financial transactions with split tags.',
        };
      case 'analytics':
        return {
          title: 'Financial Analytics & Smart Insights',
          subtitle: 'Visual cashflow charts, monthly trends, savings rate, and financial health score.',
        };
      case 'users':
        return {
          title: 'User Management & Security Rules',
          subtitle: 'Configure family members vs isolated non-family standalone profiles.',
        };
      case 'settings':
        return {
          title: 'System Settings & Security Data Backup',
          subtitle: 'Export backup files, reset demo state, and check client-side encryption simulation.',
        };
      default:
        return { title: 'Dashboard', subtitle: '' };
    }
  };

  const { title, subtitle } = getTitleAndSubtitle();

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header style={{
      padding: '20px 32px',
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
    }}>
      <div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>
          {title}
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Date Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}>
          <Calendar size={14} color="var(--accent-cyan)" />
          <span>{todayStr}</span>
        </div>

        {/* Individual Member Dropdown on Member View */}
        {activeTab === 'member_dashboard' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Viewing:
            </span>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              disabled={isNonFamilyUser}
              className="select-field"
              style={{
                width: 'auto',
                minWidth: '180px',
                background: 'rgba(30, 41, 59, 0.9)',
                borderColor: isNonFamilyUser ? 'var(--border-color)' : 'var(--primary)',
                fontWeight: 700,
                color: isNonFamilyUser ? 'var(--text-muted)' : '#fff',
              }}
            >
              {isNonFamilyUser ? (
                <option value={activeUser.id}>🔒 {activeUser.name} (Isolated)</option>
              ) : (
                familyUsers.map((m) => (
                  <option key={m.id} value={m.id}>
                    👤 {m.name} ({m.relationship || 'Family'})
                  </option>
                ))
              )}
            </select>
          </div>
        )}

        {/* PIN Security Lock Quick Button */}
        <button
          onClick={() => setIsPinLocked(true)}
          className="btn-secondary"
          title="Lock App with PIN"
          style={{ padding: '8px 12px', fontSize: '0.82rem' }}
        >
          <Lock size={15} color="var(--security-lock)" />
          <span>Lock App</span>
        </button>

        {/* Action Buttons */}
        <button onClick={onOpenAccountModal} className="btn-secondary" style={{ padding: '9px 14px' }}>
          <Plus size={16} />
          <span>Add Account</span>
        </button>

        <button onClick={onOpenTransactionModal} className="btn-primary" style={{ padding: '9px 16px' }}>
          <Plus size={16} />
          <span>Add Transaction</span>
        </button>
      </div>
    </header>
  );
};
