import { useState } from 'react';
import { ArrowRight, ChevronDown, MessageCircleQuestion } from 'lucide-react';
import './HelpSection.css';

const QUESTIONS = [
  {
    question: '¿Qué es Verdia?',
    answer:
      'Verdia es una aplicación para organizar tus finanzas, entender mejor tus movimientos y tomar decisiones con mayor claridad.',
  },
  {
    question: '¿Cómo me ayuda Vera?',
    answer:
      'Vera puede analizar información, ayudarte a identificar datos relevantes y proponerte acciones. Vera propone; tú confirmas.',
  },
  {
    question: '¿Verdia toma decisiones por mí?',
    answer:
      'No. Las decisiones sobre tu dinero permanecen bajo tu control. Las propuestas de Vera requieren tu confirmación cuando corresponda.',
  },
  {
    question: '¿Puedo empezar sin complicarme?',
    answer:
      'Sí. La experiencia de Verdia está pensada para mostrar primero lo importante y ayudarte a entender tu situación financiera sin pasos innecesarios.',
  },
];

export default function HelpSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  function toggle(index) {
    setOpenIndex((current) => (current === index ? -1 : index));
  }

  return (
    <section id="ayuda" className="help-section" aria-labelledby="help-title">
      <div className="help-inner">
        <div className="help-intro">
          <span className="help-kicker">AYUDA</span>
          <h2 id="help-title">¿Tienes alguna duda sobre Verdia?</h2>
          <p>
            Encuentra respuestas rápidas sobre cómo funciona Verdia y qué puedes esperar
            de tu experiencia.
          </p>

          <button
            type="button"
            className="help-contact"
            onClick={() => setShowGuide((current) => !current)}
            aria-expanded={showGuide}
            aria-controls="verdia-guide"
          >
            <span className="help-contact-icon" aria-hidden="true">
              <MessageCircleQuestion size={20} strokeWidth={1.8} />
            </span>
            <span className="help-contact-copy">
              <strong>¿Quieres conocer cómo funciona Verdia?</strong>
              <span>Te mostramos lo esencial en unos pasos.</span>
            </span>
            <span className={`help-contact-arrow ${showGuide ? 'is-open' : ''}`} aria-hidden="true">
              <ArrowRight size={18} strokeWidth={1.9} />
            </span>
          </button>

          {showGuide && (
            <div id="verdia-guide" className="help-guide">
              <div className="help-guide-head">
                <span>ASÍ FUNCIONA VERDIA</span>
                <button type="button" onClick={() => setShowGuide(false)}>Cerrar</button>
              </div>
              <div className="help-guide-steps">
                <div>
                  <b>01</b>
                  <strong>Organiza</strong>
                  <p>Reúne tus movimientos y tu información financiera en un solo lugar.</p>
                </div>
                <div>
                  <b>02</b>
                  <strong>Entiende</strong>
                  <p>Visualiza en qué estás gastando, tus metas y lo que está pasando con tu dinero.</p>
                </div>
                <div>
                  <b>03</b>
                  <strong>Decide</strong>
                  <p>Vera puede ayudarte a analizar y proponer; tú mantienes la decisión final.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="help-faq" aria-label="Preguntas frecuentes">
          {QUESTIONS.map((item, index) => {
            const isOpen = index === openIndex;

            return (
              <article className={`help-item ${isOpen ? 'is-open' : ''}`} key={item.question}>
                <button
                  type="button"
                  className="help-question"
                  aria-expanded={isOpen}
                  onClick={() => toggle(index)}
                >
                  <span>{item.question}</span>
                  <span className="help-chevron" aria-hidden="true">
                    <ChevronDown size={18} strokeWidth={1.9} />
                  </span>
                </button>

                <div className="help-answer" hidden={!isOpen}>
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
