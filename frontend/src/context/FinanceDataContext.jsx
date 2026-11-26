import { createContext, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'verdia.frontend.finance.v1';

const initialData = {
  movements: [
    { id: 'm1', date: '2026-11-09', name: 'Walmart', category: 'Alimentación', type: 'expense', amount: 15500, currency: 'CRC', status: 'confirmed' },
    { id: 'm2', date: '2026-11-09', name: 'ICE', category: 'Servicios', type: 'expense', amount: 28350, currency: 'CRC', status: 'confirmed' },
    { id: 'm3', date: '2026-11-03', name: 'Salario', category: 'Ingreso', type: 'income', amount: 620000, currency: 'CRC', status: 'confirmed' },
    { id: 'm4', date: '2026-11-02', name: 'Uber', category: 'Transporte', type: 'expense', amount: 6200, currency: 'CRC', status: 'confirmed' },
  ],
  budgets: [
    { id: 'b1', name: 'Alimentación', spent: 67300, limit: 100000, currency: 'CRC' },
    { id: 'b2', name: 'Transporte', spent: 33000, limit: 60000, currency: 'CRC' },
    { id: 'b3', name: 'Entretenimiento', spent: 22000, limit: 40000, currency: 'CRC' },
  ],
  goals: [
    { id: 'g1', title: 'Viaje a la playa', target: 600000, saved: 360000, currency: 'CRC' },
    { id: 'g2', title: 'Laptop', target: 600000, saved: 250000, currency: 'CRC' },
  ],
  debts: [
    { id: 'd1', title: 'Préstamo personal', total: 850000, remaining: 493000, detail: 'Faltan 6 meses', direction: 'owed', currency: 'CRC' },
    { id: 'd2', title: 'Tarjeta de crédito', total: 200000, remaining: 120000, detail: 'Fecha de pago: 05 dic', direction: 'owed', currency: 'CRC' },
  ],
  cards: [
    { id: 'c1', marca: 'VISA', tipo: 'Crédito', ultimosCuatro: '1234', saldoPendiente: 120000, pagoMinimo: 12000, fechaCorte: '25 nov', fechaVencimiento: '05 dic', currency: 'CRC' },
  ],
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...initialData, ...JSON.parse(raw) } : initialData;
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

const FinanceDataContext = createContext(null);

export function FinanceDataProvider({ children }) {
  const [data, setData] = usePersistedState();

  const api = useMemo(() => ({
    data,
    addMovement: (movement) => setData((current) => ({ ...current, movements: [movement, ...current.movements.map((item) => item)] })),
    updateMovement: (id, movement) => setData((current) => ({ ...current, movements: current.movements.map((item) => item.id === id ? { ...item, ...movement } : item) })),
    removeMovement: (id) => setData((current) => ({ ...current, movements: current.movements.filter((item) => item.id !== id) })),
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
