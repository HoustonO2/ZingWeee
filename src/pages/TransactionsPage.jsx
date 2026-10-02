import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Download, Edit2, Trash2, Tag, Filter } from 'lucide-react';

export const TransactionsPage = ({ onOpenTransactionModal, onEditTransaction }) => {
  const {
    visibleTransactions,
    visibleUsers,
    visibleAccounts,
    categories,
    deleteTransaction,
    isNonFamilyUser,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = visibleTransactions.filter((tx) => {
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const matchPayee = tx.payee.toLowerCase().includes(query);
      const matchNote = (tx.note || '').toLowerCase().includes(query);
      const matchTags = (tx.tags || []).some((t) => t.toLowerCase().includes(query));
      if (!matchPayee && !matchNote && !matchTags) return false;
    }

    if (filterUser !== 'all' && tx.userId !== filterUser) return false;
    if (filterCategory !== 'all' && tx.categoryId !== filterCategory) return false;
    if (filterType !== 'all' && tx.type !== filterType) return false;

    return true;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'User', 'Account', 'Category', 'Payee', 'Amount', 'Note', 'Tags'];
    const rows = filteredTransactions.map((tx) => {
      const usr = visibleUsers.find((u) => u.id === tx.userId)?.name || '';
      const acc = visibleAccounts.find((a) => a.id === tx.accountId)?.name || '';
      const cat = categories.find((c) => c.id === tx.categoryId)?.name || '';
      return [
        tx.id,
        tx.date,
        tx.type,
        `"${usr}"`,
        `"${acc}"`,
        `"${cat}"`,
        `"${tx.payee}"`,
        tx.amount,
        `"${tx.note || ''}"`,
        `"${(tx.tags || []).join(', ')}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              Transaction Ledger ({filteredTransactions.length} entries)
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
              Search, filter, and manage financial transactions.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={exportCSV} className="btn-secondary" style={{ padding: '9px 14px' }}>
              <Download size={15} />
              <span>Export CSV</span>
            </button>
            <button onClick={onOpenTransactionModal} className="btn-primary" style={{ padding: '9px 16px' }}>
              <Plus size={16} />
              <span>Record Entry</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', gridColumn: 'span 2' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search payee, note, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* User Filter */}
          {!isNonFamilyUser && (
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="select-field"
            >
              <option value="all">All Family Members</option>
              {visibleUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          )}

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="select-field"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type})
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="select-field"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 10px' }}>Date</th>
              <th style={{ padding: '12px 10px' }}>Member</th>
              <th style={{ padding: '12px 10px' }}>Payee / Merchant</th>
              <th style={{ padding: '12px 10px' }}>Category</th>
              <th style={{ padding: '12px 10px' }}>Bank Account</th>
              <th style={{ padding: '12px 10px' }}>Tags & Notes</th>
              <th style={{ padding: '12px 10px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '12px 10px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-subtle)' }}>
                  No transactions match your criteria.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const usr = visibleUsers.find((u) => u.id === tx.userId);
                const acc = visibleAccounts.find((a) => a.id === tx.accountId);
                const cat = categories.find((c) => c.id === tx.categoryId);

                return (
                  <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '14px 10px', color: 'var(--text-muted)' }}>{tx.date}</td>
                    <td style={{ padding: '14px 10px', fontWeight: 600, color: '#fff' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: usr?.avatarColor || '#6366f1' }} />
                        {usr?.name || 'Member'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 10px', color: '#fff', fontWeight: 600 }}>{tx.payee}</td>
                    <td style={{ padding: '14px 10px' }}>
                      <span className="badge" style={{ background: cat?.color + '20', color: cat?.color, border: `1px solid ${cat?.color}40` }}>
                        {cat?.name || 'Category'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 10px', color: 'var(--text-muted)' }}>{acc?.name || 'Account'}</td>
                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {tx.note && <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{tx.note}</span>}
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {(tx.tags || []).map((t) => (
                            <span key={t} style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 10px', textAlign: 'right' }} className="mono-amount">
                      <span style={{ color: tx.type === 'income' ? 'var(--income-green)' : 'var(--expense-rose)', fontWeight: 700, fontSize: '0.95rem' }}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => onEditTransaction(tx)}
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete transaction entry?')) deleteTransaction(tx.id);
                          }}
                          style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--expense-rose)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
