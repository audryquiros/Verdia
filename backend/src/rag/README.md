# RAG de Verdia — Google Drive + Google Cloud

El RAG de Verdia utiliza **Google Drive como origen documental** y **Google Cloud como infraestructura del procesamiento y recuperación RAG**.

El RAG es un módulo de Verdia y sirve principalmente como infraestructura para Vera y otros módulos que necesiten consultar documentos.

## Arquitectura conceptual

```text
Google Drive
    ↓
Ingesta / sincronización documental
    ↓
Google Cloud
    ├── procesamiento / extracción
    ├── generación de representaciones
    ├── índice / recuperación
    └── servicios de IA
    ↓
Contexto recuperado
    ↓
Vera / aplicación
    ↓
Respuesta + fuentes
```

## Principios

- Google Drive es el origen de los documentos.
- Google Cloud aloja la infraestructura RAG.
- El RAG no es el producto completo; es un módulo de Verdia.
- Los documentos y fragmentos deben respetar el aislamiento por usuario/espacio.
- Los documentos externos se consideran contenido no confiable hasta ser procesados y validados.
- La recuperación debe devolver fuentes para que Vera pueda indicar de dónde proviene la información.
- Vera propone; el usuario confirma cualquier acción financiera.
- No se introducen PostgreSQL, pgvector ni Docker.

## Persistencia

La base MySQL de Verdia conserva la información de aplicación y metadata documental necesaria para relacionar documentos, versiones, fragmentos y espacios.

La infraestructura de búsqueda/vectorización del RAG se mantiene en Google Cloud.

Por esta razón, la arquitectura RAG no fuerza el almacenamiento vectorial dentro de MySQL.

## Flujo documental

```text
Google Drive
    ↓
detección de archivo nuevo/cambiado
    ↓
ingesta
    ↓
documento
    ↓
documento_version
    ↓
extracción de contenido
    ↓
chunking
    ↓
procesamiento RAG en Google Cloud
    ↓
indexación
```

## Flujo de consulta

```text
Usuario
   ↓
Vera
   ↓
consulta RAG
   ↓
Google Cloud
   ↓
retrieval
   ↓
fragmentos relevantes
   ↓
contexto + fuentes
   ↓
LLM
   ↓
respuesta de Vera
```

## Estado

La base deja preparada la separación entre aplicación Verdia, metadata documental en MySQL, Google Drive como origen, Google Cloud como infraestructura RAG y Vera como consumidor del contexto.

Los servicios concretos de Google Cloud (embeddings, índice/vector search, modelo, almacenamiento auxiliar, etc.) deben quedar definidos en la configuración técnica de implementación; no se inventan dentro del DER.
