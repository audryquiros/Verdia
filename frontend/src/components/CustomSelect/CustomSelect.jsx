import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './CustomSelect.css';

function normalizeOption(option) {
  return typeof option === 'string' ? { value: option, label: option } : option;
}

export default function CustomSelect({ value, options, onChange, ariaLabel, className = '' }) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const normalizedOptions = options.map(normalizeOption);
  const selected = normalizedOptions.find((option) => option.value === value);

  const updateMenuPosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const estimatedHeight = Math.min(normalizedOptions.length * 40 + 12, 260);
    const viewportPadding = 12;
    const spaceBelow = window.innerHeight - rect.bottom;
    const opensUp = spaceBelow < estimatedHeight + viewportPadding && rect.top > spaceBelow;
    const height = Math.min(estimatedHeight, opensUp ? rect.top - viewportPadding : window.innerHeight - rect.bottom - viewportPadding);

    const menuWidth = Math.min(rect.width, window.innerWidth - viewportPadding * 2);
    const left = Math.min(
      Math.max(viewportPadding, rect.left),
      window.innerWidth - viewportPadding - menuWidth
    );

    setMenuPosition({
      top: opensUp ? Math.max(viewportPadding, rect.top - height - 6) : rect.bottom + 6,
      left,
      width: menuWidth,
      maxHeight: Math.max(120, height),
    });
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    updateMenuPosition();
    const handleViewportChange = () => updateMenuPosition();
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [open, normalizedOptions.length]);

  const toggleOpen = () => {
    setOpen((current) => !current);
  };

  return (
    <div ref={rootRef} className={`custom-select ${open ? 'is-open' : ''} ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className="custom-select-trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggleOpen}
      >
        <span>{selected?.label ?? value}</span>
        <ChevronDown aria-hidden="true" />
      </button>

      {open && menuPosition && (
        <div
          className="custom-select-menu custom-select-menu-fixed"
          role="listbox"
          aria-label={ariaLabel}
          style={{ top: menuPosition.top, left: menuPosition.left, width: menuPosition.width, minWidth: menuPosition.width, maxWidth: menuPosition.width, maxHeight: menuPosition.maxHeight, '--custom-select-menu-width': `${menuPosition.width}px` }}
        >
          {normalizedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`custom-select-option ${option.value === value ? 'is-selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
