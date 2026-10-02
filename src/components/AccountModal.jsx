import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check } from 'lucide-react';

export const AccountModal = ({ isOpen, onClose, initialData = null }) => {
  const { visibleUsers, addAccount, editAccount, activeUser } = useApp();

  const [formData, setFormData] = useState({
    userId: activeUser.id,
    name: '',
    bankName: '',
    type: 'checking',
    balance: '',
    color: '#3b82f6',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        userId: initialData.userId,
        name: initialData.name,
        bankName: initialData.bankName || '',
        type: initialData.type,
        balance: initialData.balance,
        color: initialData.color || '#3b82f6',
      });
    } else {
      setFormData({
        userId: activeUser.id,
        name: '',
        bankName: '',
        type: 'checking',
        balance: '',
        color: '#3b82f6',
      });
    }
  }, [isOpen, initialData, activeUser.id]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      userId: formData.userId,
      name: formData.name.trim(),
      bankName: formData.bankName.trim() || 'Custom Financial Institution',
      type: formData.type,
      balance: Number(formData.balance || 0),
      color: formData.color,
    };

    if (initialData) {
      editAccount(initialData.id, payload);
    } else {
      addAccount(payload);
    }
    onClose();
  };

  const PRESET_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#a855f7'];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
            {initialData ? 'Edit Bank Account' : 'Add New Bank / Asset Account'}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Owner selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Account Owner *
            </label>
            <select
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="select-field"
            >
              {visibleUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account Title & Bank Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Account Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Primary Checking"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Financial Institution / Bank
              </label>
              <input
                type="text"
                placeholder="e.g. Chase, Vanguard, Fidelity"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Type & Initial Balance */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Account Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="select-field"
              >
                <option value="checking">Checking Account</option>
                <option value="savings">Savings / High Yield</option>
                <option value="credit">Credit Card (Liability)</option>
                <option value="investment">Brokerage / Investment</option>
                <option value="cash">Physical Cash Wallet</option>
                <option value="loan">Mortgage / Personal Loan</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Current Balance ($ USD) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Account Badge Theme Color
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {PRESET_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setFormData({ ...formData, color: c })}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: c,
                    border: formData.color === c ? '3px solid #fff' : 'none',
                    cursor: 'pointer',
                    boxShadow: formData.color === c ? '0 0 10px ' + c : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} />
              <span>{initialData ? 'Update Account' : 'Create Account'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
