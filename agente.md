# AGENTE — VERDIA

## Propósito

Verdia es una aplicación de finanzas personales enfocada inicialmente en Costa Rica.

**Lema:** “Tu dinero, tus decisiones, más tranquilidad.”

La prioridad del producto es que una persona común pueda entender mejor su dinero, organizarlo y tomar mejores decisiones sin sentir que está usando un sistema bancario complejo.

## Regla principal

Antes de implementar una funcionalidad, cambio visual o cambio de arquitectura, responder:

> **¿Esto ayuda al usuario a entender mejor su dinero y tomar mejores decisiones?**

No agregar complejidad solo porque sea técnicamente posible.

---

## Fuente visual principal

La referencia visual oficial para el frontend actual es:

- `docs/guia-visual-verdia.png`
- `docs/showcase-verdia.png`
- Los mockups suministrados por el proyecto y las fuentes visuales de Verdia.

El frontend debe aproximarse al mockup **por composición, jerarquía, proporciones, densidad, espaciado, colores, radios, navegación y comportamiento responsive**.

No convertir el mockup en un dashboard genérico.

### Elementos visuales que deben conservarse

- Fondo crema claro.
- Verde forest como color principal.
- Verde suave para acciones/estados destacados.
- Sidebar verde oscuro en escritorio.
- Tarjetas blancas con bordes suaves.
- Bordes redondeados.
- Sombras sutiles.
- Tipografía grande y amable para títulos.
- Iconografía lineal.
- Decoración botánica discreta.
- Vera como elemento visual reconocible.
- Bottom navigation en móvil.
- Dashboard compacto con varias tarjetas y bloques de información.

### Paleta aprobada

- Forest Green: `#285E45`
- Soft Green: `#A9D29A`
- Cream: `#F3F6EF`
- Graphite: `#26342B`
- Sage: `#E4EDE1`

### Tipografía aprobada por el proyecto

- Outfit ExtraBold → logo.
- Manrope → títulos y cifras.
- DM Sans → interfaz y contenido.

No cambiar la tipografía aprobada silenciosamente aunque una referencia visual antigua utilice otra combinación.

---

## Arquitectura frontend

React + Vite.

```text
frontend/src/
├── components/
├── pages/
├── routes/
├── services/
├── context/
├── hooks/
├── utils/
├── styles/
├── app/
└── main/
```

Flujo conceptual:

```text
components → pages → routes → app → main → index.html
```

Cada componente y página debe conservar su propia carpeta con JSX y CSS cuando corresponda.

### Componentes reutilizables

Priorizar componentes existentes antes de crear nuevos:

- `AppShell`
- `Sidebar`
- `Topbar`
- `Logo`
- `SectionCard`
- `StatCard`
- `MovementRow`
- `ProgressBar`
- `DonutChart`
- `MiniChart`
- `VeraCard`
- `MobileBottomNav`

Si un patrón aparece en varias pantallas, convertirlo en componente reutilizable en lugar de duplicarlo.

---

## Arquitectura backend

Node.js + Express + Sequelize + MySQL + Sequelize CLI.

```text
backend/src/
├── config/
├── controllers/
├── models/
├── routes/
├── services/
├── migrations/
├── database/
├── middlewares/
├── utils/
├── rag/
└── jobs/
```

La lógica de negocio debe permanecer principalmente en `services`.

No introducir PostgreSQL, pgvector o Docker sin una decisión explícita del proyecto.

---

## Base de datos

La base actual utiliza MySQL.

Existe:

- `backend/database/schema.sql`
- `backend/database/seed.sql`
- Sequelize migrations.

Scripts principales:

```bash
npm run db:schema
npm run db:migrate
npm run db:seed
npm run db:setup
npm run db:status
```

No modificar el modelo de datos aprobado silenciosamente.

---

## RAG

Verdia utiliza:

- Google Drive como fuente documental.
- Google Cloud para infraestructura/procesamiento/recuperación/IA del RAG.
- MySQL para metadata y versiones de documentos/fragments de aplicación.

No asumir que el vector store es MySQL ni introducir pgvector.

La implementación exacta de embeddings/vector retrieval de Google Cloud sigue siendo una decisión de infraestructura si aún no está definida.

---

## Reglas financieras

- El balance real se calcula con balance inicial + movimientos confirmados.
- Los movimientos planificados no afectan el balance real.
- Siempre diferenciar `PLANIFICADO`, `CONFIRMADO` y `CANCELADO`.
- Las reservas son informativas y no son movimientos reales.
- CRC y USD son las monedas iniciales; CRC es la principal por defecto.
- Las tasas históricas usadas por movimientos deben conservarse.
- No recalcular movimientos históricos porque cambie el tipo de cambio.

### Tarjetas

- Compra → gasto + incremento de deuda de tarjeta.
- Pago de tarjeta → disminuye saldo + disminuye deuda, sin crear un gasto nuevo.
- Intereses/comisiones → gasto real + incremento de deuda.
- Nunca almacenar número completo de tarjeta, CVV o PIN.
- Solo se permite mostrar los últimos cuatro dígitos cuando corresponda.

---

## Vera

Regla fundamental:

> **Vera propone; el usuario confirma.**

Vera puede:

- analizar información;
- leer recibos/facturas;
- sugerir categorías;
- detectar posibles duplicados;
- proponer movimientos;
- ayudar a registrar información.

Vera no debe automáticamente:

- confirmar movimientos;
- borrar información;
- modificar presupuestos;
- modificar balance inicial;
- iniciar pagos;
- crear compromisos financieros;
- modificar permisos o conexiones.

Las propuestas de Vera deben mantenerse separadas de la confirmación final del usuario.

---

## Seguridad y privacidad

Nunca almacenar innecesariamente:

- contraseñas bancarias;
- PIN;
- CVV;
- credenciales bancarias;
- números completos de tarjeta.

El contenido recibido por correo, imagen, PDF u otra fuente externa debe considerarse **no confiable hasta ser validado**.

La información financiera es sensible.

---

## UX

Verdia debe sentirse:

- natural;
- tranquila;
- moderna;
- clara;
- humana;
- accesible.

Evitar:

- exceso de opciones;
- pantallas saturadas;
- lenguaje técnico innecesario;
- automatizaciones sin control del usuario;
- confirmaciones repetitivas.

WCAG 2.2 AA es la línea base de accesibilidad.

El Modo Simplificado utiliza los mismos datos y cálculos, pero presenta una experiencia más sencilla.

---

## Responsive

El móvil **no es desktop comprimido**.

En móvil:

- usar bottom navigation;
- apilar tarjetas y bloques;
- mantener objetivos táctiles cómodos;
- reducir densidad sin perder jerarquía;
- conservar el lenguaje visual del mockup;
- no depender únicamente del hover.

---

## Regla de cambios

Antes de hacer un cambio estructural:

1. Identificar qué está definido actualmente.
2. Explicar qué cambiaría.
3. Explicar ventajas, desventajas y riesgos.
4. Identificar conflictos con decisiones existentes.
5. Proponer alternativa.
6. Esperar aprobación si cambia una decisión estructural aprobada.

No eliminar funcionalidades existentes silenciosamente.

---

## Proceso de implementación visual

Para cada pantalla:

1. Revisar el mockup.
2. Identificar estructura y jerarquía.
3. Reutilizar componentes existentes.
4. Implementar estilos compartidos.
5. Ajustar desktop.
6. Ajustar mobile.
7. Verificar estados: normal, vacío, carga, error y confirmación cuando aplique.
8. Ejecutar build.
9. Revisar visualmente mediante screenshot.
10. Comparar contra la referencia y corregir diferencias.

### Orden recomendado

**Fase visual 1**
- Landing
- Login
- Registro
- AppShell
- Sidebar
- Topbar
- Dashboard

**Fase visual 2**
- Movimientos
- Presupuestos
- Tarjetas
- Deudas
- Metas de ahorro

**Fase visual 3**
- Pagos de servicios
- Vera
- Integración con correo
- Reportes
- Ajustes

**Fase visual 4**
- Responsive completo
- Estados vacíos
- Loading
- Errores
- Modales
- Confirmaciones
- Accesibilidad

---

## Reglas de código

- No crear archivos innecesarios.
- No duplicar lógica.
- No asumir dependencias que no están instaladas.
- Mantener JSX y CSS separados según la arquitectura existente.
- Mantener responsabilidades separadas.
- Usar nombres claros y consistentes.
- Preferir componentes pequeños y reutilizables.
- No esconder lógica financiera dentro de componentes visuales.
- Antes de modificar backend, revisar impacto en modelos, controllers, services y rutas.

---

## Comandos de verificación

Frontend:

```bash
cd frontend
npm install
npm run build
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run db:setup
npm run dev
```

Si MySQL no está disponible localmente, no afirmar que la conexión fue validada; distinguir entre validación estática y validación contra una base real.

---

## Estado actual

La base del proyecto ya contiene:

- frontend React/Vite;
- backend Express/Sequelize/MySQL;
- schema y seed SQL;
- migrations;
- RAG con Google Drive + Google Cloud;
- páginas principales de Verdia;
- componentes base del dashboard;
- mockups visuales en `docs/`.

El trabajo actual es **llevar el frontend existente a una implementación visual fiel al mockup**, no rehacer la arquitectura desde cero.
