import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, Lock, ShieldCheck, UserX } from 'lucide-react';

export const UserModal = ({ isOpen, onClose, initialData = null }) => {
  const { addUser, editUser } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    memberType: 'family', // family | non_family
    role: 'family_member',
    relationship: '',
    avatarColor: '#6366f1',
    pin: '1234',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email || '',
        memberType: initialData.memberType || 'family',
        role: initialData.role || 'family_member',
        relationship: initialData.relationship || '',
        avatarColor: initialData.avatarColor || '#6366f1',
        pin: initialData.pin || '1234',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        memberType: 'family',
        role: 'family_member',
        relationship: '',
        avatarColor: '#6366f1',
        pin: '1234',
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@vault.local`,
      memberType: formData.memberType,
      role: formData.memberType === 'non_family' ? 'non_family' : formData.role,
      relationship: formData.relationship.trim() || (formData.memberType === 'non_family' ? 'Non-Family Standalone' : 'Family Member'),
      avatarColor: formData.avatarColor,
      pin: formData.pin || '1234',
    };

    if (initialData) {
      editUser(initialData.id, payload);
    } else {
      addUser(payload);
    }
    onClose();
  };

  const AVATAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#a855f7', '#06b6d4', '#ec4899', '#f97316', '#64748b'];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
            {initialData ? 'Edit User Profile & Security' : 'Add User Profile'}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Member Type Switcher - CRITICAL PRIVACY BOUNDARY */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Scope & Privacy Group *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, memberType: 'family', role: 'family_member' })}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: formData.memberType === 'family' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: formData.memberType === 'family' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: formData.memberType === 'family' ? '#a5b4fc' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <ShieldCheck size={18} color={formData.memberType === 'family' ? '#6366f1' : 'var(--text-muted)'} />
                <div>
                  <div>Family Member</div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 400, opacity: 0.8 }}>Can access Family Dashboard</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, memberType: 'non_family', role: 'non_family' })}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: formData.memberType === 'non_family' ? '1px solid #a855f7' : '1px solid var(--border-color)',
                  background: formData.memberType === 'non_family' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: formData.memberType === 'non_family' ? '#d8b4fe' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Lock size={18} color={formData.memberType === 'non_family' ? '#a855f7' : 'var(--text-muted)'} />
                <div>
                  <div>Non-Family Standalone</div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 400, opacity: 0.8 }}>Family data completely hidden</span>
                </div>
              </button>
            </div>
          </div>

          {/* Full Name & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mark Vance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="mark@private.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Role & Relationship (if family member) */}
          {formData.memberType === 'family' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Family Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="select-field"
                >
                  <option value="family_member">Standard Family Member</option>
                  <option value="family_admin">Family Administrator (Full Rights)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Family Relationship / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Parent, College Student, Child"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* Security PIN */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              4-Digit Security PIN Code *
            </label>
            <input
              type="text"
              maxLength={4}
              required
              placeholder="1234"
              value={formData.pin}
              onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
              className="input-field"
              style={{ letterSpacing: '4px', fontWeight: 700, width: '120px' }}
            />
          </div>

          {/* Color Badge Theme */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Profile Avatar Color
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {AVATAR_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setFormData({ ...formData, avatarColor: c })}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: c,
                    border: formData.avatarColor === c ? '3px solid #fff' : 'none',
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
              <span>{initialData ? 'Save User Profile' : 'Add User Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
