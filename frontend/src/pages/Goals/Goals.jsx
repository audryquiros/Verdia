import { useState } from 'react';
import { Laptop, LayoutGrid, List, Plane, Plus } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import ViewSwitcher from '../../components/ViewSwitcher/ViewSwitcher.jsx';
import '../SimplePage.css';
import './Goals.css';

const goals = [
  {
    title: 'Viaje a la playa',
    amount: '₡600.000',
    saved: '₡360.000',
    value: 60,
    variant: 'green',
    icon: Plane,
  },
  {
    title: 'Laptop',
    amount: '₡600.000',
    saved: '₡250.000',
    value: 42,
    variant: 'purple',
    icon: Laptop,
  },
];

function GoalIcon({ Icon, variant }) {
  return (
    <div className={`goal-item-icon goal-item-icon-${variant}`} aria-hidden="true">
      <Icon size={22} strokeWidth={2} />
    </div>
  );
}

function GoalList({ items }) {
  return (
    <section className="goals-list-card card">
      <div className="goals-list">
        {items.map((goal) => (
          <article className={`goal-item goal-item-${goal.variant}`} key={goal.title}>
            <GoalIcon Icon={goal.icon} variant={goal.variant} />

            <div className="goal-item-main">
              <div className="goal-item-heading">
                <div>
                  <h2>{goal.title}</h2>
                  <p>{goal.saved} de {goal.amount}</p>
                </div>
                <strong>{goal.value}%</strong>
              </div>

              <div className="goal-item-progress">
                <ProgressBar value={goal.value} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function GoalCards({ items }) {
  return (
    <section className="goals-cards-grid">
      {items.map((goal) => (
        <article className={`goal-card card goal-card-${goal.variant}`} key={goal.title}>
          <div className="goal-card-top">
            <GoalIcon Icon={goal.icon} variant={goal.variant} />
            <span>{goal.value}%</span>
          </div>

          <div className="goal-card-content">
            <h2>{goal.title}</h2>
            <div className="goal-card-amount">
              <strong>{goal.saved}</strong>
              <span>de {goal.amount}</span>
            </div>
            <ProgressBar value={goal.value} />
            <div className="goal-card-foot">
              <span>{goal.value}%</span>
              <span>completado</span>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export default function Goals() {
  const [view, setView] = useState('cards');

  return (
    <div className="simple-page goals-page">
      <PageHeader
        action={
          <div className="goals-page-actions">
            <button className="btn btn-primary goals-new-button">
              <Plus size={16} />
              Nueva meta
            </button>

            <ViewSwitcher
              value={view}
              onChange={setView}
              ariaLabel="Vista de metas"
              options={[
                { value: 'cards', label: 'Cards' },
                { value: 'list', label: 'Lista' },
              ]}
            />
          </div>
        }
      />

      {view === 'list' ? <GoalList items={goals} /> : <GoalCards items={goals} />}
    </div>
  );
}
