import { LockKeyhole, ShieldCheck, UserRoundCheck, Check } from 'lucide-react';
import './SecuritySection.css';

const PRINCIPLES = [
  {
    icon: LockKeyhole,
    title: 'Datos sensibles bajo control',
    text: 'Verdia evita almacenar información que no necesita, como contraseñas bancarias, PIN o CVV.',
  },
  {
    icon: ShieldCheck,
    title: 'Información externa con cuidado',
    text: 'Correos, imágenes y documentos se tratan como información no confiable hasta ser validada.',
  },
  {
    icon: UserRoundCheck,
    title: 'Tú decides',
    text: 'Vera puede proponer y ayudarte a analizar, pero tú mantienes la decisión final.',
  },
];

export default function SecuritySection() {
  return (
    <section id="seguridad" className="security-section" aria-labelledby="security-title">
      <div className="security-inner">
        <div className="security-copy">
          <span className="security-kicker">SEGURIDAD Y PRIVACIDAD</span>
          <h2 id="security-title">Tu información financiera merece tranquilidad.</h2>
          <p>
            Verdia está pensada para que puedas organizar tu dinero sin perder de vista
            algo fundamental: tus datos y tus decisiones siguen estando bajo tu control.
          </p>
          <div className="security-note">
            <span className="security-note-icon"><Check size={15} strokeWidth={2.4} /></span>
            <span>Claridad, privacidad y control como parte de la experiencia.</span>
          </div>
        </div>

        <div className="security-panel">
          <div className="security-panel-top">
            <div>
              <span>PRINCIPIOS DE VERDIA</span>
              <strong>Protección desde el diseño</strong>
            </div>
            <div className="security-shield" aria-hidden="true">
              <ShieldCheck size={26} strokeWidth={1.8} />
            </div>
          </div>

          <div className="security-principles">
            {PRINCIPLES.map(({ icon: Icon, title, text }) => (
              <article className="security-principle" key={title}>
                <div className="security-principle-icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
