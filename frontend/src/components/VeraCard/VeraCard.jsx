import { useState } from 'react';
import { Check, PenLine, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './VeraCard.css';

export default function VeraCard() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    if (!message.trim()) return;
    navigate('/vera');
  }

  return (
    <div className="vera-card card">
      <div className="vera-head">
        <div className="vera-bot">
          <img src="/vera-robot-saludando.png" alt="Vera" />
        </div>
        <div className="vera-head-copy">
          <strong>Vera ✨</strong>
          <span>Tu asistente financiera</span>
        </div>
      </div>

      <div className="vera-message">
        <p>Detecté un nuevo movimiento en tu correo bancario:</p>
        <div className="vera-transaction">
          <strong>Compra: ₡15.500</strong>
          <span>Walmart · Tarjeta ••••1234</span>
        </div>
        <div className="vera-question">¿Deseas registrarlo?</div>
      </div>

      <div className="vera-actions">
        <button className="btn btn-primary btn-sm"><Check size={14}/> Confirmar</button>
        <button className="btn btn-outline btn-sm"><PenLine size={14}/> Editar</button>
        <button className="btn btn-danger btn-sm"><X size={14}/> Rechazar</button>
      </div>

      <form className="vera-input" onSubmit={handleSubmit}>
        <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Escríbele a Vera..." aria-label="Escribir a Vera" />
        <button type="submit" aria-label="Enviar mensaje"><Send size={18} /></button>
      </form>
    </div>
  );
}
