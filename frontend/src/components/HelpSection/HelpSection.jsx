import { useState } from 'react';
import { ArrowUpRight, ChevronDown, MessageCircleQuestion } from 'lucide-react';
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

          <div className="help-contact">
            <span className="help-contact-icon" aria-hidden="true">
              <MessageCircleQuestion size={20} strokeWidth={1.8} />
            </span>
            <div>
              <strong>¿No encuentras lo que buscas?</strong>
              <span>Podemos ayudarte a entender cómo funciona Verdia.</span>
            </div>
            <ArrowUpRight size={18} strokeWidth={1.9} aria-hidden="true" />
          </div>
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
