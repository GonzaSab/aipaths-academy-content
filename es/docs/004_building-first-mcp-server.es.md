---
title: "Construyendo Tu Primer Servidor MCP: Guía Completa"
description: "Aprende cómo construir servidores Model Context Protocol (MCP) para extender las capacidades de Claude con herramientas y fuentes de datos personalizadas."
tags: ["mcp", "claude", "model-context-protocol", "herramientas", "intermedio"]
published: false
lastUpdated: "2025-11-05"
author: "AIPaths Academy"
---

# Construyendo Tu Primer Servidor MCP: Guía Completa

Si has estado trabajando con Claude y quieres extender sus capacidades con herramientas personalizadas, fuentes de datos o integraciones, el Model Context Protocol (MCP) es tu respuesta. MCP es un protocolo abierto que estandariza cómo las aplicaciones de IA se conectan a sistemas externos—piénsalo como un puerto USB-C para IA.

En esta guía, aprenderás qué es MCP, cómo funciona, y construirás tu primer servidor MCP desde cero. Al final, tendrás un servidor de clima funcional que Claude puede usar para obtener datos meteorológicos en tiempo real.

## ¿Qué es MCP?

**Model Context Protocol (MCP)** es un estándar abierto que permite a las aplicaciones de IA conectarse de manera segura a fuentes de datos externas, herramientas y servicios. Creado por Anthropic, MCP resuelve un problema crítico: cómo dar a los modelos de IA acceso a datos y funcionalidad del mundo real sin reconstruir integraciones para cada caso de uso.

### Por Qué Importa MCP

Antes de MCP, cada aplicación de IA tenía que construir integraciones personalizadas para cada fuente de datos o herramienta. Esto significaba:
- Esfuerzo duplicado entre proyectos
- Prácticas de seguridad inconsistentes
- Integraciones difíciles de mantener
- Interoperabilidad limitada

**MCP proporciona:**
- **Estandarización**: Un protocolo para todas las integraciones
- **Seguridad**: Autenticación y autorización integradas
- **Flexibilidad**: Funciona con cualquier fuente de datos o herramienta
- **Interoperabilidad**: Construye una vez, usa en todas partes

### Casos de Uso del Mundo Real

- **Acceso a Datos Empresariales**: Conecta Claude a bases de datos internas, APIs y bases de conocimiento
- **Herramientas Personalizadas**: Da a Claude la capacidad de ejecutar funciones específicas de dominio
- **Sistemas de Archivos**: Permite a Claude leer y escribir archivos de manera segura
- **APIs Externas**: Integra servicios meteorológicos, sistemas de pago, CRMs y más
- **Herramientas de Desarrollo**: Operaciones Git, análisis de código, frameworks de testing

## Prerrequisitos

Antes de comenzar, asegúrate de tener:

- **Node.js 18+** o **Python 3.8+** instalado
- Conocimiento básico de JavaScript/TypeScript o Python
- Un editor de texto (VS Code recomendado)
- Claude for Desktop (opcional, para pruebas)
- 30 minutos de tu tiempo

**Nivel de Habilidad:** Intermedio
**Tiempo Requerido:** 30-45 minutos

## Entendiendo la Arquitectura MCP

MCP sigue una **arquitectura cliente-servidor** donde:

1. **MCP Host**: La aplicación de IA (como Claude for Desktop)
2. **MCP Client**: Gestiona conexiones a servidores (se ejecuta dentro del host)
3. **MCP Server**: Proporciona recursos, herramientas o prompts a la IA

```
┌─────────────────────────────────────┐
│       MCP Host (Claude)             │
│  ┌────────────────────────────────┐ │
│  │    Gestor de Clientes MCP     │ │
│  │  ┌──────┐  ┌──────┐  ┌──────┐ │ │
│  │  │Client│  │Client│  │Client│ │ │
│  │  └───┬──┘  └───┬──┘  └───┬──┘ │ │
│  └──────┼─────────┼─────────┼────┘ │
└─────────┼─────────┼─────────┼──────┘
          │         │         │
          ▼         ▼         ▼
     ┌────────┐┌────────┐┌────────┐
     │Servidor││Sistema ││GitHub│
     │Clima   ││Archivos││Server │
     └────────┘└────────┘└────────┘
```

### Conceptos Clave

**Resources (Recursos)**: Datos o contenido que Claude puede leer (archivos, registros de base de datos, respuestas de API)

**Tools (Herramientas)**: Funciones que Claude puede ejecutar (buscar, calcular, llamadas a API)

**Prompts**: Plantillas de prompts predefinidas para tareas comunes

**Transport (Transporte)**: Canal de comunicación entre cliente y servidor (típicamente STDIO o HTTP)

## Construyendo un Servidor MCP de Clima

Construyamos un servidor MCP práctico que proporciona información meteorológica usando la API del National Weather Service.

### Paso 1: Configuración del Proyecto

Crea un nuevo directorio para el proyecto:

```bash
# Crear directorio del proyecto
mkdir weather-mcp-server
cd weather-mcp-server

# Inicializar proyecto npm
npm init -y

# Instalar dependencias
npm install @modelcontextprotocol/sdk zod
npm install -D @types/node typescript

# Crear directorio de código fuente
mkdir src
touch src/index.ts
```

Crea un `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

### Paso 2: Inicializar el Servidor MCP

Crea `src/index.ts` y configura el servidor:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-mcp-server/1.0";

// Crear instancia del servidor
const server = new Server(
  {
    name: "weather-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

console.error("Servidor MCP de Clima iniciando...");
```

> **Nota**: Usamos `console.error()` en lugar de `console.log()` porque los servidores MCP se comunican vía STDIO, y `stdout` está reservado para mensajes JSON-RPC.

### Paso 3: Definir Esquemas de Herramientas

Define la estructura para nuestras herramientas de clima usando Zod:

```typescript
// Esquemas de entrada de herramientas
const GetForecastSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const GetAlertsSchema = z.object({
  state: z.string().length(2).describe("Código de estado de dos letras (ej., CA, NY)"),
});

// Función auxiliar para hacer peticiones a la API
async function fetchWeatherData(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Error de API del clima: ${response.statusText}`);
  }

  return response.json();
}
```

### Paso 4: Implementar Manejadores de Herramientas

Registra las herramientas que Claude puede llamar:

```typescript
// Manejar peticiones de lista de herramientas
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_forecast",
        description: "Obtener pronóstico del tiempo para una ubicación por latitud y longitud",
        inputSchema: {
          type: "object",
          properties: {
            latitude: {
              type: "number",
              description: "Latitud de la ubicación",
              minimum: -90,
              maximum: 90,
            },
            longitude: {
              type: "number",
              description: "Longitud de la ubicación",
              minimum: -180,
              maximum: 180,
            },
          },
          required: ["latitude", "longitude"],
        },
      },
      {
        name: "get_alerts",
        description: "Obtener alertas meteorológicas activas para un estado de EE.UU.",
        inputSchema: {
          type: "object",
          properties: {
            state: {
              type: "string",
              description: "Código de estado de EE.UU. de dos letras (ej., CA, NY)",
              pattern: "^[A-Z]{2}$",
            },
          },
          required: ["state"],
        },
      },
    ],
  };
});

// Manejar ejecución de herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get_forecast") {
      const { latitude, longitude } = GetForecastSchema.parse(args);

      // Obtener datos de gridpoint
      const pointsUrl = `${NWS_API_BASE}/points/${latitude},${longitude}`;
      const pointsData = await fetchWeatherData(pointsUrl);

      // Obtener pronóstico
      const forecastUrl = pointsData.properties.forecast;
      const forecastData = await fetchWeatherData(forecastUrl);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(forecastData.properties.periods, null, 2),
          },
        ],
      };
    }

    if (name === "get_alerts") {
      const { state } = GetAlertsSchema.parse(args);

      const alertsUrl = `${NWS_API_BASE}/alerts?area=${state}`;
      const alertsData = await fetchWeatherData(alertsUrl);

      const features = alertsData.features;
      if (features.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No hay alertas meteorológicas activas para ${state}`,
            },
          ],
        };
      }

      const alerts = features.map((feature: any) => ({
        event: feature.properties.event,
        severity: feature.properties.severity,
        description: feature.properties.description,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(alerts, null, 2),
          },
        ],
      };
    }

    throw new Error(`Herramienta desconocida: ${name}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Argumentos inválidos: ${error.message}`);
    }
    throw error;
  }
});
```

### Paso 5: Iniciar el Servidor

Añade la función principal para ejecutar el servidor:

```typescript
// Iniciar servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Servidor MCP de Clima ejecutándose en stdio");
}

main().catch((error) => {
  console.error("Error fatal:", error);
  process.exit(1);
});
```

### Paso 6: Compilar y Probar

Añade scripts de compilación a `package.json`:

```json
{
  "name": "weather-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node build/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

Compila el servidor:

```bash
npm run build
```

Pruébalo usando el MCP Inspector (una herramienta de depuración):

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

Esto abre una interfaz web donde puedes probar tus herramientas interactivamente.

## Conectando a Claude for Desktop

Para usar tu servidor con Claude for Desktop:

1. **Localiza tu archivo de configuración:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Añade tu servidor:**

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/ruta/absoluta/a/weather-mcp-server/build/index.js"]
    }
  }
}
```

3. **Reinicia Claude for Desktop**

4. **Pruébalo:**
   - Abre Claude for Desktop
   - Busca el ícono 🔌 indicando que los servidores MCP están conectados
   - Pregunta: "¿Cuál es el pronóstico del tiempo para Seattle?" (latitud: 47.6062, longitud: -122.3321)

## Problemas Comunes y Soluciones

### Problema: "Servidor no se conecta"

**Causa:** Ruta incorrecta o archivos de compilación faltantes

**Solución:**
1. Asegúrate de haber ejecutado `npm run build`
2. Usa rutas absolutas en el archivo de configuración
3. Revisa los logs de Claude: `~/Library/Logs/Claude/mcp*.log`

### Problema: "Herramienta no encontrada"

**Causa:** El servidor no registró las herramientas correctamente

**Solución:**
1. Verifica que el manejador `ListToolsRequestSchema` esté configurado
2. Revisa los logs del servidor en busca de errores
3. Prueba primero con MCP Inspector

### Problema: "Errores de API"

**Causa:** Coordenadas inválidas o problemas de red

**Solución:**
1. Valida los rangos de latitud/longitud
2. Verifica tu conexión a internet
3. La API de NWS solo funciona para ubicaciones en EE.UU.

## Mejores Prácticas

### 1. **Siempre Valida la Entrada**

Usa Zod o bibliotecas similares para validar argumentos de herramientas:

```typescript
const args = MySchema.parse(request.params.arguments);
```

### 2. **Proporciona Descripciones Claras**

Las descripciones de herramientas y parámetros ayudan a Claude a entender cuándo y cómo usarlas:

```typescript
{
  name: "search_database",
  description: "Buscar en la base de datos de clientes por email o ID. Devuelve detalles del cliente.",
  inputSchema: {
    // ...
  }
}
```

### 3. **Maneja Errores con Gracia**

Devuelve mensajes de error significativos:

```typescript
try {
  // Lógica de la herramienta
} catch (error) {
  return {
    content: [{
      type: "text",
      text: `Error: ${error.message}. Por favor verifica tu entrada.`
    }],
    isError: true,
  };
}
```

### 4. **Usa el Logging Sabiamente**

Siempre registra en `stderr` en servidores STDIO:

```typescript
console.error("Procesando petición:", request.params.name);
```

### 5. **Implementa Limitación de Tasa**

Protege las APIs externas del abuso:

```typescript
let lastRequest = 0;
const MIN_INTERVAL = 1000; // 1 segundo

if (Date.now() - lastRequest < MIN_INTERVAL) {
  throw new Error("Límite de tasa excedido");
}
lastRequest = Date.now();
```

## Características Avanzadas

### Resources (Recursos)

Expone datos que Claude puede leer:

```typescript
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "weather://alerts",
        name: "Alertas Meteorológicas Activas",
        mimeType: "application/json",
      },
    ],
  };
});
```

### Prompts

Proporciona plantillas de prompts:

```typescript
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "weather_report",
        description: "Generar un reporte meteorológico detallado",
        arguments: [
          {
            name: "location",
            description: "Nombre de la ciudad",
            required: true,
          },
        ],
      },
    ],
  };
});
```

### Notificaciones de Progreso

Envía actualizaciones de progreso para operaciones de larga duración:

```typescript
server.notification({
  method: "notifications/progress",
  params: {
    progress: 50,
    total: 100,
  },
});
```

## Alternativa en Python

¿Prefieres Python? Aquí está la configuración equivalente:

```bash
# Crear proyecto
mkdir weather-mcp-server
cd weather-mcp-server

# Instalar dependencias
pip install mcp

# Crear servidor
touch server.py
```

Estructura básica del servidor en Python:

```python
from mcp.server import Server, Tool
from mcp.server.stdio import stdio_server
import httpx

app = Server("weather-server")

@app.tool()
async def get_forecast(latitude: float, longitude: float) -> str:
    """Obtener pronóstico del tiempo para coordenadas"""
    async with httpx.AsyncClient() as client:
        # Obtener y devolver datos del clima
        pass

async def main():
    async with stdio_server() as (read, write):
        await app.run(read, write)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

## Próximos Pasos

Ahora que has construido tu primer servidor MCP, explora:

1. **Construye Más Herramientas**: Crea servidores para tus casos de uso específicos
2. **Explora Servidores Oficiales**: Estudia los repositorios de [@modelcontextprotocol](https://github.com/modelcontextprotocol)
3. **Añade Autenticación**: Implementa manejo seguro de claves API
4. **Despliega Remotamente**: Configura transporte HTTP para servidores remotos
5. **Contribuye**: Comparte tus servidores con la comunidad

**Ejemplos Populares de Servidores MCP:**
- [@modelcontextprotocol/server-filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) - Operaciones con archivos
- [@modelcontextprotocol/server-github](https://github.com/modelcontextprotocol/servers/tree/main/src/github) - Integración con GitHub
- [@modelcontextprotocol/server-memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - Memoria persistente

## Recursos Adicionales

### Documentación Oficial
- [Especificación MCP](https://spec.modelcontextprotocol.io/)
- [Documentación del SDK de MCP](https://github.com/modelcontextprotocol/typescript-sdk)
- [Servidores MCP Oficiales](https://github.com/modelcontextprotocol/servers)

### Herramientas
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) - Depurar servidores MCP
- [Claude for Desktop](https://claude.ai/download) - Prueba tus servidores

### Comunidad
- [Discusiones de GitHub sobre MCP](https://github.com/modelcontextprotocol/specification/discussions)
- [Discord de Anthropic](https://discord.gg/anthropic) - canal #mcp

---

**¿Preguntas?** ¡Abre un issue o únete a nuestras discusiones comunitarias!
