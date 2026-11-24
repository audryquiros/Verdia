import { useState } from 'react';
import { CreditCard, HandCoins, Plus } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import ViewSwitcher from '../../components/ViewSwitcher/ViewSwitcher.jsx';
import '../SimplePage.css';
import './Debts.css';

const debts = [
  {
    title: 'Préstamo personal',
    amount: '₡850.000',
    detail: 'Faltan 6 meses',
    value: 42,
    variant: 'green',
    icon: HandCoins,
  },
  {
    title: 'Tarjeta de crédito',
    amount: '₡120.000',
    detail: 'Fecha de pago: 05 dic',
    value: 60,
    variant: 'purple',
    icon: CreditCard,
  },
];

function DebtIcon({ Icon, variant }) {
  return (
    <div className={`debt-item-icon debt-item-icon-${variant}`} aria-hidden="true">
      <Icon size={20} strokeWidth={2} />
    </div>
  );
}

function DebtList({ items }) {
  return (
    <section className="debt-list-card card">
      <div className="debt-list">
        {items.map((debt) => (
          <article className={`debt-item debt-item-${debt.variant}`} key={debt.title}>
            <DebtIcon Icon={debt.icon} variant={debt.variant} />

            <div className="debt-item-main">
              <div className="debt-item-heading">
                <div>
                  <h2>{debt.title}</h2>
                  <p>{debt.detail}</p>
                </div>
                <strong>{debt.amount}</strong>
              </div>

              <div className="debt-item-progress">
                <ProgressBar value={debt.value} />
                <span>{debt.value}%</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DebtCards({ items }) {
  return (
    <section className="debt-cards-grid">
      {items.map((debt) => (
        <article className={`debt-card card debt-card-${debt.variant}`} key={debt.title}>
          <div className="debt-card-top">
            <DebtIcon Icon={debt.icon} variant={debt.variant} />
            <span className="debt-card-progress-label">{debt.value}%</span>
          </div>

          <div className="debt-card-content">
            <div className="debt-card-title-row">
              <div>
                <h2>{debt.title}</h2>
                <p>{debt.detail}</p>
              </div>
              <strong>{debt.amount}</strong>
            </div>

            <ProgressBar value={debt.value} />
          </div>
        </article>
      ))}
    </section>
  );
}

export default function Debts() {
  const [view, setView] = useState('cards');

  return (
    <div className="simple-page debts-page">
      <PageHeader
        action={
          <div className="debts-page-actions">
            <button className="btn btn-primary debts-new-button">
              <Plus size={16} />
              Nueva deuda
            </button>
            <ViewSwitcher
              value={view}
              onChange={setView}
              ariaLabel="Vista de deudas"
              options={[
                { value: 'cards', label: 'Cards' },
                { value: 'list', label: 'Lista' },
              ]}
            />
          </div>
        }
      />

      {view === 'list' ? <DebtList items={debts} /> : <DebtCards items={debts} />}
    </div>
  );
}
