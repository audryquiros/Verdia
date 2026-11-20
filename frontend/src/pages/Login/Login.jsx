import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import Logo from '../../components/Logo/Logo.jsx';
import vine from '../../assets/landing/botanical/enredadera-corner.svg';
import './Auth.css';

export default function Login() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    navigate('/inicio');
  }

  return (
    <AuthLayout>
      <div className="auth-logo">
        <Logo />
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-title">
          <h1>Iniciar sesión</h1>
          <p>Ingresa a tu cuenta</p>
        </div>

        <label>
          <Mail size={17} aria-hidden="true" />
          <input
            placeholder="Correo electrónico"
            type="email"
            defaultValue="audry@correo.com"
            autoComplete="email"
          />
        </label>

        <label>
          <LockKeyhole size={17} aria-hidden="true" />
          <input
            placeholder="Contraseña"
            type={show ? 'text' : 'password'}
            defaultValue="12345678"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShow((current) => !current)}
            aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </label>

        <div className="auth-row">
          <label className="check">
            <input type="checkbox" defaultChecked />
            <span>Recordarme</span>
          </label>
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>

        <button className="btn btn-primary auth-submit" type="submit">
          Ingresar
        </button>

        <div className="or">
          <span>o continúa con</span>
        </div>

        <div className="socials">
          <button className="btn btn-outline" type="button">Google</button>
          <button className="btn btn-outline" type="button">Microsoft</button>
        </div>

        <p className="auth-footer">
          ¿Aún no tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-ornament">
        <Link to="/" className="auth-home" aria-label="Volver al inicio">
          <span aria-hidden="true">←</span>
          <span>Volver al inicio</span>
        </Link>
        <img className="auth-vine" src={vine} alt="" aria-hidden="true" />
        <div className="leaf-orb" />
        <div className="leaf-copy">
          <h2>Tu dinero,<br />más claro.</h2>
          <p>Una forma tranquila de entender, organizar y decidir.</p>
        </div>
      </div>

      <div className="auth-side">{children}</div>
    </div>
  );
}
