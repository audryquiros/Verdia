import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './CustomSelect.css';

export default function CustomSelect({ value, options, onChange, ariaLabel, className = '' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={rootRef} className={`custom-select ${open ? 'is-open' : ''} ${className}`}>
      <button
        type="button"
        className="custom-select-trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{value}</span>
        <ChevronDown aria-hidden="true" />
      </button>

      {open && (
        <div className="custom-select-menu" role="listbox" aria-label={ariaLabel}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              className={`custom-select-option ${option === value ? 'is-selected' : ''}`}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
