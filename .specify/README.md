# Verdia — Spec-Driven Development

Esta carpeta separa las decisiones de diseño, especificaciones funcionales y tareas de implementación.

## Flujo
```text
IDEA
  ↓
DESIGN
  ↓
SPEC
  ↓
TASK
  ↓
AGENT
  ↓
IMPLEMENTACIÓN
  ↓
VERIFICACIÓN
  ↓
DONE
```

## Estructura
- `agents/`: responsabilidades y criterios de trabajo por área.
- `design/`: decisiones de arquitectura, finanzas, seguridad y sistema visual.
- `specs/`: comportamiento esperado de funcionalidades.
- `tasks/`: cambios concretos que pueden ejecutarse.

## Regla
Una TASK no debe redefinir silenciosamente una SPEC.
Una SPEC no debe contradecir DESIGN sin registrar la decisión.

## Integración con el proyecto existente

El `AGENTS.md` existente en la raíz del proyecto se conserva como autoridad para las reglas
generales y visuales ya aprobadas. Esta carpeta no lo reemplaza ni crea un segundo AGENTS.md
en la raíz.

Las `design/`, `specs/` y `tasks/` de esta carpeta formalizan decisiones y trabajos concretos
sin alterar el frontend existente.
