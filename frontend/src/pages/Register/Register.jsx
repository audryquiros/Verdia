import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import Logo from '../../components/Logo/Logo.jsx';
import AuthLayout from '../../components/AuthLayout/AuthLayout.jsx';
import '../Login/Auth.css';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // El registro visual conserva el flujo actual del proyecto.
    // La integración de creación de usuario se conectará cuando el endpoint de registro esté disponible.
    navigate('/inicio');
  }

  return (
    <AuthLayout
      copy={{
        title: <>Comienza a<br />organizarte.</>,
        description: 'Tu información financiera, clara y bajo tu control.',
      }}
    >
      <div className="auth-logo">
        <Logo />
      </div>

      <form className="auth-card auth-register-card" onSubmit={handleSubmit}>
        <div className="auth-title">
          <h1>Crear cuenta</h1>
          <p>Comienza a organizar tus finanzas</p>
        </div>

        <label>
          <UserRound size={17} aria-hidden="true" />
          <input
            placeholder="Nombre completo"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />
        </label>

        <label>
          <Mail size={17} aria-hidden="true" />
          <input
            placeholder="Correo electrónico"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label>
          <LockKeyhole size={17} aria-hidden="true" />
          <input
            placeholder="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </label>

        <label>
          <LockKeyhole size={17} aria-hidden="true" />
          <input
            placeholder="Confirmar contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((current) => !current)}
            aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </label>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button className="btn btn-primary auth-submit" type="submit">
          Registrarme
        </button>

        <p className="terms">
          Al registrarte aceptas los <a href="#">Términos</a> y la <a href="#">Política de Privacidad</a>.
        </p>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
