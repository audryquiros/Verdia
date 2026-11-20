import { Op } from 'sequelize';

function toNumber(value) {
  return Number.parseFloat(value || 0);
}

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function movementCashImpact(movement) {
  const amount = toNumber(movement.monto_base ?? movement.monto);
  if (movement.tipo === 'TRANSFERENCIA') return 0;
  if (movement.tipo === 'GASTO' && movement.tarjeta_id) return 0;
  if (movement.tipo === 'INGRESO' || movement.tipo === 'PRESTAMO_RECIBIDO' || movement.tipo === 'COBRO_DEUDA') return amount;
  if (movement.tipo === 'GASTO' || movement.tipo === 'PRESTAMO_DADO' || movement.tipo === 'PAGO_DEUDA') return -amount;
  return 0;
}

export async function getDashboardSummary(userId, db, now = new Date()) {
  const space = await db.EspacioFinanciero.findOne({
    where: { usuario_id: userId, activo: true },
    order: [['id', 'ASC']],
  });

  if (!space) {
    return {
      user: null,
      month: { label: now.toLocaleDateString('es-CR', { month: 'long', year: 'numeric' }), start: null, end: null },
      balance: 0,
      income: 0,
      expenses: 0,
      goal: null,
      budget: { total: 0, spent: 0, available: 0 },
      categoryExpenses: [],
      recentMovements: [],
    };
  }

  const [user, movements, categories, budgets, goals] = await Promise.all([
    db.Usuario.findByPk(userId),
    db.Movimiento.findAll({
      where: { espacio_financiero_id: space.id, estado: 'CONFIRMADO' },
      include: [{ model: db.Categoria, attributes: ['id', 'nombre', 'tipo'] }],
      order: [['fecha', 'DESC'], ['id', 'DESC']],
    }),
    db.Categoria.findAll({ where: { espacio_financiero_id: space.id, activa: true } }),
    db.Presupuesto.findAll({ where: { espacio_financiero_id: space.id, activo: true } }),
    db.Meta.findAll({ where: { espacio_financiero_id: space.id, estado: 'ACTIVA' }, order: [['id', 'ASC']] }),
  ]);

  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const monthMovements = movements.filter((movement) => {
    const date = new Date(movement.fecha);
    return date >= monthStart && date < monthEnd;
  });

  const income = monthMovements
    .filter((movement) => ['INGRESO', 'PRESTAMO_RECIBIDO', 'COBRO_DEUDA'].includes(movement.tipo))
    .reduce((sum, movement) => sum + toNumber(movement.monto_base ?? movement.monto), 0);

  const expenses = monthMovements
    .filter((movement) => movement.tipo === 'GASTO' && !movement.tarjeta_id)
    .reduce((sum, movement) => sum + toNumber(movement.monto_base ?? movement.monto), 0)
    + monthMovements
      .filter((movement) => movement.tipo === 'GASTO' && movement.tarjeta_id)
      .reduce((sum, movement) => sum + toNumber(movement.monto_base ?? movement.monto), 0);

  const balance = toNumber(space.saldo_inicial) + movements.reduce((sum, movement) => sum + movementCashImpact(movement), 0);

  const categoryMap = new Map();
  monthMovements.filter((movement) => movement.tipo === 'GASTO').forEach((movement) => {
    const name = movement.Categoria?.nombre || 'Sin categoría';
    const current = categoryMap.get(name) || 0;
    categoryMap.set(name, current + toNumber(movement.monto_base ?? movement.monto));
  });

  const categoryExpenses = [...categoryMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value, percent: expenses ? Math.round((value / expenses) * 100) : 0 }));

  const budgetTotal = budgets
    .filter((budget) => new Date(budget.periodo_inicio) < monthEnd && new Date(budget.periodo_fin) >= monthStart)
    .reduce((sum, budget) => sum + toNumber(budget.monto_limite), 0);

  const budgetCategoryIds = new Set(budgets.map((budget) => String(budget.categoria_id)));
  const budgetSpent = monthMovements
    .filter((movement) => movement.tipo === 'GASTO' && budgetCategoryIds.has(String(movement.categoria_id)))
    .reduce((sum, movement) => sum + toNumber(movement.monto_base ?? movement.monto), 0);

  const goal = goals.length
    ? goals.reduce((best, current) => {
        const bestProgress = toNumber(best.monto_objetivo) ? toNumber(best.monto_actual) / toNumber(best.monto_objetivo) : 0;
        const currentProgress = toNumber(current.monto_objetivo) ? toNumber(current.monto_actual) / toNumber(current.monto_objetivo) : 0;
        return currentProgress > bestProgress ? current : best;
      })
    : null;

  return {
    user: user ? { id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email, foto_url: user.foto_url } : null,
    month: {
      label: now.toLocaleDateString('es-CR', { month: 'long', year: 'numeric' }),
      start: monthStart.toISOString(),
      end: monthEnd.toISOString(),
    },
    balance,
    income,
    expenses,
    goal: goal ? {
      id: goal.id,
      nombre: goal.nombre,
      montoActual: toNumber(goal.monto_actual),
      montoObjetivo: toNumber(goal.monto_objetivo),
      progress: toNumber(goal.monto_objetivo) ? Math.min(100, Math.round((toNumber(goal.monto_actual) / toNumber(goal.monto_objetivo)) * 100)) : 0,
      moneda: goal.moneda,
    } : null,
    budget: {
      total: budgetTotal,
      spent: budgetSpent,
      available: Math.max(0, budgetTotal - budgetSpent),
      progress: budgetTotal ? Math.min(100, Math.round((budgetSpent / budgetTotal) * 100)) : 0,
    },
    categoryExpenses,
    recentMovements: movements.slice(0, 5).map((movement) => ({
      id: movement.id,
      comercio: movement.comercio || movement.descripcion || 'Movimiento',
      descripcion: movement.descripcion,
      categoria: movement.Categoria?.nombre || 'Sin categoría',
      fecha: movement.fecha,
      tipo: movement.tipo,
      monto: toNumber(movement.monto_base ?? movement.monto),
      moneda: movement.moneda,
    })),
  };
}
