const money = (value) => Number(value || 0);

export function getPeriodKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(`${date}T12:00:00`);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function getCurrentPeriodKey() {
  return getPeriodKey(new Date());
}

export function movementAffectsAccount(movement, accountId) {
  if (movement.status !== 'confirmed') return 0;
  const amount = money(movement.amount);
  if (movement.type === 'income') return movement.destinationAccountId === accountId ? amount : 0;
  if (movement.type === 'expense') return movement.originAccountId === accountId ? -amount : 0;
  if (movement.type === 'card_expense') return 0;
  if (movement.type === 'transfer') {
    if (movement.originAccountId === accountId) return -amount;
    if (movement.destinationAccountId === accountId) return amount;
    return 0;
  }
  if (movement.type === 'debt_received') return movement.destinationAccountId === accountId ? amount : 0;
  if (movement.type === 'debt_given') return movement.originAccountId === accountId ? -amount : 0;
  if (movement.type === 'debt_collection') return movement.destinationAccountId === accountId ? amount : 0;
  if (movement.type === 'debt_payment') return movement.originAccountId === accountId ? -amount : 0;
  if (movement.type === 'adjustment') {
    if (movement.destinationAccountId === accountId) return amount;
    if (movement.originAccountId === accountId) return -amount;
  }
  return 0;
}

export function calculateAccountBalance(account, movements) {
  return money(account.initialBalance) + movements.reduce((total, movement) => total + movementAffectsAccount(movement, account.id), 0);
}

export function calculateSummary(data, periodKey = getCurrentPeriodKey()) {
  const baseCurrency = data.settings?.baseCurrency || 'CRC';
  const activeAccounts = (data.accounts || []).filter((account) => !account.archived);
  const movements = data.movements || [];
  const confirmed = movements.filter((movement) => movement.status === 'confirmed');
  const periodConfirmed = confirmed.filter((movement) => getPeriodKey(movement.date) === periodKey);
  const periodPlanned = movements.filter((movement) => movement.status === 'planned' && getPeriodKey(movement.date) === periodKey);
  const currencyMismatch = activeAccounts.some((account) => account.currency !== baseCurrency);
  const accounts = activeAccounts.map((account) => ({ ...account, balance: calculateAccountBalance(account, movements) }));
  const balancesByCurrency = accounts.reduce((result, account) => {
    result[account.currency] = (result[account.currency] || 0) + account.balance;
    return result;
  }, {});
  const tengo = balancesByCurrency[baseCurrency] || 0;
  const income = periodConfirmed.filter((movement) => movement.type === 'income' && movement.currency === baseCurrency).reduce((total, movement) => total + money(movement.amount), 0);
  const expenses = periodConfirmed.filter((movement) => ['expense', 'card_expense', 'debt_payment'].includes(movement.type) && movement.currency === baseCurrency).reduce((total, movement) => total + money(movement.amount), 0);
  const plannedExpenses = periodPlanned.filter((movement) => ['expense', 'card_expense', 'debt_payment'].includes(movement.type) && movement.currency === baseCurrency).reduce((total, movement) => total + money(movement.amount), 0);
  const cardReserved = (data.cards || []).filter((card) => card.currency === baseCurrency).reduce((total, card) => total + money(card.balanceOwed ?? card.saldoPendiente), 0);
  const goalsReserved = (data.goals || []).filter((goal) => goal.currency === baseCurrency).reduce((total, goal) => total + money(goal.saved), 0);
  const debtsReserved = (data.debts || []).filter((debt) => debt.currency === baseCurrency && debt.direction === 'owed').reduce((total, debt) => total + money(debt.remaining), 0);
  const apartado = cardReserved + goalsReserved + plannedExpenses + debtsReserved;
  const libre = tengo - apartado;
  const budget = (data.budgets || []).filter((item) => item.currency === baseCurrency).reduce((total, item) => total + money(item.limit), 0);
  const spentByCategory = {};
  periodConfirmed.filter((movement) => ['expense', 'card_expense'].includes(movement.type) && movement.currency === baseCurrency).forEach((movement) => {
    spentByCategory[movement.category] = (spentByCategory[movement.category] || 0) + money(movement.amount);
  });
  return { baseCurrency, periodKey, accounts, balancesByCurrency, tengo, apartado, libre, income, expenses, plannedExpenses, budget, spentByCategory, periodConfirmed, periodPlanned, currencyMismatch };
}
