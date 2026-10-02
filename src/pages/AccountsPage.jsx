import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, Plus, Edit2, Trash2, ShieldCheck, Wallet } from 'lucide-react';

export const AccountsPage = ({ onOpenAccountModal, onEditAccount }) => {
  const { visibleAccounts, visibleUsers, deleteAccount, isNonFamilyUser } = useApp();
  const [filterOwner, setFilterOwner] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredAccounts = visibleAccounts.filter((acc) => {
    if (filterOwner !== 'all' && acc.userId !== filterOwner) return false;
    if (filterType !== 'all' && acc.type !== filterType) return false;
    return true;
  });

  const totalBalance = filteredAccounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header bar & filter controls */}
      <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
            Extensible Bank & Asset Accounts ({filteredAccounts.length})
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
            Total Asset Balance: <strong style={{ color: 'var(--income-green)' }} className="mono-amount">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Owner Filter */}
          {!isNonFamilyUser && (
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="select-field"
              style={{ width: 'auto', minWidth: '160px' }}
            >
              <option value="all">All Family Owners</option>
              {visibleUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          )}

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="select-field"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="all">All Account Types</option>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="credit">Credit Card</option>
            <option value="investment">Investment</option>
            <option value="cash">Physical Cash</option>
          </select>

          <button onClick={onOpenAccountModal} className="btn-primary" style={{ padding: '9px 16px' }}>
            <Plus size={16} />
            <span>Add Bank Account</span>
          </button>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredAccounts.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-subtle)' }}>
            No bank accounts matched your filters.
          </div>
        ) : (
          filteredAccounts.map((acc) => {
            const owner = visibleUsers.find((u) => u.id === acc.userId);

            return (
              <div
                key={acc.id}
                className="glass-card glass-card-interactive"
                style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: acc.color + '25',
                        border: `1px solid ${acc.color}50`,
                        color: acc.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <CreditCard size={22} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                          {acc.name}
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                          {acc.bankName}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => onEditAccount(acc)}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                        title="Edit Account"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${acc.name}?`)) {
                            deleteAccount(acc.id);
                          }
                        }}
                        style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--expense-rose)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                        title="Delete Account"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Owner: <strong>{owner?.name || 'User'}</strong></span>
                    <span>{acc.accountNumberMask}</span>
                  </div>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge" style={{ background: acc.color + '15', color: acc.color, border: `1px solid ${acc.color}35` }}>
                    {acc.type.toUpperCase()}
                  </span>

                  <div className="mono-amount" style={{ fontSize: '1.35rem', fontWeight: 800, color: acc.balance >= 0 ? '#fff' : 'var(--expense-rose)' }}>
                    ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
