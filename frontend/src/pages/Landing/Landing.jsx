import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Wallet,
  Target,
  CreditCard,
  ReceiptText,
  Mail,
} from 'lucide-react';
import Logo from '../../components/Logo/Logo.jsx';
import heroDevices from '../../assets/landing/verdia-hero-devices.svg';
import leafCorner from '../../assets/landing/verdia-leaf-corner.svg';
import leafTop from '../../assets/landing/verdia-leaf-top.svg';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <Link to="/" aria-label="Verdia, inicio">
          <Logo />
        </Link>

        <nav className="landing-links" aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#seguridad">Seguridad</a>
          <a href="#ayuda">Ayuda</a>
        </nav>

        <div className="nav-actions">
          <Link className="btn btn-outline btn-sm" to="/login">Iniciar sesión</Link>
          <Link className="btn btn-primary btn-sm" to="/registro">Registrarse</Link>
        </div>
      </header>

      <main id="inicio" className="landing-main">
        <img className="landing-leaf landing-leaf-top" src={leafTop} alt="" aria-hidden="true" />
        <img className="landing-leaf landing-leaf-corner" src={leafCorner} alt="" aria-hidden="true" />

        <section className="hero">
          <div className="hero-copy">
            <h1>Tus finanzas, más simples<br />e inteligentes</h1>
            <p>
              Organiza, controla y automatiza tu dinero en un solo lugar, con la ayuda de Vera,
              tu asistente financiera.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary hero-primary" to="/registro">
                Comenzar gratis <ArrowRight size={16} strokeWidth={2.2} />
              </Link>
              <a className="btn btn-outline hero-secondary" href="#funcionalidades">
                Conocer más
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-label="Vista previa de Verdia en computadora y teléfono">
            <img src={heroDevices} alt="Vista previa de Verdia en computadora y teléfono" />
          </div>
        </section>

        <section id="funcionalidades" className="features" aria-label="Funcionalidades de Verdia">
          <Feature icon={Wallet} title="Control de gastos" />
          <Feature icon={Target} title="Metas de ahorro" />
          <Feature icon={CreditCard} title="Tarjetas" />
          <Feature icon={ReceiptText} title="Pagos de servicios" />
          <Feature icon={Mail} title="Automatización con tu correo" />
        </section>

        <section id="seguridad" className="sr-only-section">
          <h2>Seguridad</h2>
          <p>Verdia prioriza claridad, privacidad y control. Vera propone; tú confirmas.</p>
        </section>
        <section id="ayuda" className="sr-only-section">
          <h2>Ayuda</h2>
        </section>
      </main>
    </div>
  );
}

function Feature({ icon: Icon, title }) {
  return (
    <div className="feature">
      <div className="feature-icon"><Icon size={18} strokeWidth={1.8} /></div>
      <span>{title}</span>
    </div>
  );
}
