import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  User,
  Plus,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const MemberDashboard = ({ onOpenTransactionModal, onOpenAccountModal }) => {
  const {
    users,
    visibleUsers,
    visibleAccounts,
    visibleTransactions,
    categories,
    selectedMemberId,
    setSelectedMemberId,
    isNonFamilyUser,
    activeUser,
  } = useApp();

  // Find target user object
  const currentMemberId = isNonFamilyUser ? activeUser.id : selectedMemberId;
  const currentMember = users.find((u) => u.id === currentMemberId) || activeUser;

  // Filter accounts and transactions for THIS member specifically
  const memberAccounts = visibleAccounts.filter((a) => a.userId === currentMember.id);
  const memberTransactions = visibleTransactions.filter((t) => t.userId === currentMember.id);

  // Financial Stats
  const memberNetWorth = memberAccounts.reduce((sum, a) => sum + a.balance, 0);

  const currentMonthTx = memberTransactions.filter(
    (t) => t.date.startsWith('2026-10') || t.date.startsWith('2026-09')
  );

  const memberIncome = currentMonthTx
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const memberExpense = currentMonthTx
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = memberIncome - memberExpense;

  // Category Pie Data for selected user
  const catMap = {};
  currentMonthTx
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      catMap[t.categoryId] = (catMap[t.categoryId] || 0) + t.amount;
    });

  const memberPieData = Object.keys(catMap).map((catId) => {
    const cat = categories.find((c) => c.id === catId);
    return {
      name: cat ? cat.name : 'Category',
      value: catMap[catId],
      color: cat ? cat.color : '#6366f1',
    };
  });

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner with Dropdown Selector */}
      <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: currentMember.avatarColor || 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: 800,
            boxShadow: 'var(--shadow-glow)',
          }}>
            {currentMember.avatarInitials}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                {currentMember.name}'s Dashboard
              </h3>
              <span className={currentMember.memberType === 'non_family' ? 'badge badge-nonfamily' : 'badge badge-family'}>
                {currentMember.memberType === 'non_family' ? 'Standalone Non-Family' : currentMember.relationship || 'Family Member'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
              {currentMember.email} • {memberAccounts.length} Connected Accounts
            </p>
          </div>
        </div>

        {/* Person Dropdown Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Select Person:
          </span>
          <select
            value={currentMember.id}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            disabled={isNonFamilyUser}
            className="select-field"
            style={{
              width: 'auto',
              minWidth: '220px',
              background: 'rgba(15, 23, 42, 0.9)',
              borderColor: isNonFamilyUser ? 'var(--border-color)' : 'var(--primary)',
              fontWeight: 700,
              color: isNonFamilyUser ? 'var(--text-muted)' : '#fff',
            }}
          >
            {isNonFamilyUser ? (
              <option value={activeUser.id}>🔒 {activeUser.name} (Isolated Non-Family)</option>
            ) : (
              visibleUsers.map((usr) => (
                <option key={usr.id} value={usr.id}>
                  👤 {usr.name} ({usr.relationship || 'Family'})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {/* Metric 1 */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Personal Net Assets
          </span>
          <div className="mono-amount" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: '10px 0 4px' }}>
            ${memberNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
            Across {memberAccounts.length} bank accounts
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Monthly Income
          </span>
          <div className="mono-amount" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--income-green)', margin: '10px 0 4px' }}>
            +${memberIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            Personal salary & earnings
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Monthly Expenses
          </span>
          <div className="mono-amount" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--expense-rose)', margin: '10px 0 4px' }}>
            -${memberExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            Outflows this month
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Personal Net Savings
          </span>
          <div className="mono-amount" style={{ fontSize: '1.75rem', fontWeight: 800, color: netSavings >= 0 ? 'var(--income-green)' : 'var(--expense-rose)', margin: '10px 0 4px' }}>
            ${netSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Month surplus / deficit
          </div>
        </div>
      </div>

      {/* Main Grid: Accounts List & Category Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
        {/* Linked Accounts List */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                {currentMember.name}'s Bank Accounts
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                Configured financial institution accounts
              </p>
            </div>
            <button onClick={onOpenAccountModal} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <Plus size={14} />
              <span>Add Account</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {memberAccounts.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
                No bank accounts linked to {currentMember.name} yet.
              </div>
            ) : (
              memberAccounts.map((acc) => (
                <div
                  key={acc.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: acc.color + '25',
                      border: `1px solid ${acc.color}50`,
                      color: acc.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                        {acc.name}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                        {acc.bankName} • {acc.accountNumberMask}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div className="mono-amount" style={{ fontSize: '1.15rem', fontWeight: 700, color: acc.balance >= 0 ? '#fff' : 'var(--expense-rose)' }}>
                      ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                      {acc.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <PieChartIcon size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
              Personal Expenses Share
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '16px' }}>
            Spending breakdown for {currentMember.name}
          </p>

          {memberPieData.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
              No recorded expenses for this period.
            </div>
          ) : (
            <>
              <div style={{ width: '100%', height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={memberPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {memberPieData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1e293b', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                      formatter={(val) => `$${val.toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                {memberPieData.map((c) => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{c.name}</span>
                    <span className="mono-amount" style={{ color: '#fff', fontWeight: 600 }}>
                      ${c.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Member Recent Transactions Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              {currentMember.name}'s Transactions Ledger
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              Individual transaction history
            </p>
          </div>
          <button onClick={onOpenTransactionModal} className="btn-primary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
            <Plus size={15} />
            <span>Record Entry</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Payee / Merchant</th>
                <th style={{ padding: '10px' }}>Category</th>
                <th style={{ padding: '10px' }}>Account</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-subtle)' }}>
                    No transactions recorded for {currentMember.name}.
                  </td>
                </tr>
              ) : (
                memberTransactions.slice(0, 6).map((tx) => {
                  const acc = visibleAccounts.find((a) => a.id === tx.accountId);
                  const cat = categories.find((c) => c.id === tx.categoryId);

                  return (
                    <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>{tx.date}</td>
                      <td style={{ padding: '12px 10px', color: '#fff', fontWeight: 600 }}>{tx.payee}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className="badge" style={{ background: cat?.color + '20', color: cat?.color, border: `1px solid ${cat?.color}40` }}>
                          {cat?.name || 'Category'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>{acc?.name || 'Account'}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }} className="mono-amount">
                        <span style={{ color: tx.type === 'income' ? 'var(--income-green)' : 'var(--expense-rose)', fontWeight: 700 }}>
                          {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
