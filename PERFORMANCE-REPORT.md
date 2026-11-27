# Verdia — optimización de rendimiento y accesibilidad

## Diagnóstico previo

- La carga inicial importaba de forma estática las 27 páginas desde `src/app/App.jsx`. Eso hacía que el grafo de rutas completo fuese candidato al bundle inicial aunque la persona visitara una sola pantalla.
- `Accounts.css` y `Movements.css` contenían varias transiciones que animaban `width`, `height`, `padding`, `gap` y otras propiedades de layout. Son más costosas que `transform`/`opacity` y pueden provocar trabajo de layout al interactuar.
- Se encontraron animaciones CSS en Vera, FeatureExplorer y HelpSection sin una política global de reducción de movimiento.
- El botón de acciones ya tenía reglas duplicadas; se centralizó previamente en `src/styles/actionButtons.css`.
- El `Modal` original no usaba portal ni gestión explícita de foco.
- El contraste de `--color-muted: #718078` sobre `#F3F6EF` era aproximadamente 3.80:1, por debajo de 4.5:1. Se oscureció a `#5E6C64` (~5.06:1).

## Cambios aplicados

1. Rutas con `React.lazy` + `Suspense` para páginas de usuario y administración.
2. `frontend/vite.config.js` con `manualChunks` para React/React Router y soporte de vendor chunks para GSAP/Motion/Spring si se incorporan.
3. Estado de carga accesible y simple.
4. `src/hooks/useMovimiento.js` con soporte para `prefers-reduced-motion` y `data-movimiento="reducido"`.
5. Política CSS global de reducción de movimiento.
6. `Vera.jsx` evita el temporizador de estado animado cuando se prefiere menos movimiento.
7. Imágenes de Vera con `width`/`height` explícitos.
8. Modal mediante `createPortal`, foco inicial, retorno de foco, Escape y trampa de Tab.
9. Foco visible global y zonas táctiles ampliadas para botones de acciones en dispositivos táctiles.
10. Backend: cabeceras de seguridad, CSP configurable para el entorno local, rate limit básico de login y migración de sesión de frontend para no persistir el token en `localStorage`; la sesión viaja por cookie `HttpOnly` y las solicitudes mutantes usan protección CSRF.
11. Contraste mejorado en colores de texto detectados por debajo de 4.5:1.

## Medición

La medición de bundle real no pudo completarse en este entorno:

- `npm run build`: **no ejecutable** porque la copia de dependencias disponible no contiene el binario `vite`.
- `npm ci`: intentado, pero el entorno no pudo completar la descarga de dependencias antes del límite de ejecución.
- Por tanto, **no se reporta un tamaño gzip de bundle inicial antes/después inventado**.

Como referencia estática, antes de la separación por rutas, el código fuente de las 27 páginas suma aproximadamente 140.9 KB y 33.5 KB gzip al concatenarlo como texto. Después de convertir las páginas a `React.lazy`, ese código deja de ser una importación estática del módulo de rutas. Esta cifra **no equivale al bundle Vite inicial** y no debe usarse como sustituto de Lighthouse/Rollup.

## Pruebas

- Backend JavaScript: `node --check` en los archivos modificados de seguridad/auth/routes: **OK**.
- `npm run build`: **pendiente por falta de `vite` ejecutable**.
- `npm run lint`: **no disponible en el proyecto original**.
- `npm test`: **no disponible en el proyecto original**; no se añadieron dependencias de Vitest/Testing Library porque el entorno no pudo instalar paquetes y no sería correcto afirmar que están ejecutados.
- Playwright/axe: **no ejecutados** por la misma limitación de dependencias.

## Pendientes explícitos

- Añadir y ejecutar Vitest + Testing Library + Playwright + axe cuando el entorno pueda instalar dependencias.
- Medir bundle gzip real de Vite y comparar con el objetivo de ~100 KB gzip.
- Auditar todas las imágenes restantes para dimensiones intrínsecas.
- Revisar y migrar las animaciones existentes que todavía dependan de cambios de layout si se decide conservarlas.
- Completar una auditoría integral de CSP para producción y de permisos backend por endpoint.

No se presentan como completados los puntos que no pudieron verificarse de forma real.
