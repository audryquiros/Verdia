import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import './DatePicker.css';

const weekdays = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'];
const monthFormatter = new Intl.DateTimeFormat('es-CR', { month: 'long', year: 'numeric' });
const todayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

function parseDate(value) {
  if (!value) return new Date();
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default function DatePicker({ value, onChange, ariaLabel = 'Fecha del movimiento' }) {
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => startOfMonth(parseDate(value)));
  const [position, setPosition] = useState(null);

  const selectedDate = parseDate(value);
  const selectedKey = value || formatKey(selectedDate);

  const days = useMemo(() => {
    const first = startOfMonth(viewDate);
    const firstDay = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const prevMonthDays = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDay; i += 1) {
      const day = prevMonthDays - firstDay + i + 1;
      cells.push({ date: new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, day), outside: true });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ date: new Date(viewDate.getFullYear(), viewDate.getMonth(), day), outside: false });
    }
    while (cells.length < 42) {
      const day = cells.length - (firstDay + daysInMonth) + 1;
      cells.push({ date: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, day), outside: true });
    }
    return cells;
  }, [viewDate]);

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.max(rect.width, 300);
    const estimatedHeight = 350;
    const gap = 7;
    const spaceBelow = window.innerHeight - rect.bottom;
    const opensUp = spaceBelow < estimatedHeight + 12 && rect.top > spaceBelow;
    let left = rect.left;
    if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
    setPosition({ left: Math.max(12, left), top: opensUp ? Math.max(12, rect.top - estimatedHeight - gap) : rect.bottom + gap, width });
  };

  useEffect(() => {
    const closeOnOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    updatePosition();
    const handleViewportChange = () => updatePosition();
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [open]);

  const openPicker = () => {
    setViewDate(startOfMonth(parseDate(value)));
    setOpen((current) => !current);
  };

  const selectDate = (date) => {
    onChange(formatKey(date));
    setOpen(false);
  };

  const moveMonth = (delta) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  return (
    <div ref={rootRef} className={`date-picker ${open ? 'is-open' : ''}`}>
      <button ref={triggerRef} type="button" className="date-picker-trigger" onClick={openPicker} aria-label={ariaLabel} aria-expanded={open}>
        <span>{selectedDate.toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
        <CalendarDays size={17} aria-hidden="true" />
      </button>

      {open && position && (
        <div className="date-picker-popover" style={{ top: position.top, left: position.left, width: position.width }} role="dialog" aria-label="Seleccionar fecha">
          <div className="date-picker-header">
            <strong>{monthFormatter.format(viewDate).replace(/^./, (letter) => letter.toUpperCase())}</strong>
            <div className="date-picker-nav">
              <button type="button" onClick={() => moveMonth(-1)} aria-label="Mes anterior"><ChevronLeft size={17} /></button>
              <button type="button" onClick={() => moveMonth(1)} aria-label="Mes siguiente"><ChevronRight size={17} /></button>
            </div>
          </div>

          <div className="date-picker-weekdays">
            {weekdays.map((day) => <span key={day}>{day}</span>)}
          </div>

          <div className="date-picker-grid">
            {days.map(({ date, outside }) => {
              const key = formatKey(date);
              const isSelected = key === selectedKey;
              const isToday = key === todayKey();
              return (
                <button key={key} type="button" className={`date-picker-day ${outside ? 'is-outside' : ''} ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`} onClick={() => selectDate(date)}>
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="date-picker-footer">
            <button type="button" onClick={() => onChange('')}>Borrar</button>
            <button type="button" onClick={() => selectDate(parseDate(todayKey()))}>Hoy</button>
          </div>
        </div>
      )}
    </div>
  );
}
