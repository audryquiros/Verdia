import { ShieldCheck, LockKeyhole, DatabaseZap, UserCheck } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import AdminRagSummary from '../../components/AdminRagSummary/AdminRagSummary.jsx';
import './AdminSecurity.css';

export default function AdminSecurity() {
  return <div className="admin-page">
    <div className="page-head"><div><span className="admin-kicker">Controles y mínimo privilegio</span><h1>Seguridad</h1><p>Supervisa acceso administrativo, protección del conocimiento y señales de seguridad.</p></div></div>
    <AdminRagSummary compact />
    <div className="security-grid">
      <SecurityCard icon={ShieldCheck} title="Acceso administrativo" text="Las rutas /admin requieren autenticación y rol ADMIN desde el backend." status="Protegido" />
      <SecurityCard icon={LockKeyhole} title="Datos financieros" text="El CRM no expone balances, movimientos, cuentas ni tarjetas por defecto." status="Restringido" />
      <SecurityCard icon={DatabaseZap} title="RAG" text="El conocimiento global publicado se separa del contenido financiero privado del usuario." status="Separado" />
      <SecurityCard icon={UserCheck} title="Soporte" text="El acceso excepcional a información privada debe ser específico, temporal y auditable." status="Diseñado" />
    </div>
    <SectionCard title="Base de seguridad del RAG" subtitle="Controles que debemos mantener al ampliar la plataforma."><div className="security-rules"><span>✓ Validar tipo y tamaño antes de ingerir archivos.</span><span>✓ Tratar documentos externos como contenido no confiable.</span><span>✓ No permitir que un documento ejecute instrucciones.</span><span>✓ Auditar publicación, despublicación y acciones administrativas.</span></div></SectionCard>
  </div>;
}
function SecurityCard({ icon: Icon, title, text, status }) { return <div className="card security-card"><span><Icon size={18}/></span><div><strong>{title}</strong><small>{text}</small><em>{status}</em></div></div>; }
