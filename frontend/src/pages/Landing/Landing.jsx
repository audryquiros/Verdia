import { Link } from 'react-router-dom';
import { ArrowRight, WalletCards, CircleDollarSign, CreditCard, ReceiptText, Mail } from 'lucide-react';
import './Landing.css';

import logo from '../../assets/landing/verdia-logo.svg';
import heroDevices from '../../assets/landing/hero/img-landing.svg';
import vine from '../../assets/landing/botanical/enredadera-corner.svg';

export default function Landing() {
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <Link to="/" className="landing-brand" aria-label="Verdia, inicio">
          <img src={logo} alt="Verdia" />
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
        <img
          className="landing-corner-vine"
          src={vine}
          alt=""
          aria-hidden="true"
        />
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-title-wrap">
              <h1>Tus finanzas, más simples<br />e inteligentes</h1>
            </div>
            <p>
              Organiza, controla y automatiza tu dinero en un solo lugar, con la ayuda de Vera,
              tu asistente financiera.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary hero-primary" to="/registro">
                Comenzar gratis <ArrowRight size={17} strokeWidth={2.2} />
              </Link>
              <a className="btn btn-outline hero-secondary" href="#funcionalidades">
                Conocer más
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-label="Vista previa de Verdia en computadora y teléfono">
            <img className="hero-devices" src={heroDevices} alt="Computadora y teléfono con una vista previa de Verdia" />
          </div>
        </section>

        <section id="funcionalidades" className="features" aria-label="Funcionalidades de Verdia">
          <Feature icon={WalletCards} title="Control de gastos" />
          <Feature icon={CircleDollarSign} title="Metas de ahorro" />
          <Feature icon={CreditCard} title="Tarjetas" />
          <Feature icon={ReceiptText} title="Pagos de servicios" />
          <Feature icon={Mail} title="Automatización con tu correo" />
        </section>

        <section id="seguridad" className="sr-only-section"><h2>Seguridad</h2></section>
        <section id="ayuda" className="sr-only-section"><h2>Ayuda</h2></section>

      </main>
    </div>
  );
}

function Feature({ icon: Icon, title }) {
  return (
    <div className="feature">
      <div className="feature-icon"><Icon size={25} strokeWidth={1.8} /></div>
      <span>{title}</span>
    </div>
  );
}
