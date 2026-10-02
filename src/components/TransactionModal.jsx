import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check } from 'lucide-react';

export const TransactionModal = ({ isOpen, onClose, initialData = null }) => {
  const {
    visibleUsers,
    visibleAccounts,
    categories,
    addTransaction,
    editTransaction,
    activeUser,
  } = useApp();

  const [formData, setFormData] = useState({
    userId: activeUser.id,
    accountId: '',
    categoryId: '',
    type: 'expense',
    amount: '',
    payee: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    tagsStr: '',
    isRecurring: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        userId: initialData.userId,
        accountId: initialData.accountId,
        categoryId: initialData.categoryId,
        type: initialData.type,
        amount: initialData.amount,
        payee: initialData.payee || '',
        date: initialData.date,
        note: initialData.note || '',
        tagsStr: (initialData.tags || []).join(', '),
        isRecurring: !!initialData.isRecurring,
      });
    } else {
      const defaultUserAccs = visibleAccounts.filter((a) => a.userId === activeUser.id);
      const defaultAccId = defaultUserAccs[0]?.id || visibleAccounts[0]?.id || '';
      const defaultCatId = categories.find((c) => c.type === 'expense')?.id || categories[0]?.id || '';

      setFormData({
        userId: activeUser.id,
        accountId: defaultAccId,
        categoryId: defaultCatId,
        type: 'expense',
        amount: '',
        payee: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
        tagsStr: '',
        isRecurring: false,
      });
    }
  }, [isOpen, initialData, activeUser.id, visibleAccounts, categories]);

  if (!isOpen) return null;

  // Filter accounts belonging to selected user in modal
  const userAccounts = visibleAccounts.filter((a) => a.userId === formData.userId);
  // Filter categories by selected transaction type
  const typeCategories = categories.filter((c) => c.type === formData.type);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) return;
    if (!formData.accountId) return;

    const tagsArr = formData.tagsStr
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      userId: formData.userId,
      accountId: formData.accountId,
      categoryId: formData.categoryId,
      type: formData.type,
      amount: Number(formData.amount),
      payee: formData.payee,
      date: formData.date,
      note: formData.note,
      tags: tagsArr,
      isRecurring: formData.isRecurring,
    };

    if (initialData) {
      editTransaction(initialData.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
            {initialData ? 'Edit Transaction' : 'Record New Transaction'}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Transaction Type Segment Switcher */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Transaction Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: formData.type === 'expense' ? '1px solid var(--expense-rose)' : '1px solid var(--border-color)',
                  background: formData.type === 'expense' ? 'var(--expense-bg)' : 'rgba(15, 23, 42, 0.6)',
                  color: formData.type === 'expense' ? 'var(--expense-rose)' : 'var(--text-muted)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Expense (-)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: formData.type === 'income' ? '1px solid var(--income-green)' : '1px solid var(--border-color)',
                  background: formData.type === 'income' ? 'var(--income-bg)' : 'rgba(15, 23, 42, 0.6)',
                  color: formData.type === 'income' ? 'var(--income-green)' : 'var(--text-muted)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Income (+)
              </button>
            </div>
          </div>

          {/* Amount & Date Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Amount ($ USD) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input-field"
                style={{ fontSize: '1.1rem', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Member & Account Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Account Owner *
              </label>
              <select
                value={formData.userId}
                onChange={(e) => {
                  const newUserId = e.target.value;
                  const firstAcc = visibleAccounts.find((a) => a.userId === newUserId)?.id || '';
                  setFormData({ ...formData, userId: newUserId, accountId: firstAcc });
                }}
                className="select-field"
              >
                {visibleUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Bank Account *
              </label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="select-field"
                required
              >
                {userAccounts.length === 0 ? (
                  <option value="">No accounts found for user</option>
                ) : (
                  userAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (${a.balance.toLocaleString()})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Category & Payee */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="select-field"
                required
              >
                {typeCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Payee / Merchant Name
              </label>
              <input
                type="text"
                placeholder="e.g. Whole Foods, TechCorp"
                value={formData.payee}
                onChange={(e) => setFormData({ ...formData, payee: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Tags & Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. groceries, family, tax-deductible"
              value={formData.tagsStr}
              onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Description / Memo
            </label>
            <input
              type="text"
              placeholder="Optional notes or details"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Recurring Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-main)' }}>
            <input
              type="checkbox"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
            />
            <span>Mark as Recurring Monthly Transaction</span>
          </label>

          {/* Submit buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} />
              <span>{initialData ? 'Save Changes' : 'Record Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
