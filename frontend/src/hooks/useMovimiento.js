import { useEffect, useState } from 'react';

const REDUCED_MOTION_MEDIA = '(prefers-reduced-motion: reduce)';
const REDUCED_MOTION_ATTRIBUTE = 'reducido';

export function prefiereMenosMovimiento() {
  if (typeof window === 'undefined') return false;
  const html = document.documentElement;
  if (html.dataset.movimiento === REDUCED_MOTION_ATTRIBUTE) return true;
  return window.matchMedia?.(REDUCED_MOTION_MEDIA).matches ?? false;
}

export default function useMovimiento() {
  const [menosMovimiento, setMenosMovimiento] = useState(prefiereMenosMovimiento);

  useEffect(() => {
    const media = window.matchMedia?.(REDUCED_MOTION_MEDIA);
    const update = () => setMenosMovimiento(prefiereMenosMovimiento());
    media?.addEventListener?.('change', update);
    return () => media?.removeEventListener?.('change', update);
  }, []);

  return menosMovimiento;
}
