import { useEffect, useState } from 'react';
import { MessageSquare, Send, UserRound } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import AdminRagSummary from '../../components/AdminRagSummary/AdminRagSummary.jsx';
import { adminApi } from '../../services/admin.js';
import './AdminMessaging.css';

export default function AdminMessaging() {
  const [cases, setCases] = useState([]);
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  async function load() {
    try {
      const result = await adminApi.supportCases();
      setCases(result.cases || []);
      if (!selected && result.cases?.[0]) await openCase(result.cases[0].id);
    } catch (e) { setError(e.message); }
  }

  async function openCase(id) {
    try { setSelected((await adminApi.supportCase(id)).case); } catch (e) { setError(e.message); }
  }

  useEffect(() => { load(); }, []);

  async function send() {
    if (!selected || !text.trim()) return;
    try {
      await adminApi.supportReply(selected.id, text.trim());
      setText('');
      await openCase(selected.id);
      await load();
    } catch (e) { setError(e.message); }
  }

  return <div className="admin-page admin-messaging-page">
    <div className="page-head">
      <div>
        <span className="admin-kicker">Comunicación</span>
        <h1>Mensajería</h1>
        <p>Consulta y responde conversaciones de soporte sin acceder a información financiera privada.</p>
      </div>
    </div>
    <AdminRagSummary compact />
    {error && <div className="admin-alert">{error}</div>}
    <div className="messaging-layout">
      <SectionCard title="Conversaciones" subtitle={`${cases.length} casos de soporte`}>
        <div className="message-list">
          {cases.map(item => <button key={item.id} className={`message-thread ${selected?.id === item.id ? 'selected' : ''}`} onClick={() => openCase(item.id)}>
            <span className="message-avatar"><UserRound size={16} /></span>
            <span className="message-thread-body"><strong>#{item.id} · {item.asunto}</strong><small>{item.usuario?.nombre || item.usuario?.email || 'Usuario'} · {item.estado}</small></span>
          </button>)}
          {!cases.length && <div className="message-empty"><MessageSquare size={22}/><span>No hay conversaciones de soporte.</span></div>}
        </div>
      </SectionCard>
      <SectionCard title={selected ? `#${selected.id} · ${selected.asunto}` : 'Selecciona una conversación'} subtitle={selected ? `${selected.usuario?.nombre || selected.usuario?.email || 'Usuario'} · ${selected.prioridad}` : 'Los mensajes aparecerán aquí.'}>
        {selected ? <>
          <div className="message-conversation">
            {(selected.MensajeSoportes || []).map(message => <div className={`message-bubble ${message.autor_tipo.toLowerCase()}`} key={message.id}>
              <small>{message.autor_tipo === 'ADMIN' ? 'Verdia' : message.autor_tipo === 'USUARIO' ? 'Usuario' : 'Sistema'}</small>
              <p>{message.contenido}</p>
            </div>)}
          </div>
          <div className="message-compose">
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Escribe una respuesta al usuario…" />
            <button className="btn btn-primary btn-sm" onClick={send}><Send size={14}/> Enviar mensaje</button>
          </div>
        </> : <div className="message-empty"><MessageSquare size={25}/><span>Selecciona un caso para comenzar.</span></div>}
      </SectionCard>
    </div>
  </div>;
}
