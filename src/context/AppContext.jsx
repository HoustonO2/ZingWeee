import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_ACCOUNTS,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
} from '../constants/initialData';

const AppContext = createContext();

const STORAGE_KEYS = {
  USERS: 'pf_tracker_users_v1',
  ACCOUNTS: 'pf_tracker_accounts_v1',
  CATEGORIES: 'pf_tracker_categories_v1',
  TRANSACTIONS: 'pf_tracker_transactions_v1',
  ACTIVE_USER: 'pf_tracker_active_user_v1',
};

export const AppProvider = ({ children }) => {
  // 1. Initial State Initialization from LocalStorage or Defaults
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [activeUserId, setActiveUserId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    return saved || 'usr_1';
  });

  const [selectedMemberId, setSelectedMemberId] = useState('usr_1');
  const [activeTab, setActiveTab] = useState('family_dashboard');
  const [isPinLocked, setIsPinLocked] = useState(false);
  const [lockPinInput, setLockPinInput] = useState('');
  const [lockError, setLockError] = useState('');

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, activeUserId);
  }, [activeUserId]);

  // Derived Security & Scope States
  const activeUser = users.find((u) => u.id === activeUserId) || users[0];
  const isNonFamilyUser = activeUser?.memberType === 'non_family';

  const familyUsers = users.filter((u) => u.memberType === 'family');
  
  // Strict Scope Isolation
  const visibleUsers = isNonFamilyUser
    ? [activeUser]
    : familyUsers;

  const visibleUserIds = new Set(visibleUsers.map((u) => u.id));

  const visibleAccounts = accounts.filter((acc) => visibleUserIds.has(acc.userId));
  const visibleTransactions = transactions.filter((tx) => visibleUserIds.has(tx.userId));

  // Auto-switch tabs if Non-Family user is active and on Family Dashboard
  useEffect(() => {
    if (isNonFamilyUser) {
      if (activeTab === 'family_dashboard') {
        setActiveTab('member_dashboard');
      }
      setSelectedMemberId(activeUser.id);
    } else {
      if (!familyUsers.some((u) => u.id === selectedMemberId)) {
        setSelectedMemberId(familyUsers[0]?.id || activeUser.id);
      }
    }
  }, [activeUserId, isNonFamilyUser, activeTab]);

  // Switch Active User with PIN Security prompt option
  const switchUser = (userId, requirePin = true) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    if (requirePin && target.pin) {
      setIsPinLocked(true);
      setLockPinInput('');
      setLockError('');
      // Store pending user switch
      setActiveUserId(userId);
    } else {
      setActiveUserId(userId);
    }
  };

  const handleUnlock = (enteredPin) => {
    if (enteredPin === activeUser.pin) {
      setIsPinLocked(false);
      setLockError('');
      setLockPinInput('');
    } else {
      setLockError('Incorrect Security PIN. Please try again.');
    }
  };

  // Extensible CRUD Handlers

  // 1. Transactions CRUD
  const addTransaction = (newTx) => {
    const created = {
      ...newTx,
      id: `tx_${Date.now()}`,
      date: newTx.date || new Date().toISOString().split('T')[0],
      tags: newTx.tags || [],
    };

    setTransactions((prev) => [created, ...prev]);

    // Update account balance
    setAccounts((prevAccs) =>
      prevAccs.map((acc) => {
        if (acc.id === created.accountId) {
          const delta = created.type === 'income' ? Number(created.amount) : -Number(created.amount);
          return { ...acc, balance: acc.balance + delta };
        }
        return acc;
      })
    );
  };

  const editTransaction = (id, updatedFields) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updatedFields } : tx))
    );
  };

  const deleteTransaction = (id) => {
    const target = transactions.find((t) => t.id === id);
    if (target) {
      // Revert balance
      setAccounts((prevAccs) =>
        prevAccs.map((acc) => {
          if (acc.id === target.accountId) {
            const revertDelta = target.type === 'income' ? -Number(target.amount) : Number(target.amount);
            return { ...acc, balance: acc.balance + revertDelta };
          }
          return acc;
        })
      );
    }
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  // 2. Accounts CRUD (Extensible)
  const addAccount = (newAcc) => {
    const created = {
      ...newAcc,
      id: `acc_${Date.now()}`,
      balance: Number(newAcc.balance || 0),
      currency: 'USD',
      accountNumberMask: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setAccounts((prev) => [...prev, created]);
  };

  const editAccount = (id, updatedFields) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? { ...acc, ...updatedFields, balance: Number(updatedFields.balance ?? acc.balance) }
          : acc
      )
    );
  };

  const deleteAccount = (id) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    setTransactions((prev) => prev.filter((tx) => tx.accountId !== id));
  };

  // 3. Categories CRUD (Extensible)
  const addCategory = (newCat) => {
    const created = {
      ...newCat,
      id: `cat_${Date.now()}`,
      isSystem: false,
      budgetLimit: newCat.budgetLimit ? Number(newCat.budgetLimit) : undefined,
    };
    setCategories((prev) => [...prev, created]);
  };

  const editCategory = (id, updatedFields) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updatedFields } : cat))
    );
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  // 4. Users CRUD
  const addUser = (newUser) => {
    const created = {
      ...newUser,
      id: `usr_${Date.now()}`,
      avatarInitials: newUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
    };
    setUsers((prev) => [...prev, created]);
  };

  const editUser = (id, updatedFields) => {
    setUsers((prev) =>
      prev.map((usr) => (usr.id === id ? { ...usr, ...updatedFields } : usr))
    );
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((usr) => usr.id !== id));
    setAccounts((prev) => prev.filter((acc) => acc.userId !== id));
    setTransactions((prev) => prev.filter((tx) => tx.userId !== id));
  };

  // Reset to seed defaults
  const resetDataToDemo = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setAccounts(INITIAL_ACCOUNTS);
    setCategories(INITIAL_CATEGORIES);
    setTransactions(INITIAL_TRANSACTIONS);
    setActiveUserId('usr_1');
    setSelectedMemberId('usr_1');
    setActiveTab('family_dashboard');
    setIsPinLocked(false);
  };

  // Backup & Import
  const exportData = () => {
    const payload = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      users,
      accounts,
      categories,
      transactions,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `family_financial_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (importedData) => {
    if (importedData.users) setUsers(importedData.users);
    if (importedData.accounts) setAccounts(importedData.accounts);
    if (importedData.categories) setCategories(importedData.categories);
    if (importedData.transactions) setTransactions(importedData.transactions);
  };

  return (
    <AppContext.Provider
      value={{
        users,
        accounts,
        categories,
        transactions,
        activeUserId,
        activeUser,
        isNonFamilyUser,
        familyUsers,
        visibleUsers,
        visibleAccounts,
        visibleTransactions,
        selectedMemberId,
        setSelectedMemberId,
        activeTab,
        setActiveTab,
        isPinLocked,
        setIsPinLocked,
        handleUnlock,
        lockError,
        switchUser,
        addTransaction,
        editTransaction,
        deleteTransaction,
        addAccount,
        editAccount,
        deleteAccount,
        addCategory,
        editCategory,
        deleteCategory,
        addUser,
        editUser,
        deleteUser,
        resetDataToDemo,
        exportData,
        importData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
