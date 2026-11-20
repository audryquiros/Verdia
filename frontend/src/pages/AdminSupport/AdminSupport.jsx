import { useEffect, useState } from 'react';
import { LifeBuoy, Send } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import AdminRagSummary from '../../components/AdminRagSummary/AdminRagSummary.jsx';
import { adminApi } from '../../services/admin.js';
import './AdminSupport.css';

export default function AdminSupport(){
 const [cases,setCases]=useState([]); const [selected,setSelected]=useState(null); const [text,setText]=useState(''); const [message,setMessage]=useState('');
 async function load(){try{setCases((await adminApi.supportCases()).cases||[])}catch(e){setMessage(e.message)}}
 useEffect(()=>{load()},[]);
 async function open(id){try{setSelected((await adminApi.supportCase(id)).case)}catch(e){setMessage(e.message)}}
 async function reply(){if(!text.trim()||!selected)return;try{await adminApi.supportReply(selected.id,text);setText('');await open(selected.id);await load()}catch(e){setMessage(e.message)}}
 async function status(status){try{await adminApi.supportUpdate(selected.id,{status});await open(selected.id);await load()}catch(e){setMessage(e.message)}}
 return <div className="admin-page"><div className="page-head"><div><span className="admin-kicker">Vera → soporte humano</span><h1>Soporte</h1><p>Ayuda a los usuarios sin abrir sus datos financieros por defecto.</p></div></div><AdminRagSummary compact />
  {message&&<div className="admin-alert">{message}</div>}
  <div className="support-layout"><SectionCard title="Bandeja" subtitle={`${cases.length} casos`}><div className="case-list">{cases.map(item=><button key={item.id} className={`case-item ${selected?.id===item.id?'selected':''}`} onClick={()=>open(item.id)}><span className="case-icon"><LifeBuoy size={15}/></span><div><strong>#{item.id} · {item.asunto}</strong><small>{item.usuario?.nombre||item.usuario?.email||'Usuario'} · {item.estado}</small></div></button>)}{!cases.length&&<p className="muted">No hay casos abiertos.</p>}</div></SectionCard>
  <SectionCard title={selected?`Caso #${selected.id}`:'Selecciona un caso'} subtitle={selected?`${selected.usuario?.nombre||selected.usuario?.email||'Usuario'} · ${selected.prioridad}`:'La conversación aparecerá aquí.'}>{selected&&<><div className="case-conversation">{selected.MensajeSoportes?.map(m=><div className={`support-msg ${m.autor_tipo.toLowerCase()}`} key={m.id}><strong>{m.autor_tipo==='ADMIN'?'Verdia':m.autor_tipo==='USUARIO'?'Usuario':'Sistema'}</strong><p>{m.contenido}</p></div>)}</div><div className="support-compose"><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Escribe una respuesta..."/><div className="support-actions"><button className="btn btn-outline btn-sm" onClick={()=>status('RESUELTO')}>Resolver</button><button className="btn btn-primary btn-sm" onClick={reply}><Send size={14}/> Enviar</button></div></div></>}</SectionCard></div>
 </div>
}
