import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Download, Upload, RotateCcw, ShieldCheck, Lock, Database } from 'lucide-react';

export const SettingsPage = () => {
  const { exportData, importData, resetDataToDemo } = useApp();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          importData(parsed);
          alert('Financial Vault dataset imported successfully!');
        } catch (err) {
          alert('Invalid JSON backup file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
          Vault Security & Data Backup Controls
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-subtle)', marginBottom: '24px' }}>
          Manage client-side encrypted local backups, export JSON snapshots, or reset to original seed dataset.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Export Card */}
          <div style={{ padding: '20px', borderRadius: 'var(--radius-sm)', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6366f1', marginBottom: '10px' }}>
                <Download size={22} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Export Backup File</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Download an encrypted JSON file containing all family members, bank accounts, categories, and transactions.
              </p>
            </div>
            <button onClick={exportData} className="btn-primary" style={{ marginTop: '16px', padding: '9px 16px', justifyContent: 'center' }}>
              <Download size={16} />
              <span>Export Vault JSON</span>
            </button>
          </div>

          {/* Import Card */}
          <div style={{ padding: '20px', borderRadius: 'var(--radius-sm)', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-cyan)', marginBottom: '10px' }}>
                <Upload size={22} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Restore / Import Data</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Upload a previously saved `.json` financial tracker backup file to restore full state.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary"
              style={{ marginTop: '16px', padding: '9px 16px', justifyContent: 'center' }}
            >
              <Upload size={16} />
              <span>Select File to Restore</span>
            </button>
          </div>

          {/* Reset Card */}
          <div style={{ padding: '20px', borderRadius: 'var(--radius-sm)', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--expense-rose)', marginBottom: '10px' }}>
                <RotateCcw size={22} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Reset Demo State</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Re-initialize storage back to default demo dataset with 3 family members and 1 non-family isolated profile.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Reset all financial tracker data to demo defaults?')) {
                  resetDataToDemo();
                }
              }}
              className="btn-danger"
              style={{ marginTop: '16px', padding: '9px 16px', justifyContent: 'center' }}
            >
              <RotateCcw size={16} />
              <span>Reset to Demo Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
