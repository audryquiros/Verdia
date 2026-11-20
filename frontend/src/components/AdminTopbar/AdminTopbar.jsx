import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, ShieldCheck, UserRound, Settings } from 'lucide-react';
import { getSession, logout } from '../../services/auth.js';
import { useLocation, useNavigate } from 'react-router-dom';
import './AdminTopbar.css';

const sectionInfo = {
  '/admin': ['Dashboard', 'Resumen operativo de Verdia.'],
  '/admin/usuarios': ['Usuarios', 'Gestión operativa y acceso administrativo.'],
  '/admin/vera': ['Vera / RAG', 'Gestiona el conocimiento que utiliza Vera.'],
  '/admin/mensajeria': ['Mensajería', 'Comunicación operativa con usuarios.'],
  '/admin/soporte': ['Soporte', 'Atiende solicitudes de los usuarios.'],
  '/admin/auditoria': ['Auditoría', 'Revisa acciones administrativas sensibles.'],
  '/admin/analitica': ['Analítica', 'Entiende cómo se utiliza Verdia.'],
  '/admin/producto': ['Producto', 'Supervisa la experiencia y el funcionamiento del producto.'],
  '/admin/seguridad': ['Seguridad', 'Supervisa el acceso y los eventos de seguridad.'],
  '/admin/configuracion': ['Configuración', 'Configura parámetros administrativos de Verdia.'],
  '/admin/cuenta': ['Mi cuenta', 'Administra tu cuenta de administrador.'],
};

export default function AdminTopbar({ onMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getSession()?.user;
  const displayName = [user?.nombre, user?.apellido].filter(Boolean).join(' ') || 'Administrador';
  const initials = displayName.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase();
  const avatarUrl = user?.foto_url || null;
  const [title, subtitle] = sectionInfo[location.pathname] || ['Administración', 'Centro de control de Verdia.'];
  const currentDate = new Intl.DateTimeFormat('es-CR', { day:'numeric', month:'long', year:'numeric' }).format(new Date());

  useEffect(() => {
    function outside(e){ if(menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); }
    function escape(e){ if(e.key === 'Escape') setMenuOpen(false); }
    document.addEventListener('mousedown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', escape); };
  }, []);

  async function handleLogout(){ await logout(); navigate('/login', {replace:true}); }

  return <header className="admin-topbar">
    <button className="admin-menu-btn" onClick={onMenu} aria-label="Abrir menú"><Menu size={21}/></button>
    <div className="admin-top-context"><span className="admin-top-kicker">VERDIA ADMIN</span><div className="admin-title-row"><ShieldCheck size={17}/><strong>{title}</strong></div><span>{subtitle}</span></div>
    <div className="admin-top-spacer" />
    <div className="admin-top-period">{currentDate}</div>
    <button className="admin-icon-btn" aria-label="Notificaciones"><Bell size={18}/></button>
    <div className="admin-user-wrap" ref={menuRef}>
      <button
        className={`admin-user-trigger ${menuOpen ? 'open' : ''}`}
        onClick={()=>setMenuOpen(v=>!v)}
        aria-expanded={menuOpen}
        aria-label={`Abrir menú de ${displayName}`}
      >
        <span className="admin-avatar-wrap">
          <span className="admin-avatar-top">{avatarUrl ? <img src={avatarUrl} alt="" /> : initials}</span>
          <span className="admin-user-name">{displayName}</span>
        </span>
        <ChevronDown className="admin-avatar-chevron" size={15}/>
      </button>
      {menuOpen && <div className="admin-user-dropdown">
        <div className="admin-drop-head"><div className="admin-avatar-top large">{avatarUrl ? <img src={avatarUrl} alt="" /> : initials}</div><div><strong>{displayName}</strong><span>{user?.email || 'Cuenta administrativa'}</span></div></div>
        <div className="admin-drop-divider"/>
        <button className="admin-drop-action" onClick={() => { setMenuOpen(false); navigate('/admin/cuenta'); }}><UserRound size={17}/><span>Mi cuenta</span></button>
        <button className="admin-drop-action" onClick={() => { setMenuOpen(false); navigate('/admin/configuracion'); }}><Settings size={17}/><span>Configuración</span></button>
        <div className="admin-drop-divider"/>
        <button className="admin-drop-logout" onClick={handleLogout}><LogOut size={17}/><span>Cerrar sesión</span></button>
      </div>}
    </div>
  </header>;
}
