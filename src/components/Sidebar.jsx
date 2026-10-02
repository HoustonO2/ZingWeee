import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  User,
  CreditCard,
  PieChart,
  Receipt,
  BarChart3,
  ShieldCheck,
  Settings,
  Lock,
  Users,
  ChevronDown,
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    activeUser,
    isNonFamilyUser,
    users,
    switchUser,
  } = useApp();

  const navItems = [
    {
      id: 'family_dashboard',
      label: 'Whole Family Dashboard',
      icon: LayoutDashboard,
      hideForNonFamily: true,
    },
    {
      id: 'member_dashboard',
      label: isNonFamilyUser ? 'My Dashboard' : 'Member View',
      icon: User,
    },
    {
      id: 'accounts',
      label: 'Bank Accounts',
      icon: CreditCard,
    },
    {
      id: 'categories',
      label: 'Categories & Budgets',
      icon: PieChart,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: Receipt,
    },
    {
      id: 'analytics',
      label: 'Analytics & Insights',
      icon: BarChart3,
    },
    {
      id: 'users',
      label: 'Users & Security',
      icon: ShieldCheck,
    },
    {
      id: 'settings',
      label: 'Settings & Data',
      icon: Settings,
    },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(15, 23, 42, 0.95)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      {/* App Branding Header */}
      <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
              FamilyVault
            </h1>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Secure FinTracker
            </span>
          </div>
        </div>
      </div>

      {/* Security Scope Indicator Banner */}
      {isNonFamilyUser ? (
        <div style={{
          margin: '12px 16px 4px',
          padding: '10px 12px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(168, 85, 247, 0.12)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: '#d8b4fe',
        }}>
          <Lock size={14} color="#a855f7" />
          <span><strong>Isolated Mode</strong>: Non-Family member active. Family dashboard locked.</span>
        </div>
      ) : (
        <div style={{
          margin: '12px 16px 4px',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: '#a5b4fc',
        }}>
          <Users size={14} color="#6366f1" />
          <span><strong>Family Vault</strong>: Consolidated view enabled.</span>
        </div>
      )}

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          if (item.hideForNonFamily && isNonFamilyUser) return null;

          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: isActive ? 'var(--primary-gradient)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
              }}
            >
              <IconComponent size={18} color={isActive ? '#fff' : 'var(--text-muted)'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Active User Footer Card & Quick Switcher */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-color)',
        background: 'rgba(9, 13, 22, 0.6)',
      }}>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-subtle)', fontWeight: 700, marginBottom: '8px' }}>
          Active Account Scope
        </div>

        <div style={{ position: 'relative' }}>
          <select
            value={activeUser.id}
            onChange={(e) => switchUser(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 32px 10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(30, 41, 59, 0.9)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              appearance: 'none',
            }}
          >
            <optgroup label="Family Members">
              {users
                .filter((u) => u.memberType === 'family')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role === 'family_admin' ? 'Admin' : 'Family'})
                  </option>
                ))}
            </optgroup>
            <optgroup label="Non-Family Members (Isolated)">
              {users
                .filter((u) => u.memberType === 'non_family')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    🔒 {u.name} (Non-Family)
                  </option>
                ))}
            </optgroup>
          </select>
          <ChevronDown
            size={16}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: 'var(--text-muted)',
            }}
          />
        </div>

        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: activeUser.avatarColor || 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#fff',
          }}>
            {activeUser.avatarInitials}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeUser.name}
            </div>
            <span className={isNonFamilyUser ? 'badge badge-nonfamily' : 'badge badge-family'} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
              {isNonFamilyUser ? 'Non-Family' : activeUser.role === 'family_admin' ? 'Family Admin' : 'Family Member'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
