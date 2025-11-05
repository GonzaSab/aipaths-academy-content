---
title: "Comenzando con Claude AI"
description: "Aprende cómo integrar Claude AI en tus aplicaciones con ejemplos prácticos y mejores prácticas"
category: "claude"
order: 1
published: true
lastUpdated: "2025-01-05"
author: "AIPaths Academy"
tags: ["claude", "getting-started", "beginner", "api"]
---

# Comenzando con Claude AI

Claude es el asistente de IA de Anthropic diseñado para ser útil, inofensivo y honesto. Esta guía te ayudará a comenzar a integrar Claude en tus aplicaciones.

## Prerequisitos

Antes de comenzar, necesitarás:

- Una API key de Claude desde [Anthropic Console](https://console.anthropic.com)
- Node.js 18+ o Python 3.8+ instalado
- Conocimientos básicos de patrones async/await
- 15 minutos de tu tiempo

## Inicio Rápido

### 1. Instalar el SDK

**JavaScript/TypeScript:**
```bash
npm install @anthropic-ai/sdk
```

**Python:**
```bash
pip install anthropic
```

### 2. Configurar tu API Key

Crea un archivo `.env`:
```bash
ANTHROPIC_API_KEY=tu_api_key_aqui
```

### 3. Tu Primera Request

Aquí hay un ejemplo mínimo para comenzar:

**JavaScript:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function chat(message: string) {
  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      { role: 'user', content: message }
    ],
  });

  return response.content[0].text;
}

// Uso
const answer = await chat('Explica la computación cuántica en términos simples');
console.log(answer);
```

Ver el [ejemplo completo](./examples/basic-chat.js) para más detalles.

**Python:**
```python
import anthropic
import os

client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

def chat(message: str) -> str:
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[
            {"role": "user", "content": message}
        ]
    )

    return response.content[0].text

# Uso
answer = chat("Explica la computación cuántica en términos simples")
print(answer)
```

## Conceptos Clave

### Modelos

Claude ofrece varios modelos optimizados para diferentes casos de uso:

| Modelo | Mejor Para | Ventana de Contexto |
|--------|------------|---------------------|
| `claude-3-5-sonnet-20241022` | Rendimiento balanceado | 200K tokens |
| `claude-3-opus-20240229` | Tareas complejas | 200K tokens |
| `claude-3-haiku-20240307` | Velocidad y eficiencia de costo | 200K tokens |

### Formato de Mensajes

Claude utiliza un array de mensajes donde cada mensaje tiene:
- `role`: Ya sea `"user"` o `"assistant"`
- `content`: El texto del mensaje

```typescript
const messages = [
  { role: 'user', content: '¡Hola!' },
  { role: 'assistant', content: '¡Hola! ¿Cómo puedo ayudarte hoy?' },
  { role: 'user', content: 'Explica la IA en términos simples' },
];
```

### Respuestas en Streaming

Para obtener output en tiempo real, usa streaming:

```typescript
const stream = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Cuéntame una historia' }],
  stream: true,
});

for await (const event of stream) {
  if (event.type === 'content_block_delta') {
    process.stdout.write(event.delta.text);
  }
}
```

Ver el [ejemplo de streaming](./examples/streaming-response.ts) para una implementación completa.

## Mejores Prácticas

### 1. Manejar Errores con Gracia

```typescript
try {
  const response = await client.messages.create({...});
} catch (error) {
  if (error instanceof Anthropic.APIError) {
    console.error('Error de API:', error.message);
    // Manejar límites de tasa, requests inválidos, etc.
  } else {
    console.error('Error inesperado:', error);
  }
}
```

### 2. Usar System Prompts

Guía el comportamiento de Claude con system prompts:

```typescript
const response = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: 'Eres un asistente de programación útil. Proporciona ejemplos de código claros y concisos.',
  messages: [
    { role: 'user', content: '¿Cómo ordeno un array en JavaScript?' }
  ],
});
```

### 3. Administrar el Uso de Tokens

Monitorea y controla el consumo de tokens:

```typescript
const response = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 500, // Limitar la longitud de la respuesta
  messages: [{ role: 'user', content: 'Resumen breve de IA' }],
});

console.log('Tokens usados:', response.usage);
// Output: { input_tokens: 12, output_tokens: 87 }
```

## Casos de Uso Comunes

### Chatbot

Construye una interfaz conversacional:
- [Ejemplo de Chatbot Simple](./examples/simple-chatbot.ts)
- [Chatbot con Memoria](./examples/chatbot-with-memory.ts)

### Generación de Contenido

Genera artículos, resúmenes o contenido creativo:
- [Generador de Posts de Blog](./examples/blog-generator.ts)
- [Generador de Documentación de Código](./examples/doc-generator.ts)

### Análisis de Datos

Analiza y extrae insights de texto:
- [Análisis de Sentimiento](./examples/sentiment-analysis.ts)
- [Extracción de Entidades](./examples/entity-extraction.ts)

## Solución de Problemas

### Error "Invalid API Key"

- Verifica que tu API key sea correcta
- Confirma que la variable de entorno `ANTHROPIC_API_KEY` esté configurada
- Asegúrate de que no haya espacios antes o después de la key

### Errores de Rate Limit

- Implementa exponential backoff
- Considera cachear respuestas comunes
- Actualiza tu tier de API si es necesario

### Problemas de Timeout

- Aumenta la configuración de timeout
- Usa streaming para respuestas largas
- Divide requests grandes en chunks más pequeños

## Próximos Pasos

Ahora que estás configurado:

1. **Explora Funcionalidades Avanzadas**
   - [Mejores Prácticas de Prompt Engineering](/docs/claude/prompt-engineering)
   - [Usando Tools y Function Calling](/docs/claude/tools)
   - [Capacidades de Visión](/docs/claude/vision)

2. **Construye Algo**
   - [Tutorial: Construye un Asistente CLI](/blog/es/build-cli-assistant-claude)
   - [Tutorial: Crea un Bot de Base de Conocimiento](/blog/es/knowledge-base-bot)

3. **Únete a la Comunidad**
   - [Discord](https://discord.gg/anthropic)
   - [GitHub Discussions](https://github.com/GonzaSab/aipaths-academy-content/discussions)

## Recursos Adicionales

- [Documentación Oficial de Anthropic](https://docs.anthropic.com)
- [Referencia de API](https://docs.anthropic.com/en/api)
- [Precios](https://www.anthropic.com/pricing)
- [Página de Estado](https://status.anthropic.com)

---

**¿Preguntas?** Abre un [issue](https://github.com/GonzaSab/aipaths-academy-content/issues) o únete a las discusiones de nuestra comunidad!
