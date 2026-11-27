import { useMemo, useState } from 'react';
import { Wallet, ArrowDown, ArrowUp, Target, BarChart3, Eye, EyeOff, ArrowLeftRight, DollarSign } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getSession } from '../../services/auth.js';
import { formatMoney, useFinanceData } from '../../context/FinanceDataContext.jsx';
import { calculateSummary, getPeriodKey } from '../../utils/financeCalculations.js';
import StatCard from '../../components/StatCard/StatCard.jsx';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import MovementRow from '../../components/MovementRow/MovementRow.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import DonutChart from '../../components/DonutChart/DonutChart.jsx';
import VeraCard from '../../components/VeraCard/VeraCard.jsx';
import MobileBottomNav from '../../components/MobileBottomNav/MobileBottomNav.jsx';
import './Dashboard.css';
import { getCategoryColor } from '../../utils/categoryColors.js';

const periods = ['Noviembre de 2026','Octubre de 2026','Septiembre de 2026','Agosto de 2026','Julio de 2026','Junio de 2026','Mayo de 2026','Abril de 2026','Marzo de 2026','Febrero de 2026','Enero de 2026'];

const PERIOD_KEY_BY_LABEL = Object.fromEntries([
  ['Enero de 2026', '2026-01'], ['Febrero de 2026', '2026-02'], ['Marzo de 2026', '2026-03'],
  ['Abril de 2026', '2026-04'], ['Mayo de 2026', '2026-05'], ['Junio de 2026', '2026-06'],
  ['Julio de 2026', '2026-07'], ['Agosto de 2026', '2026-08'], ['Septiembre de 2026', '2026-09'],
  ['Octubre de 2026', '2026-10'], ['Noviembre de 2026', '2026-11'],
]);

function getPeriodKeyFromLabel(label) {
  return PERIOD_KEY_BY_LABEL[label] || null;
}

export default function Dashboard() {
  const user = getSession()?.user;
  const displayName = user?.nombre || 'Usuario';
  const { data } = useFinanceData();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const monthLabel = useMemo(() => new Intl.DateTimeFormat('es-CR', { month: 'long', year: 'numeric' }).format(new Date()), []);
  const formattedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPeriod = searchParams.get('period') || formattedMonth;
  const periodKey = useMemo(() => getPeriodKeyFromLabel(selectedPeriod) || getPeriodKey(new Date()), [selectedPeriod]);

  function handlePeriodChange(value) {
    const next = new URLSearchParams(searchParams);
    next.set('period', value);
    setSearchParams(next);
  }
  const summary = useMemo(() => calculateSummary(data, periodKey), [data, periodKey]);

  const categoryRows = useMemo(() => {
    const entries = Object.entries(summary.spentByCategory).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, [, value]) => sum + value, 0) || 1;
    return entries.slice(0, 6).map(([name, value]) => ({ name, value, percent: Math.round((value / total) * 100), color: getCategoryColor(name).color }));
  }, [summary.spentByCategory]);

  const donutSegments = categoryRows.length
    ? categoryRows.reduce((parts, item, index) => {
      const start = parts.length ? parts[parts.length - 1].end : 0;
      const end = start + (item.value / summary.expenses) * 100;
      parts.push({ ...item, start, end, segment: `${item.color} ${start}% ${end}%` });
      return parts;
    }, []).map((item) => item.segment)
    : ['#E4EDE1 0% 100%'];

  const budgetTotal = summary.budget;
  const budgetSpent = summary.expenses;
  const budgetPercent = budgetTotal ? Math.min(100, Math.round((budgetSpent / budgetTotal) * 100)) : 0;
  const recent = [...(summary.periodConfirmed || [])].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <div className="dashboard">
      <div className="welcome">
        <div><h1>¡Hola, {displayName}! 👋</h1><p>Aquí está el resumen de tus finanzas.</p></div>
        <div className="month-filter-wrap">
          <CustomSelect
            ariaLabel="Periodo del resumen"
            value={selectedPeriod}
            onChange={handlePeriodChange}
            options={periods}
          />
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Saldo en colones" value={balanceVisible ? formatMoney(summary.tengo, summary.baseCurrency) : '••••••'} icon={Wallet} tone="mint" action={<button className="stat-eye" type="button" onClick={() => setBalanceVisible((value) => !value)} aria-label={balanceVisible ? 'Ocultar balance' : 'Mostrar balance'}>{balanceVisible ? <Eye size={15} /> : <EyeOff size={15} />}</button>} />
        <StatCard
          label="Saldo en dólares"
          value={balanceVisible ? formatMoney(summary.balancesByCurrency?.USD || 0, 'USD') : '••••••'}
          icon={DollarSign}
          tone="cream"
          action={<Link className="dashboard-usd-link" to="/cuentas">Ver cuentas</Link>}
        />
        <StatCard label="Ingresos confirmados" value={formatMoney(summary.income, summary.baseCurrency)} icon={ArrowUp} tone="lilac" />
        <StatCard label="Gastos confirmados" value={formatMoney(summary.expenses, summary.baseCurrency)} change={summary.plannedExpenses ? `${formatMoney(summary.plannedExpenses, summary.baseCurrency)} planificados` : undefined} changeBubble={false} icon={ArrowDown} tone="green" />
      </div>

      <div className="dashboard-grid">
        <div className="main-col">
          <div className="top-panels">
            <SectionCard title={<><BarChart3 className="summary-title-icon" size={16} strokeWidth={2.4} />Resumen del mes</>} action={<span className="dashboard-period-label">Confirmados</span>} className="summary-card">
              <div className="summary">
                <DonutChart segments={donutSegments} />
                <div className="legend">
                  {categoryRows.map((item) => <Legend key={item.name} color={item.color} name={item.name} value={formatMoney(item.value, summary.baseCurrency)} percent={`${item.percent}%`} />)}
                  {!categoryRows.length && <div className="empty-summary">Todavía no hay gastos confirmados en este periodo.</div>}
                </div>
              </div>
            </SectionCard>

            <SectionCard title={<><Target className="budget-title-icon" size={18} strokeWidth={2.2} />Presupuesto mensual</>} className="budget-card">
              <div className="budget-total"><strong>{formatMoney(budgetTotal, summary.baseCurrency)}</strong><span>Presupuesto total</span></div>
              <ProgressBar value={budgetPercent} />
              <div className="budget-note"><span>{formatMoney(budgetSpent, summary.baseCurrency)} gastado</span><span>{formatMoney(Math.max(0, budgetTotal - budgetSpent), summary.baseCurrency)} disponible</span></div>
              <Link className="budget-detail-btn" to="/presupuestos">Ver detalle <span>→</span></Link>
            </SectionCard>
          </div>

          <div className="bottom-panels">
            <SectionCard title={<><ArrowLeftRight className="movements-title-icon" size={20} strokeWidth={2.4} />Últimos movimientos</>} action={<Link className="small-link" to="/movimientos">Ver todos →</Link>} className="movements-card">
              {recent.map((item) => <MovementRow key={item.id} compact name={item.name} category={item.category || 'Movimiento'} date={new Date(`${item.date}T12:00:00`).toLocaleDateString('es-CR',{day:'numeric',month:'short'}).replace('.','')} amount={formatMoney(item.amount,item.currency)} type={item.type === 'income' ? 'income' : 'expense'} />)}
              {!recent.length && <div className="empty-summary">No hay movimientos confirmados en este periodo.</div>}
            </SectionCard>

            <SectionCard title={<><Target className="goals-title-icon" size={20} strokeWidth={2.3} />Metas</>} action={<Link className="small-link" to="/metas">Ver todas →</Link>} className="goals-dashboard-card">
              <div className="goals-dashboard-list">
                {(data.goals || []).map((goal) => {
                  const progress = goal.target ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0;
                  return (
                    <Link className="goal-dashboard-item" to="/metas" key={goal.id}>
                      <div className={`goal-dashboard-icon ${progress >= 50 ? 'goal-dashboard-icon-green' : 'goal-dashboard-icon-purple'}`}><Target size={16} /></div>
                      <div className="goal-dashboard-main">
                        <div className="goal-dashboard-heading"><strong>{goal.title}</strong><span>{progress}%</span></div>
                        <div className="goal-dashboard-track"><div className="goal-dashboard-fill" style={{ width: `${progress}%` }} /></div>
                        <small>{formatMoney(goal.saved, goal.currency || summary.baseCurrency)} de {formatMoney(goal.target, goal.currency || summary.baseCurrency)}</small>
                      </div>
                    </Link>
                  );
                })}
                {!(data.goals || []).length && <div className="empty-summary">Todavía no tienes metas creadas.</div>}
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="side-col"><VeraCard /></div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

function Legend({ color, name, value, percent }) { return <div className="legend-row"><i style={{ background: color }} /><span>{name}</span><b>{percent}</b><strong>{value}</strong></div>; }
