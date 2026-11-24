import { LayoutGrid, List } from 'lucide-react';
import './ViewSwitcher.css';

const ICONS = {
  cards: LayoutGrid,
  list: List,
};

export default function ViewSwitcher({ value, onChange, options, ariaLabel = 'Cambiar vista' }) {
  return (
    <div className="view-switcher" role="group" aria-label={ariaLabel}>
      {options.map(({ value: optionValue, label, icon }) => {
        const Icon = icon || ICONS[optionValue] || LayoutGrid;
        const active = value === optionValue;

        return (
          <button
            key={optionValue}
            type="button"
            className={`view-switcher-option${active ? ' active' : ''}`}
            onClick={() => onChange(optionValue)}
            aria-label={label}
            aria-pressed={active}
            title={active ? undefined : label}
          >
            <Icon size={17} strokeWidth={2} aria-hidden="true" />
            <span className="view-switcher-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
