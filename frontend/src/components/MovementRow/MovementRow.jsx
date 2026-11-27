import { ShoppingBag, ReceiptText, Wallet, ArrowDownLeft, Car } from 'lucide-react';
import './MovementRow.css';

const defaultIcons = {
  Alimentación: ShoppingBag,
  Servicios: ReceiptText,
  Ingreso: ArrowDownLeft,
  Transporte: Car,
};

export default function MovementRow({
  name,
  category,
  date,
  amount,
  type = 'expense',
  status = 'confirmed',
  compact = false,
  icon,
  categoryTone,
  categoryVisual,
  actions = null,
}) {
  const income = type === 'income';
  const Icon = icon || defaultIcons[category] || Wallet;
  const tone = categoryTone || (income ? 'income' : 'expense');
  const statusLabel = status === 'planned' ? 'Planificado' : status === 'canceled' ? 'Cancelado' : status === 'voided' ? 'Anulado' : status === 'overdue' ? 'Vencido' : 'Confirmado';

  if (compact) {
    return (
      <div className={`movement-row movement-row--compact ${income ? 'is-income' : ''}`}>
        <div className={`movement-icon ${income ? 'income' : ''}`} style={!income && categoryVisual ? { background: categoryVisual.background, color: categoryVisual.color } : undefined}>
          <Icon size={15} />
        </div>
        <div className="movement-info">
          <strong>{name}</strong>
          <span>{category}</span>
        </div>
        <div className={`movement-meta ${income ? 'income' : ''}`}>
          <strong className={`movement-amount ${income ? 'income' : ''}`}>{income ? '+' : ''}{amount}</strong>
          <span>{date}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="movement-row movement-table-row" role="row">
      <span className="movement-date" role="cell">{date}</span>

      <div className="movement-description" role="cell">
        <div className={`movement-icon ${income ? 'income' : ''}`} style={!income && categoryVisual ? { background: categoryVisual.background, color: categoryVisual.color } : undefined}>
          <Icon size={18} />
        </div>
        <div className="movement-info">
          <strong>{name}</strong>
          <span>{category}</span>
        </div>
      </div>

      <div className="movement-category" role="cell">
        <span className={`category-badge category-badge--${tone}`} style={!income && categoryVisual ? { background: categoryVisual.background, color: categoryVisual.color } : undefined}>
          <Icon size={15} />
        </span>
        <span>{category}</span>
      </div>

      <div className={`movement-status movement-status--${status}`} role="cell">
        <span className="movement-status-dot" aria-hidden="true" />
        <span>{statusLabel}</span>
      </div>

      <strong className={`movement-amount ${income ? 'income' : ''}`} role="cell">
        {income ? '+' : '-'}{amount}
      </strong>

      <div className="movement-actions" role="cell">
        {actions}
      </div>
    </div>
  );
}
