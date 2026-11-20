import { Link } from 'react-router-dom';
import vine from '../../assets/landing/botanical/enredadera-corner.svg';
import '../../pages/Login/Auth.css';

export default function AuthLayout({ children, copy }) {
  return (
    <div className="auth-page">
      <div className="auth-ornament">
        <Link to="/" className="auth-home" aria-label="Volver al inicio">
          <span aria-hidden="true">←</span>
          <span>Volver al inicio</span>
        </Link>

        <img className="auth-vine" src={vine} alt="" aria-hidden="true" />

        <div className="leaf-copy">
          <h2>
            {copy?.title ?? <>Tu dinero,<br />tus decisiones,<br /><span className="accent">más tranquilidad.</span></>}
          </h2>
          <p>
            {copy?.description ?? 'Organiza tus finanzas, entiende tu situación y avanza hacia tus metas, en un solo lugar.'}
          </p>
        </div>
      </div>

      <div className="auth-side">{children}</div>
    </div>
  );
}
