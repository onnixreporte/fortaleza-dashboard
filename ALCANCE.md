# DOCUMENTO DE ALCANCE DEL PROYECTO

**Nombre del proyecto:** Dashboard Fortaleza

**Cliente:** Fortaleza

**Solicitante:** [Nombre] | **Versión:** 1.0

**Dashboard de analytics para conversaciones y métricas de atención al cliente, integrado con Botmaker API v2.**

---

## 1. Introducción

El presente documento establece el alcance funcional para el desarrollo del Dashboard Fortaleza, una aplicación web de analytics que permite visualizar y analizar conversaciones, métricas de agentes y tipificaciones provenientes de la plataforma Botmaker. El desarrollo se realiza sobre Next.js (App Router), utilizando la API v2 de Botmaker en una cuenta ya existente del CLIENTE.

---

## 2. Objetivo del Proyecto

El objetivo principal del dashboard es:

- Centralizar la visualización de métricas operativas de atención al cliente en un único panel.
- Permitir el seguimiento de conversaciones, agentes activos, tiempos de respuesta y tipificaciones de cierre.
- Facilitar el análisis de motivos de inversión y pautas publicitarias consultadas por los clientes.
- Ofrecer exportación de datos en formato CSV para análisis externo.

---

## 3. Alcance Funcional

### 3.1 Secciones del dashboard

| Sección        | Ruta            | Descripción                                                                 |
|----------------|-----------------|-----------------------------------------------------------------------------|
| General        | `/general`      | Vista resumen con KPIs, gráficos de tipificación, agentes y variables.     |
| Conversaciones | `/conversaciones` | Tabla detallada de conversaciones con búsqueda y paginación.             |

La ruta raíz (`/`) redirige automáticamente a la sección General.

### 3.2 Sección General – Visualizaciones

#### 3.2.1 Indicadores clave (KPIs)

- **Total conversaciones:** Cantidad de conversaciones en el período seleccionado.
- **Agentes activos:** Número de agentes en línea o con estado activo.
- **Promedio 1ra respuesta:** Tiempo promedio desde asignación hasta primera respuesta del operador.
- **Duración promedio del chat:** Tiempo promedio de atención por conversación.

#### 3.2.2 Gráficos y listas

- **Conversaciones por agente:** Lista ordenada por cantidad de conversaciones atendidas.
- **Tipificaciones:** Distribución de tipificaciones de cierre (gráfico de barras).
- **Motivo de inversión:** Gráfico circular (pie) basado en la variable `motivo_interes` de los chats.
- **Pauta más consultada:** Gráfico de dona basado en la variable `referralHeadline` de los chats.

#### 3.2.3 Exportación

- Botón **Exportar CSV** que descarga las métricas de agentes con columnas: ID, Agente, Email, Estado, Tipificación, Tiempo Atención, 1ra Respuesta.

### 3.3 Sección Conversaciones – Visualizaciones

#### 3.3.1 Tabla de conversaciones

Columnas mostradas:

| Columna           | Descripción                                      |
|-------------------|--------------------------------------------------|
| Nombre del cliente| Nombre del contacto (firstName + lastName)       |
| Agente que atendió| Nombre del agente asignado                       |
| Motivo de inversión| Variable `motivo_interes`                       |
| Gráfica / Pauta   | Variable `referralHeadline`                      |
| Link              | Enlace externo a la conversación en Botmaker     |
| Tipificación de cierre | Tipificación de la sesión                    |
| 1ra respuesta     | Tiempo hasta primera respuesta del operador      |
| Duración prom.    | Duración promedio del chat                       |

#### 3.3.2 Funcionalidad de la tabla

- **Búsqueda:** Campo de búsqueda que filtra por nombre del cliente, agente, motivo, tipificación o pauta.
- **Paginación:** 20 registros por página con controles anterior/siguiente.
- **Exportación CSV:** Botón para descargar las filas visibles con las columnas: ID, Cliente, Agente, Motivo, Pauta, Tipificación, 1ra Respuesta, Duración, Link Conversación.

### 3.4 Sistema de filtros

- **Filtro de fechas:** Barra de filtros con presets:
  - Hoy
  - Ayer
  - Últimos 7 días
  - Este mes
  - Personalizado (rango desde/hasta con inputs `datetime-local`)

- **Zona horaria:** Cálculos basados en zona horaria `America/Asuncion` (Paraguay).

- **Búsqueda de largo plazo:** Para rangos mayores a 24 horas se utiliza el parámetro `long-term-search` de la API de Botmaker.

### 3.5 Funcionalidad técnica

- **APIs proxy:** Rutas Next.js que consumen Botmaker API v2 y exponen los datos al frontend:
  - `/api/chats` – Chats con mensajes (parámetros: `from`, `to`, `long-term-search`, `nextPage`).
  - `/api/agents` – Lista de agentes (paginación).
  - `/api/agent-metrics` – Métricas por agente (parámetros: `from`, `to`, `session-status`, `nextPage`).

- **Refresco:** Botón de refrescar datos en la barra superior para recargar la información sin recargar la página.

- **Estados:** Indicadores de carga y mensajes de error ante fallos de API.

---

## 4. Fuente de Datos

- **API:** Botmaker API v2 (`https://api.botmaker.com/v2.0/chats` y endpoints relacionados).
- **Autenticación:** Token de acceso mediante variable de entorno `BOTMAKER_ACCESS_TOKEN` (header `access-token`).
- **Variables de chat utilizadas:**
  - `motivo_interes`: motivo de inversión.
  - `referralHeadline`: pauta / gráfica consultada.

---

## 5. Limitaciones

- El dashboard no incluye autenticación de usuarios; el acceso se controla fuera del alcance (por ejemplo, por hosting o VPN).
- No se incluye gestión de múltiples cuentas de Botmaker; se asume una única cuenta configurada por token.
- La exportación CSV es limitada a los datos cargados en memoria; no se incluye exportación masiva de datos históricos.
- No se incluye almacenamiento persistente de datos; toda la información se obtiene en tiempo real desde la API.

---

## 6. Alcance Fuera del Proyecto

Se considera fuera de alcance:

- Desarrollo de bots conversacionales o flujos de conversación.
- Integración con sistemas CRM o bases de datos externas distintas a Botmaker.
- Módulo de autenticación y gestión de usuarios.
- Reportes programados o envío automático.
- Dashboard móvil nativo o aplicación móvil.
- Soporte para APIs distintas a Botmaker v2.

---

## 7. Entregables

- Código fuente del dashboard (Next.js, React, TypeScript).
- Aplicación web desplegable con las secciones General y Conversaciones.
- Configuración de variables de entorno (ej. `BOTMAKER_ACCESS_TOKEN`).
- Documentación básica de despliegue (si aplica).

---

## 8. Tabla de Costos

| Concepto | Monto (GS) |
|----------|-------------|
| Desarrollo de Dashboard Fase 1 Fortaleza | 3.600.000 |
| **Subtotal** | **3.600.000** |
| IVA 10% | 360.000 |
| **Total** | **3.960.000** |

**Detalle:** 12 horas × 300.000 GS/hora = 3.600.000 GS

---

## 9. Aceptación

Las partes declaran haber leído, comprendido y aceptado el alcance funcional detallado en el presente documento correspondiente al desarrollo del Dashboard Fortaleza.

Cualquier modificación o ampliación del presente alcance deberá formalizarse por escrito y contar con la aprobación expresa de ambas partes.

Firmado en _______________, ___ / ___ / _____.

_________________________                    _________________________
EL CLIENTE                                    EL PROVEEDOR
