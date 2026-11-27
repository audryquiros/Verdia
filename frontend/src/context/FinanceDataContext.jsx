import { createContext, useContext, useMemo, useState } from 'react';
import { calculateAccountBalance, calculateSummary } from '../utils/financeCalculations.js';

const STORAGE_KEY = 'verdia.frontend.finance.v2';

const initialData = {
  settings: { baseCurrency: 'CRC' },
  accounts: [
    { id: 'a1', name: 'BAC Principal', type: 'bank', currency: 'CRC', initialBalance: 425000, archived: false },
    { id: 'a2', name: 'Efectivo', type: 'cash', currency: 'CRC', initialBalance: 0, archived: false },
  ],
  movements: [
    { id: 'm1', date: '2026-11-09', name: 'Walmart', category: 'Alimentación', type: 'card_expense', amount: 15500, currency: 'CRC', status: 'confirmed', cardId: 'c1' },
    { id: 'm2', date: '2026-11-09', name: 'ICE', category: 'Servicios', type: 'expense', amount: 28350, currency: 'CRC', status: 'confirmed', originAccountId: 'a1' },
    { id: 'm3', date: '2026-11-03', name: 'Salario', category: 'Salario', type: 'income', amount: 620000, currency: 'CRC', status: 'confirmed', destinationAccountId: 'a1' },
    { id: 'm4', date: '2026-11-02', name: 'Uber', category: 'Transporte', type: 'expense', amount: 6200, currency: 'CRC', status: 'confirmed', originAccountId: 'a1' },
  ],
  budgets: [
    { id: 'b1', name: 'Alimentación', spent: 0, limit: 100000, currency: 'CRC' },
    { id: 'b2', name: 'Transporte', spent: 0, limit: 60000, currency: 'CRC' },
    { id: 'b3', name: 'Entretenimiento', spent: 0, limit: 40000, currency: 'CRC' },
  ],
  goals: [
    { id: 'g1', title: 'Viaje a la playa', category: 'Viajes', target: 600000, saved: 360000, currency: 'CRC' },
    { id: 'g2', title: 'Laptop', category: 'Tecnología', target: 600000, saved: 250000, currency: 'CRC' },
  ],
  debts: [
    { id: 'd1', title: 'Préstamo personal', category: 'Préstamos', total: 850000, remaining: 493000, detail: 'Faltan 6 meses', direction: 'owed', currency: 'CRC' },
    { id: 'd2', title: 'Dinero prestado', category: 'Préstamos', total: 200000, remaining: 120000, detail: 'Pendiente de cobro', direction: 'receivable', currency: 'CRC' },
  ],
  cards: [
    { id: 'c1', marca: 'VISA', tipo: 'Crédito', ultimosCuatro: '1234', balanceOwed: 120000, limit: 500000, pagoMinimo: 12000, fechaCorte: '25 nov', fechaVencimiento: '05 dic', currency: 'CRC' },
  ],
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('verdia.frontend.finance.v1');
    if (!raw) return initialData;
    const saved = JSON.parse(raw);
    const legacyMovements = (saved.movements || []).map((movement) => ({
      ...movement,
      type: movement.type === 'expense' ? 'expense' : movement.type,
      originAccountId: movement.type === 'expense' ? 'a1' : movement.originAccountId,
      destinationAccountId: movement.type === 'income' ? 'a1' : movement.destinationAccountId,
    }));
    return { ...initialData, ...saved, settings: { ...initialData.settings, ...(saved.settings || {}) }, accounts: saved.accounts || initialData.accounts, movements: legacyMovements.length ? legacyMovements : initialData.movements, goals: (saved.goals || initialData.goals).map((goal) => ({ ...goal, category: goal.category || 'Otros' })), debts: (saved.debts || initialData.debts).map((debt) => ({ ...debt, category: debt.category || 'Otros' })) };
  } catch {
    return initialData;
  }
}

function usePersistedState() {
  const [data, setData] = useState(loadData);
  const update = (next) => {
    setData((current) => {
      const value = typeof next === 'function' ? next(current) : next;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      return value;
    });
  };
  return [data, update];
}

const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const today = () => new Date().toISOString().slice(0, 10);
const FinanceDataContext = createContext(null);

export function FinanceDataProvider({ children }) {
  const [data, setData] = usePersistedState();
  const api = useMemo(() => ({
    data,
    summary: calculateSummary(data),
    getAccountBalance: (accountId) => {
      const account = (data.accounts || []).find((item) => item.id === accountId);
      return account ? calculateAccountBalance(account, data.movements || []) : 0;
    },
    addAccount: (account) => setData((current) => ({ ...current, accounts: [...(current.accounts || []), { ...account, id: uid('a'), archived: false }] })),
    updateAccount: (id, account) => setData((current) => ({ ...current, accounts: current.accounts.map((item) => item.id === id ? { ...item, ...account } : item) })),
    archiveAccount: (id) => setData((current) => {
      const account = current.accounts.find((item) => item.id === id);
      if (!account || Math.abs(calculateAccountBalance(account, current.movements || [])) > 0.000001) return current;
      return { ...current, accounts: current.accounts.map((item) => item.id === id ? { ...item, archived: true } : item) };
    }),
    addMovement: (movement) => setData((current) => ({ ...current, movements: [{ ...movement, id: movement.id || uid('m'), history: movement.history || [] }, ...(current.movements || [])] })),
    updateMovement: (id, movement) => setData((current) => ({ ...current, movements: current.movements.map((item) => item.id === id ? { ...item, ...movement, history: [...(item.history || []), { changedAt: today(), snapshot: item }] } : item) })),
    confirmMovement: (id, changes = {}) => setData((current) => ({ ...current, movements: current.movements.map((item) => item.id === id && item.status === 'planned' ? { ...item, ...changes, status: 'confirmed', date: changes.date || today(), history: [...(item.history || []), { changedAt: today(), action: 'confirmed', snapshot: item }] } : item) })),
    cancelMovement: (id) => setData((current) => ({ ...current, movements: current.movements.map((item) => item.id === id ? { ...item, status: item.status === 'confirmed' ? 'voided' : 'canceled', history: [...(item.history || []), { changedAt: today(), action: item.status === 'confirmed' ? 'voided' : 'canceled', snapshot: item }] } : item) })),
    removeMovement: (id) => setData((current) => ({ ...current, movements: current.movements.map((item) => item.id === id ? { ...item, status: item.status === 'confirmed' ? 'voided' : 'canceled', history: [...(item.history || []), { changedAt: today(), action: item.status === 'confirmed' ? 'voided' : 'canceled', snapshot: item }] } : item) })),
    addBudget: (budget) => setData((current) => ({ ...current, budgets: [...current.budgets, { ...budget, id: uid('b') }] })),
    updateBudget: (id, budget) => setData((current) => ({ ...current, budgets: current.budgets.map((item) => item.id === id ? { ...item, ...budget } : item) })),
    removeBudget: (id) => setData((current) => ({ ...current, budgets: current.budgets.filter((item) => item.id !== id) })),
    addGoal: (goal) => setData((current) => ({ ...current, goals: [...current.goals, { ...goal, id: uid('g') }] })),
    updateGoal: (id, goal) => setData((current) => ({ ...current, goals: current.goals.map((item) => item.id === id ? { ...item, ...goal } : item) })),
    removeGoal: (id) => setData((current) => ({ ...current, goals: current.goals.filter((item) => item.id !== id) })),
    addDebt: (debt) => setData((current) => ({ ...current, debts: [...current.debts, { ...debt, id: uid('d') }] })),
    updateDebt: (id, debt) => setData((current) => ({ ...current, debts: current.debts.map((item) => item.id === id ? { ...item, ...debt } : item) })),
    removeDebt: (id) => setData((current) => ({ ...current, debts: current.debts.filter((item) => item.id !== id) })),
    addCard: (card) => setData((current) => ({ ...current, cards: [...current.cards, { ...card, id: uid('c') }] })),
    updateCard: (id, card) => setData((current) => ({ ...current, cards: current.cards.map((item) => item.id === id ? { ...item, ...card } : item) })),
    removeCard: (id) => setData((current) => ({ ...current, cards: current.cards.filter((item) => item.id !== id) })),
  }), [data, setData]);
  return <FinanceDataContext.Provider value={api}>{children}</FinanceDataContext.Provider>;
}

export function useFinanceData() {
  const value = useContext(FinanceDataContext);
  if (!value) throw new Error('useFinanceData debe utilizarse dentro de FinanceDataProvider');
  return value;
}

export const formatMoney = (value, currency = 'CRC') => {
  const locale = currency === 'USD' ? 'en-US' : 'es-CR';
  const symbol = currency === 'USD' ? '$' : '₡';
  return `${symbol}${Number(value || 0).toLocaleString(locale, { maximumFractionDigits: 2 })}`;
};
