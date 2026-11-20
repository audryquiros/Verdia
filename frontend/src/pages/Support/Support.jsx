import { useEffect, useState } from 'react';
import { LifeBuoy, Send } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import { supportApi } from '../../services/admin.js';
import './Support.css';

export default function Support(){const [cases,setCases]=useState([]);const [subject,setSubject]=useState('');const [message,setMessage]=useState('');const [selected,setSelected]=useState(null);const [reply,setReply]=useState('');const [notice,setNotice]=useState('');
 async function load(){try{setCases((await supportApi.list()).cases||[])}catch(e){setNotice(e.message)}} useEffect(()=>{load()},[]);
 async function create(){if(!subject.trim()||!message.trim())return;try{await supportApi.create(subject,message);setSubject('');setMessage('');setNotice('Tu solicitud fue enviada al equipo de soporte.');await load()}catch(e){setNotice(e.message)}}
 async function open(id){try{setSelected((await supportApi.get(id)).case)}catch(e){setNotice(e.message)}}
 async function sendReply(){if(!reply.trim()||!selected)return;try{await supportApi.reply(selected.id,reply);setReply('');await open(selected.id);await load()}catch(e){setNotice(e.message)}}
 return <div className="support-page"><div className="page-head"><div><h1>Soporte</h1><p>Estamos para ayudarte cuando Vera no tenga suficiente información.</p></div></div>{notice&&<div className="support-notice">{notice}</div>}
 <div className="support-user-grid"><SectionCard title="Contactar soporte" subtitle="Cuéntanos qué necesitas y un miembro del equipo podrá ayudarte."><div className="support-form"><input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Asunto"/><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="¿Qué ocurrió o qué necesitas saber?"/><button className="btn btn-primary" disabled={!subject.trim()||!message.trim()} onClick={create}><Send size={15}/> Enviar solicitud</button></div></SectionCard>
 <SectionCard title="Mis solicitudes" subtitle="Consulta el estado de tus casos."><div className="user-case-list">{cases.map(item=><button key={item.id} onClick={()=>open(item.id)} className="user-case"><span><LifeBuoy size={15}/></span><div><strong>#{item.id} · {item.asunto}</strong><small>{item.estado}</small></div></button>)}{!cases.length&&<p className="muted">Todavía no tienes solicitudes.</p>}</div></SectionCard></div>
 {selected&&<SectionCard title={`Solicitud #${selected.id}`} subtitle={selected.asunto}><div className="case-conversation">{selected.MensajeSoportes?.map(m=><div className={`support-msg ${m.autor_tipo.toLowerCase()}`} key={m.id}><strong>{m.autor_tipo==='ADMIN'?'Verdia':'Tú'}</strong><p>{m.contenido}</p></div>)}</div>{selected.estado!=='RESUELTO'&&selected.estado!=='CERRADO'&&<div className="support-reply"><textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Escribe una respuesta..."/><button className="btn btn-primary btn-sm" onClick={sendReply}><Send size={14}/> Enviar</button></div>}</SectionCard>}
 </div>}
