# AGENTS.md --- Verdia

## Regla crítica de trabajo visual

Verdia se desarrolla sobre un estado visual existente y aprobado. El agente NO debe rehacer, reinterpretar ni "mejorar" el dashboard completo cada vez que se solicite un ajuste.

### Regla de oro

**Tomar siempre el último estado bueno como base y modificar únicamente lo que el usuario señaló explícitamente.**

Si el usuario pide un cambio localizado:
- no cambiar otras secciones;
- no cambiar tipografías existentes;
- no cambiar tamaños de fuente que no fueron mencionados;
- no cambiar el sidebar si no fue solicitado;
- no cambiar colores, espaciados, dimensiones o estructura de otras áreas;
- no reemplazar componentes funcionales por versiones nuevas sin necesidad;
- no eliminar elementos existentes por criterio propio.

Si una modificación requiere tocar otra parte para mantener consistencia técnica, debe explicarse antes de hacerlo cuando el impacto sea visible o estructural.

## Referencia visual del Dashboard

Cuando el usuario entregue un mockup o una captura de referencia:

1. El mockup es la referencia visual principal para esa sección.
2. Comparar primero el estado actual contra el mockup.
3. Identificar exactamente qué diferencias pidió corregir.
4. Aplicar cambios mínimos para acercarse al mockup.
5. Mantener intactas las partes que ya coinciden o que el usuario no pidió modificar.
6. Respetar las dimensiones reales de la pantalla y el comportamiento responsive.
7. No escalar arbitrariamente fuentes, sidebar, tarjetas o contenido solo para "hacerlo más parecido".
8. No introducir decoraciones nuevas que no estén en el mockup o en la identidad visual aprobada.

## Estado bueno / rollback

Cuando el usuario indique que una versión anterior estaba bien, esa versión debe considerarse la nueva base de referencia.

Ejemplos:
- "la parte de arriba estaba bien" → restaurar visualmente esa parte y no volver a modificarla;
- "usa el último zip" → inspeccionar ese zip antes de tocar código;
- "dejemos esto como estaba" → detener cualquier cambio sobre esa zona;
- "solo cambia X" → X es el único alcance visual, salvo dependencias técnicas inevitables.

No reconstruir una sección desde cero si existe una implementación previa que ya funcionaba.

## Flujo obligatorio antes de editar

### 1. Inspeccionar

Revisar:
- estructura del frontend;
- página afectada;
- componentes utilizados;
- CSS correspondiente;
- variables/estilos globales;
- assets e imágenes;
- rutas y servicios si afectan el comportamiento.

### 2. Identificar el alcance

Separar explícitamente:
- lo que el usuario quiere cambiar;
- lo que debe conservarse;
- lo que es una diferencia del mockup pero NO fue solicitada todavía.

### 3. Modificar

Hacer el cambio más pequeño posible.

Preferir:
- editar CSS existente;
- ajustar propiedades existentes;
- reutilizar componentes;
- reutilizar assets;
- mantener la misma estructura JSX cuando sea suficiente.

Evitar:
- reescribir páginas completas;
- crear componentes duplicados;
- introducir nuevas dependencias;
- cambiar la arquitectura;
- cambiar datos o lógica de negocio para resolver un problema puramente visual.

### 4. Verificar

Después de cada cambio:
- comprobar que la sección solicitada coincide mejor con el mockup;
- comprobar que las secciones no solicitadas siguen iguales;
- comprobar desktop y tamaños razonables de pantalla;
- comprobar que no aparezca scroll inesperado;
- comprobar que no se rompan rutas ni funcionalidad.

## Dashboard de Verdia --- reglas visuales actuales

### Fondo del contenedor dashboard

El contenedor `.dashboard` no debe tener sombreado propio (`box-shadow`). El sombreado visual debe pertenecer únicamente a los componentes que lo necesiten, como tarjetas, y no al contenedor general del dashboard.

### Parte superior

La cabecera del dashboard debe conservar:
- saludo del usuario;
- subtítulo;
- campana;
- avatar;
- selector correspondiente;
- separación superior razonable;
- alineación horizontal coherente.

Las cuatro tarjetas superiores deben seguir la composición del mockup:
- Disponible;
- Gastos del mes;
- Ingresos del mes;
- Meta en curso.

No cambiar su estructura, tamaños ni tipografía salvo que el usuario lo solicite.

### Tipografía

La identidad aprobada utiliza:
- Outfit para títulos y destacados;
- Nunito Sans para interfaz y contenido;
- Outfit ExtraBold para el wordmark cuando corresponda.

No sustituir familias tipográficas ni cambiar tamaños globales por iniciativa propia.

Si el usuario pide aumentar el tamaño de fuente, hacerlo de forma localizada y proporcional, sin alterar innecesariamente el resto de la interfaz.

### Colores

Paleta principal aprobada:
- Forest Green: `#285E45`
- Soft Green: `#A9D29A`
- Cream: `#F3F6EF`
- Graphite: `#26342B`
- Sage: `#E4EDE1`
- White: `#FFFFFF`

Usar los colores del mockup y de la identidad de Verdia. No introducir colores arbitrarios.

### Fondo y decoración

Las hojas/enredaderas son decoración secundaria.

Si se utilizan:
- deben permanecer en el fondo;
- no deben formar parte del contenedor de una tarjeta;
- no deben tapar texto ni controles;
- no deben provocar scroll horizontal o vertical;
- deben tener presencia sutil;
- deben respetar la composición del mockup.

No crear figuras de hojas mediante CSS improvisado si existe un asset apropiado.

### Responsive

Desktop:
- sidebar fija;
- dashboard modular;
- tarjetas y bloques aprovechan el ancho disponible;
- evitar espacios vacíos innecesarios;
- no forzar scroll vertical cuando el contenido cabe en el viewport.

Mobile:
- no comprimir simplemente el desktop;
- adaptar la composición;
- priorizar lectura y controles táctiles.

## Principio de no regresión visual

Antes de entregar una modificación, responder internamente:

> ¿Qué partes del dashboard estaban bien antes de este cambio?

Esas partes deben conservarse.

Un cambio solicitado en:
- tarjetas superiores

no autoriza cambios en:
- sidebar;
- saludo;
- Vera;
- resumen mensual;
- presupuesto;
- movimientos;
- accesos rápidos;
- fondo;
- tipografía general.

Un cambio solicitado en:
- fondo/enredadera

no autoriza cambios en:
- tarjetas;
- fuentes;
- colores de contenido;
- dimensiones del dashboard.

## Evidencia y comprobación

No afirmar que el resultado es "idéntico" sin compararlo visualmente.

Cuando haya una referencia gráfica:
- comparar proporciones;
- comparar alineaciones;
- comparar espacios;
- comparar tamaños relativos;
- comparar colores;
- comparar jerarquía visual.

Si no se puede comprobar una parte, decirlo.

## Regla para cambios futuros

Ante cualquier nueva instrucción visual:

**1. Último estado bueno → 2. Mockup/referencia → 3. Alcance exacto → 4. Cambio mínimo → 5. Verificación → 6. No regresión.**

La prioridad no es hacer el dashboard "más bonito" según criterio del agente.

La prioridad es:

**hacer exactamente el cambio solicitado y preservar todo lo que ya estaba correcto.**

### Selectores desplegables

Los dropdowns nuevos del dashboard deben reutilizar el componente `frontend/src/components/CustomSelect/CustomSelect.jsx` y sus estilos, en lugar de usar directamente el `<select>` nativo, cuando el diseño requiera el estilo visual de Verdia. El objetivo es mantener una apariencia consistente entre filtros de mes/año y futuros selectores. El componente debe conservar accesibilidad básica, cierre con Escape y cierre al hacer clic fuera.

## Sistema de color por categorías

Las categorías deben tener colores semánticos consistentes en toda Verdia. El color asignado a una categoría no debe cambiar arbitrariamente entre pantallas.

### Categorías de gastos

| Categoría | Color | HEX |
|---|---|---|
| Alimentación | Verde oliva | `#6FAF7A` |
| Transporte | Azul | `#5B8DEF` |
| Vivienda | Verde azulado | `#3E9B8F` |
| Servicios | Violeta | `#8B72D8` |
| Salud | Coral | `#D96B6B` |
| Compras | Naranja | `#E49A52` |
| Entretenimiento | Morado | `#9A6DD7` |
| Educación | Índigo | `#6574C4` |
| Otros | Gris verdoso | `#7D8F86` |

### Deudas

Las deudas deben reutilizar los colores semánticos de las categorías de gastos cuando exista una categoría asociada.

Por ejemplo:
- una deuda relacionada con servicios utiliza el color de Servicios;
- una deuda relacionada con compras utiliza el color de Compras;
- una deuda relacionada con salud utiliza el color de Salud.

No crear una paleta independiente para deudas si la deuda ya puede asociarse a una categoría existente.

### Categorías de metas

Las metas utilizan una paleta propia, compatible con la identidad visual de Verdia.

| Tipo de meta | Color | HEX |
|---|---|---|
| Viajes | Azul cielo | `#5B9BD5` |
| Emergencias | Verde | `#6FAF7A` |
| Vivienda | Verde azulado | `#3E9B8F` |
| Educación | Violeta | `#8B72D8` |
| Tecnología | Índigo | `#6574C4` |
| Vehículo | Naranja | `#E49A52` |
| Bienestar / Salud | Coral | `#D96B6B` |
| Otros | Verde salvia | `#8FAF9A` |

### Reglas de uso de color

- Los colores de categoría son semánticos y deben permanecer consistentes entre páginas.
- El color no debe ser el único indicador del significado; siempre debe acompañarse de texto, icono u otra señal visual.
- Los colores deben utilizarse principalmente en iconos, fondos suaves, bordes, indicadores de progreso y acentos.
- Evitar utilizar colores saturados como fondo completo de tarjetas de contenido financiero.
- Las acciones principales de Verdia continúan utilizando el Verde Bosque `#285E45`.
- El color de progreso general continúa siendo Verde Suave `#A9D29A`.
- Esta paleta complementa, no reemplaza, la identidad cromática principal de Verdia.
- No modificar los colores de la identidad principal para resolver la diferenciación de categorías.

### Tokens CSS recomendados

```css
:root {
  --category-food: #6FAF7A;
  --category-transport: #5B8DEF;
  --category-housing: #3E9B8F;
  --category-services: #8B72D8;
  --category-health: #D96B6B;
  --category-shopping: #E49A52;
  --category-entertainment: #9A6DD7;
  --category-education: #6574C4;
  --category-other: #7D8F86;

  --goal-travel: #5B9BD5;
  --goal-emergency: #6FAF7A;
  --goal-housing: #3E9B8F;
  --goal-education: #8B72D8;
  --goal-technology: #6574C4;
  --goal-vehicle: #E49A52;
  --goal-wellbeing: #D96B6B;
  --goal-other: #8FAF9A;
}
```

### Alcance del sistema de categorías

Estas reglas afectan la representación visual de categorías, deudas relacionadas y metas.

No modifican:
- el modelo financiero;
- los cálculos;
- los saldos;
- los movimientos;
- las reglas de negocio;
- las rutas;
- la estructura de datos.

## Regla de trabajo de programación visual

Verdia se está **programando**, no generando imágenes.

Las capturas y mockups entregados por el usuario son referencias visuales para implementar en código. No generar imágenes, renders ni recreaciones visuales salvo que el usuario lo solicite explícitamente.

Cuando el usuario pida un cambio de interfaz:
- modificar código existente;
- mantener la arquitectura existente;
- entregar cambios verificables en el frontend;
- no sustituir una implementación por una imagen;
- no crear una nueva imagen como respuesta a una solicitud de programación.

## Alcance por pantalla

Cuando el usuario indique una pantalla específica, trabajar únicamente sobre esa pantalla y sus dependencias técnicas inevitables.

Ejemplos:
- "vamos con Presupuestos" → no modificar Tarjetas, Deudas, Metas, Dashboard u otras pantallas;
- "vamos con Tarjetas" → no modificar Presupuestos, Deudas, Metas u otras pantallas;
- "vamos con Deudas" → no modificar Tarjetas, Presupuestos, Metas u otras pantallas;
- "vamos con Metas" → no modificar las demás pantallas.

Las mejoras de componentes compartidos solo deben hacerse cuando sean necesarias y se debe advertir si pueden producir cambios visibles en otras pantallas.
