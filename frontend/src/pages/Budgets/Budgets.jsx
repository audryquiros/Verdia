import { useState } from 'react';
import { Car, Gamepad2, LayoutGrid, List, Plus, Utensils } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import '../SimplePage.css';
import './Budgets.css';

const budgets = [
  {
    name: 'Alimentación',
    spent: '₡67.300',
    limit: '₡100.000',
    value: 67,
    Icon: Utensils,
    tone: 'green',
  },
  {
    name: 'Transporte',
    spent: '₡33.000',
    limit: '₡60.000',
    value: 55,
    Icon: Car,
    tone: 'purple',
  },
  {
    name: 'Entretenimiento',
    spent: '₡22.000',
    limit: '₡40.000',
    value: 55,
    Icon: Gamepad2,
    tone: 'coral',
  },
];

function BudgetIcon({ Icon, tone }) {
  return (
    <div className={`budget-icon budget-icon-${tone}`} aria-hidden="true">
      <Icon size={19} strokeWidth={2} />
    </div>
  );
}

function BudgetList({ items }) {
  return (
    <div className="budget-list card">
      {items.map(({ name, spent, limit, value, Icon, tone }) => (
        <article className="budget-list-item" key={name}>
          <BudgetIcon Icon={Icon} tone={tone} />

          <div className="budget-list-content">
            <div className="budget-list-title-row">
              <h2>{name}</h2>
              <strong>{value}%</strong>
            </div>

            <div className="budget-list-values">
              <span>{spent} de {limit}</span>
            </div>

            <ProgressBar value={value} />
          </div>
        </article>
      ))}
    </div>
  );
}

function BudgetCards({ items }) {
  return (
    <div className="budget-grid">
      {items.map(({ name, spent, limit, value, Icon, tone }) => (
        <section className={`budget-card card budget-card-${tone}`} key={name}>
          <div className="budget-card-top">
            <BudgetIcon Icon={Icon} tone={tone} />

            <div className="budget-card-title">
              <h2>{name}</h2>

              <div className="budget-line">
                <span>{spent} de {limit}</span>
                <strong>{value}%</strong>
              </div>
            </div>
          </div>

          <ProgressBar value={value} />
        </section>
      ))}
    </div>
  );
}

export default function Budgets() {
  const [view, setView] = useState('list');

  return (
    <div className="simple-page budgets-page">
      <PageHeader
        action={
          <div className="budgets-page-actions">
            <div className="budget-view-toggle" role="group" aria-label="Vista de presupuestos">
              <button
                type="button"
                className={view === 'list' ? 'active' : ''}
                onClick={() => setView('list')}
                aria-label="Vista de lista"
                aria-pressed={view === 'list'}
              >
                <List size={17} />
              </button>
              <button
                type="button"
                className={view === 'cards' ? 'active' : ''}
                onClick={() => setView('cards')}
                aria-label="Vista de tarjetas"
                aria-pressed={view === 'cards'}
              >
                <LayoutGrid size={17} />
              </button>
            </div>

            <button className="btn btn-primary">
              <Plus size={16} />
              Nuevo presupuesto
            </button>
          </div>
        }
      />

      {view === 'list' ? <BudgetList items={budgets} /> : <BudgetCards items={budgets} />}
    </div>
  );
}
