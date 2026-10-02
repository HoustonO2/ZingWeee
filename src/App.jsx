import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SecurityLockModal } from './components/SecurityLockModal';
import { TransactionModal } from './components/TransactionModal';
import { AccountModal } from './components/AccountModal';
import { CategoryModal } from './components/CategoryModal';
import { UserModal } from './components/UserModal';

import { FamilyDashboard } from './pages/FamilyDashboard';
import { MemberDashboard } from './pages/MemberDashboard';
import { AccountsPage } from './pages/AccountsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent = () => {
  const { activeTab } = useApp();

  // Modal States
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const [accModalOpen, setAccModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState(null);

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  const [usrModalOpen, setUsrModalOpen] = useState(false);
  const [editingUsr, setEditingUsr] = useState(null);

  // Modal open handlers
  const handleOpenTx = (tx = null) => {
    setEditingTx(tx);
    setTxModalOpen(true);
  };

  const handleOpenAcc = (acc = null) => {
    setEditingAcc(acc);
    setAccModalOpen(true);
  };

  const handleOpenCat = (cat = null) => {
    setEditingCat(cat);
    setCatModalOpen(true);
  };

  const handleOpenUsr = (usr = null) => {
    setEditingUsr(usr);
    setUsrModalOpen(true);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'family_dashboard':
        return <FamilyDashboard onOpenTransactionModal={() => handleOpenTx()} />;
      case 'member_dashboard':
        return (
          <MemberDashboard
            onOpenTransactionModal={() => handleOpenTx()}
            onOpenAccountModal={() => handleOpenAcc()}
          />
        );
      case 'accounts':
        return (
          <AccountsPage
            onOpenAccountModal={() => handleOpenAcc()}
            onEditAccount={(acc) => handleOpenAcc(acc)}
          />
        );
      case 'categories':
        return (
          <CategoriesPage
            onOpenCategoryModal={() => handleOpenCat()}
            onEditCategory={(cat) => handleOpenCat(cat)}
          />
        );
      case 'transactions':
        return (
          <TransactionsPage
            onOpenTransactionModal={() => handleOpenTx()}
            onEditTransaction={(tx) => handleOpenTx(tx)}
          />
        );
      case 'analytics':
        return <AnalyticsPage />;
      case 'users':
        return (
          <UsersPage
            onOpenUserModal={() => handleOpenUsr()}
            onEditUser={(usr) => handleOpenUsr(usr)}
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return <FamilyDashboard onOpenTransactionModal={() => handleOpenTx()} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        <Header
          onOpenTransactionModal={() => handleOpenTx()}
          onOpenAccountModal={() => handleOpenAcc()}
        />

        <div style={{ flex: 1 }}>{renderActiveTab()}</div>
      </main>

      {/* Security PIN Lock Overlay */}
      <SecurityLockModal />

      {/* CRUD Modals */}
      <TransactionModal
        isOpen={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        initialData={editingTx}
      />

      <AccountModal
        isOpen={accModalOpen}
        onClose={() => setAccModalOpen(false)}
        initialData={editingAcc}
      />

      <CategoryModal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        initialData={editingCat}
      />

      <UserModal
        isOpen={usrModalOpen}
        onClose={() => setUsrModalOpen(false)}
        initialData={editingUsr}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
