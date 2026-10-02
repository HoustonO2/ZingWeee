import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check } from 'lucide-react';

export const CategoryModal = ({ isOpen, onClose, initialData = null }) => {
  const { addCategory, editCategory } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    icon: 'Tag',
    color: '#6366f1',
    budgetLimit: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        icon: initialData.icon || 'Tag',
        color: initialData.color || '#6366f1',
        budgetLimit: initialData.budgetLimit || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'expense',
        icon: 'Tag',
        color: '#6366f1',
        budgetLimit: '',
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name.trim(),
      type: formData.type,
      icon: formData.icon,
      color: formData.color,
      budgetLimit: formData.type === 'expense' && formData.budgetLimit ? Number(formData.budgetLimit) : undefined,
    };

    if (initialData) {
      editCategory(initialData.id, payload);
    } else {
      addCategory(payload);
    }
    onClose();
  };

  const AVAILABLE_ICONS = [
    'Home', 'ShoppingCart', 'Utensils', 'Zap', 'Car', 'Tv', 'Activity',
    'ShoppingBag', 'BookOpen', 'Briefcase', 'Laptop', 'TrendingUp', 'Gift',
    'Heart', 'Plane', 'Shield', 'Coffee', 'Smartphone', 'Globe', 'Package', 'Award', 'Camera'
  ];

  const PRESET_COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#a855f7', '#ec4899', '#3b82f6'];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
            {initialData ? 'Edit Financial Category' : 'Create Extensible Category'}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Category Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Category Flow Type *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
                Expense Category
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
                Income Source
              </button>
            </div>
          </div>

          {/* Category Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Category Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Subscriptions, Pet Care, Solar Energy"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Budget Limit (Expense only) */}
          {formData.type === 'expense' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Monthly Budget Threshold Cap ($ USD)
              </label>
              <input
                type="number"
                placeholder="e.g. 500 (Leave empty for unconstrained)"
                value={formData.budgetLimit}
                onChange={(e) => setFormData({ ...formData, budgetLimit: e.target.value })}
                className="input-field"
              />
            </div>
          )}

          {/* Icon Selector Grid */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Category Icon Symbol
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '8px',
              maxHeight: '130px',
              overflowY: 'auto',
              padding: '6px',
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
            }}>
              {AVAILABLE_ICONS.map((iconName) => (
                <button
                  type="button"
                  key={iconName}
                  onClick={() => setFormData({ ...formData, icon: iconName })}
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    background: formData.icon === iconName ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                    border: formData.icon === iconName ? '1px solid var(--primary)' : '1px solid transparent',
                    color: formData.icon === iconName ? '#fff' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{iconName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Badge Theme */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Badge Color Accent
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
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
                  }}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} />
              <span>{initialData ? 'Save Category' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
