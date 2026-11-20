import { useEffect, useState } from 'react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import AdminRagSummary from '../../components/AdminRagSummary/AdminRagSummary.jsx';
import { api } from '../../services/api.js';
import { getSession } from '../../services/auth.js';
import './AdminAudit.css';
export default function AdminAudit(){const [items,setItems]=useState([]);useEffect(()=>{api.get('/admin/audit',{token:getSession()?.token}).then(r=>setItems(r.items||[])).catch(()=>{})},[]);return <div className="admin-page"><div className="page-head"><div><span className="admin-kicker">Trazabilidad</span><h1>Auditoría</h1><p>Registro de acciones administrativas sensibles.</p></div></div><AdminRagSummary compact /><SectionCard title="Actividad reciente"><div className="audit-list">{items.map(item=><div className="audit-row" key={item.id}><strong>{item.accion}</strong><span>{item.entidad||'—'} #{item.entidad_id||'—'}</span><small>{new Date(item.createdAt).toLocaleString('es-CR')}</small></div>)}{!items.length&&<p className="muted">No hay actividad administrativa disponible.</p>}</div></SectionCard></div>}
