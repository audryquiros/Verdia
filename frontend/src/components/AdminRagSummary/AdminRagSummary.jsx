import { useEffect, useState } from 'react';
import { Database, FileText, Layers3, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { adminApi } from '../../services/admin.js';
import './AdminRagSummary.css';

export default function AdminRagSummary({ compact = false }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    adminApi.ragOverview().then((result) => active && setData(result)).catch((err) => active && setError(err.message));
    return () => { active = false; };
  }, []);
  if (error) return <div className="rag-health rag-health-error"><ShieldCheck size={17} /><span>No se pudo cargar el estado del RAG: {error}</span></div>;
  if (!data) return <div className="rag-health rag-health-loading"><Sparkles size={17} /><span>Cargando estado de Vera y RAG…</span></div>;
  const stats = [
    { icon: FileText, label: 'Documentos', value: data.documents.total },
    { icon: Database, label: 'Publicados', value: data.documents.published },
    { icon: Layers3, label: 'Fragmentos', value: data.fragments },
    { icon: Search, label: 'Fuentes usadas por Vera', value: data.sourcesUsed },
  ];
  return <section className={`rag-health ${compact ? 'compact' : ''}`}>
    <div className="rag-health-head">
      <div className="rag-health-title"><span className="rag-health-icon"><Sparkles size={17} /></span><div><strong>Estado de Vera / RAG</strong><span>Conocimiento, recuperación y soporte</span></div></div>
    </div>
    <div className="rag-health-grid">{stats.map(({ icon: Icon, label, value }) => <div className="rag-health-stat" key={label}><Icon size={15}/><div><small>{label}</small><strong>{value}</strong></div></div>)}</div>
    <div className="rag-health-meta">
      <span><b>Fuentes:</b> CRM {data.documents.crm} · Drive {data.documents.drive}</span>
      <span><b>Soporte por Vera:</b> {data.support.veraCases}</span>
      <span><b>Último documento:</b> {data.documents.latest ? new Date(data.documents.latest).toLocaleString('es-CR') : 'Sin registros'}</span>
    </div>
  </section>;
}
