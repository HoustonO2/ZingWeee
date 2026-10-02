import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Users,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const FamilyDashboard = ({ onOpenTransactionModal }) => {
  const {
    familyUsers,
    visibleAccounts,
    visibleTransactions,
    categories,
    setActiveTab,
    setSelectedMemberId,
  } = useApp();

  // Aggregate stats across family members
  const totalNetWorth = visibleAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const currentMonthTx = visibleTransactions.filter((tx) => tx.date.startsWith('2026-10') || tx.date.startsWith('2026-09'));

  const totalIncome = currentMonthTx
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = currentMonthTx
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, ((netSavings / totalIncome) * 100).toFixed(1)) : 0;

  // Prepare monthly cashflow data for Recharts
  const monthlyData = [
    { month: 'Jun', income: 11200, expense: 7800 },
    { month: 'Jul', income: 12400, expense: 8100 },
    { month: 'Aug', income: 11800, expense: 7400 },
    { month: 'Sep', income: 12230, expense: 5850 },
    { month: 'Oct (Current)', income: totalIncome || 12700, expense: totalExpense || 6200 },
  ];

  // Category Expense Breakdown for family
  const categorySpendingMap = {};
  currentMonthTx
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      categorySpendingMap[tx.categoryId] = (categorySpendingMap[tx.categoryId] || 0) + tx.amount;
    });

  const categoryPieData = Object.keys(categorySpendingMap).map((catId) => {
    const cat = categories.find((c) => c.id === catId);
    return {
      name: cat ? cat.name : 'Other',
      value: categorySpendingMap[catId],
      color: cat ? cat.color : '#6366f1',
    };
  });

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Metrics Header Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px' }}>
        {/* Card 1: Total Family Net Worth */}
        <div className="glass-card glass-card-interactive" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Total Family Net Worth
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Wallet size={20} />
            </div>
          </div>
          <div className="mono-amount" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '12px 0 4px' }}>
            ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--income-green)' }}>
            <ArrowUpRight size={14} />
            <span>+4.2% from last month across {visibleAccounts.length} accounts</span>
          </div>
        </div>

        {/* Card 2: Household Income */}
        <div className="glass-card glass-card-interactive" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Monthly Family Income
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--income-bg)', color: 'var(--income-green)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mono-amount" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--income-green)', margin: '12px 0 4px' }}>
            +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            Combined salary, dividends & allowances
          </div>
        </div>

        {/* Card 3: Household Expenses */}
        <div className="glass-card glass-card-interactive" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Monthly Family Expenses
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--expense-bg)', color: 'var(--expense-rose)' }}>
              <TrendingDown size={20} />
            </div>
          </div>
          <div className="mono-amount" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--expense-rose)', margin: '12px 0 4px' }}>
            -${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            Groceries, housing, dining & bills
          </div>
        </div>

        {/* Card 4: Net Savings & Savings Rate */}
        <div className="glass-card glass-card-interactive" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Family Net Savings
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <PiggyBank size={20} />
            </div>
          </div>
          <div className="mono-amount" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '12px 0 4px' }}>
            ${netSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Family Savings Rate: <span style={{ color: '#fff', fontWeight: 700 }}>{savingsRate}%</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Visualizations Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Family Cashflow Trend Bar Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                Family Household Cashflow Trend
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                Comparison of aggregated monthly family income vs expenses
              </p>
            </div>
            <span className="badge badge-family">Multi-Member Consolidated</span>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="var(--text-subtle)" fontSize={12} />
                <YAxis stroke="var(--text-subtle)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Bar dataKey="income" name="Family Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Family Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Spending Donut Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
            Family Spending Distribution
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '16px' }}>
            Expense share by category
          </p>

          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '100px', overflowY: 'auto' }}>
            {categoryPieData.map((c) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color }} />
                  <span style={{ color: 'var(--text-muted)' }}>{c.name}</span>
                </div>
                <span className="mono-amount" style={{ color: '#fff', fontWeight: 600 }}>
                  ${c.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Family Member Cards Overview Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
              Family Members Financial Snapshot
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
              Individual contributions, asset balances, and quick switch navigation
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {familyUsers.map((member) => {
            const memberAccounts = visibleAccounts.filter((a) => a.userId === member.id);
            const memberNetWorth = memberAccounts.reduce((sum, a) => sum + a.balance, 0);

            const memberTx = currentMonthTx.filter((t) => t.userId === member.id);
            const memberInc = memberTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const memberExp = memberTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

            return (
              <div
                key={member.id}
                className="glass-card glass-card-interactive"
                style={{ padding: '20px', cursor: 'pointer' }}
                onClick={() => {
                  setSelectedMemberId(member.id);
                  setActiveTab('member_dashboard');
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: member.avatarColor || 'var(--primary)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}>
                      {member.avatarInitials}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                        {member.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        {member.relationship || 'Family Member'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>

                <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-sm)', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Personal Net Assets
                  </span>
                  <div className="mono-amount" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                    ${memberNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-subtle)' }}>Income:</span>
                    <div className="mono-amount" style={{ color: 'var(--income-green)', fontWeight: 600 }}>
                      +${memberInc.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-subtle)' }}>Expenses:</span>
                    <div className="mono-amount" style={{ color: 'var(--expense-rose)', fontWeight: 600 }}>
                      -${memberExp.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--accent-cyan)' }}>
                  <span>{memberAccounts.length} Linked Bank Accounts</span>
                  <span style={{ fontWeight: 700 }}>View Member Dashboard →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Family Transactions Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Recent Household Transactions
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              Real-time activity across all family bank accounts
            </p>
          </div>

          <button onClick={() => setActiveTab('transactions')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            View Full Ledger
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Member</th>
                <th style={{ padding: '10px' }}>Payee / Merchant</th>
                <th style={{ padding: '10px' }}>Category</th>
                <th style={{ padding: '10px' }}>Account</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {visibleTransactions.slice(0, 5).map((tx) => {
                const user = familyUsers.find((u) => u.id === tx.userId);
                const acc = visibleAccounts.find((a) => a.id === tx.accountId);
                const cat = categories.find((c) => c.id === tx.categoryId);

                return (
                  <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>{tx.date}</td>
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: '#fff' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: user?.avatarColor || '#6366f1' }} />
                        {user?.name || 'Member'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#fff' }}>{tx.payee}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className="badge" style={{ background: cat?.color + '20', color: cat?.color, border: `1px solid ${cat?.color}40` }}>
                        {cat?.name || 'General'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>{acc?.name || 'Bank Account'}</td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }} className="mono-amount">
                      <span style={{ color: tx.type === 'income' ? 'var(--income-green)' : 'var(--expense-rose)', fontWeight: 700 }}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
