import { NavLink } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Home, ArrowLeftRight, Wallet, WalletCards, CreditCard, HandCoins, Target, ReceiptText, BarChart3, Bot, X } from 'lucide-react';
import sidebarLogo from '../../assets/brand/logos/verdia-sidebar-logo.png';
import './Sidebar.css';

const items = [
  ['/inicio', 'Inicio', Home],
  ['/movimientos', 'Movimientos', ArrowLeftRight],
  ['/cuentas', 'Cuentas', Wallet],
  ['/presupuestos', 'Presupuestos', WalletCards],
  ['/tarjetas', 'Tarjetas', CreditCard],
  ['/deudas', 'Deudas', HandCoins],
  ['/metas', 'Metas de ahorro', Target],
  ['/servicios', 'Pagos de servicios', ReceiptText],
  ['/reportes', 'Reportes', BarChart3],
  ['/vera', 'Vera', Bot],
];

export default function Sidebar({ open, onClose }) {
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;

    const frame = document.createElement('span');
    frame.className = 'sidebar-active-frame sidebar-active-frame--initial';
    frame.setAttribute('aria-hidden', 'true');
    nav.prepend(frame);

    const moveFrame = () => {
      const active = nav.querySelector('.side-link[aria-current="page"]');
      frame.style.opacity = active ? '1' : '0';
      if (!active) return;
      frame.style.width = `${active.offsetWidth}px`;
      frame.style.height = `${active.offsetHeight}px`;
      frame.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
    };

    const observer = new MutationObserver(moveFrame);
    observer.observe(nav, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
    const resizeObserver = new ResizeObserver(moveFrame);
    resizeObserver.observe(nav);
    moveFrame();
    requestAnimationFrame(() => requestAnimationFrame(() => frame.classList.remove('sidebar-active-frame--initial')));

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      frame.remove();
    };
  }, []);

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-vine" aria-hidden="true" />
      <div className="sidebar-head">
        <img className="sidebar-logo" src={sidebarLogo} alt="Verdia" />
        <button className="mobile-close" onClick={onClose} aria-label="Cerrar menú"><X size={19} /></button>
      </div>
      <nav ref={navRef} className="sidebar-nav" aria-label="Navegación principal">
        {items.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} strokeWidth={1.9} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
