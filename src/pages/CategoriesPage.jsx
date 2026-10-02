import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PieChart, Plus, Edit2, Trash2, Tag, AlertCircle } from 'lucide-react';

export const CategoriesPage = ({ onOpenCategoryModal, onEditCategory }) => {
  const { categories, deleteCategory, visibleTransactions } = useApp();
  const [activeTypeTab, setActiveTypeTab] = useState('expense');

  // Compute total spending per category in current month
  const currentMonthTx = visibleTransactions.filter(
    (t) => t.date.startsWith('2026-10') || t.date.startsWith('2026-09')
  );

  const categorySpentMap = {};
  currentMonthTx.forEach((tx) => {
    categorySpentMap[tx.categoryId] = (categorySpentMap[tx.categoryId] || 0) + tx.amount;
  });

  const filteredCategories = categories.filter((c) => c.type === activeTypeTab);

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Tab Selector */}
      <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
            Extensible Financial Categories & Budget Caps
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
            Configure custom income and expense categories, icons, colors, and spending thresholds.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveTypeTab('expense')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeTypeTab === 'expense' ? 'var(--expense-bg)' : 'transparent',
                color: activeTypeTab === 'expense' ? 'var(--expense-rose)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Expense Categories ({categories.filter((c) => c.type === 'expense').length})
            </button>
            <button
              onClick={() => setActiveTypeTab('income')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeTypeTab === 'income' ? 'var(--income-bg)' : 'transparent',
                color: activeTypeTab === 'income' ? 'var(--income-green)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Income Categories ({categories.filter((c) => c.type === 'income').length})
            </button>
          </div>

          <button onClick={onOpenCategoryModal} className="btn-primary" style={{ padding: '9px 16px' }}>
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredCategories.map((cat) => {
          const spent = categorySpentMap[cat.id] || 0;
          const limit = cat.budgetLimit;
          const percent = limit ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
          const isOverBudget = limit && spent > limit;

          return (
            <div
              key={cat.id}
              className="glass-card glass-card-interactive"
              style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: cat.color + '25',
                      border: `1px solid ${cat.color}50`,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}>
                      <Tag size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                        {cat.name}
                      </h4>
                      <span className="badge" style={{ background: cat.color + '20', color: cat.color, fontSize: '0.65rem' }}>
                        {cat.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => onEditCategory(cat)}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                      title="Edit Category"
                    >
                      <Edit2 size={14} />
                    </button>
                    {!cat.isSystem && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete category ${cat.name}?`)) deleteCategory(cat.id);
                        }}
                        style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--expense-rose)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                        title="Delete Category"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0 6px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Month Spending:</span>
                  <span className="mono-amount" style={{ color: '#fff', fontWeight: 700 }}>
                    ${spent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {limit ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>
                      <span>Budget Threshold Cap: ${limit.toLocaleString()}</span>
                      <span style={{ color: isOverBudget ? 'var(--expense-rose)' : 'var(--accent-cyan)', fontWeight: 700 }}>
                        {percent}%
                      </span>
                    </div>

                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: isOverBudget ? 'var(--expense-rose)' : cat.color,
                          borderRadius: '4px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                    No budget limit cap defined.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
