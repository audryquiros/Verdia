import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import './AdminAccount.css';

export default function AdminAccount() {
  return <div className="admin-simple-page">
    <div className="page-head"><div><h1>Mi cuenta</h1><p>Información y preferencias de tu cuenta administrativa.</p></div></div>
    <SectionCard title="Módulo de Mi cuenta" subtitle="Este espacio forma parte del centro administrativo de Verdia.">
      <div className="admin-simple-placeholder">
        <strong>Preparado para el módulo de Mi cuenta.</strong>
        <span>La navegación ya está separada del espacio financiero del usuario.</span>
      </div>
    </SectionCard>
  </div>;
}
