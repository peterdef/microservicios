# 🎤 Guión de Presentación Oral - Microservicios

## 📋 INTRODUCCIÓN (2 minutos)

**"Buenos días/tardes a todos. Mi nombre es [TU NOMBRE] y hoy les voy a presentar mi proyecto: 'Arquitectura de Microservicios para la Gestión Integral de Publicaciones'."**

**"Este es un sistema distribuido que implementa el 100% de los requisitos especificados en el caso de estudio. La plataforma gestiona el ciclo completo de vida de publicaciones académicas y editoriales, desde la creación hasta la publicación final."**

**"La arquitectura está basada en microservicios desacoplados, con comunicación síncrona y asíncrona, base de datos distribuida con CockroachDB, y observabilidad completa con Jaeger y Prometheus."**

**"Antes de comenzar la demostración, les voy a mostrar la arquitectura general del sistema."**

---

## 🏗️ ARQUITECTURA GENERAL (3 minutos)

**"Como pueden ver en este diagrama, tenemos 6 microservicios principales:"**

**"1. El API Gateway en el puerto 8000, que actúa como punto de entrada único y maneja el enrutamiento, circuit breakers y rate limiting."**

**"2. El Auth Service en el puerto 8081, que maneja toda la autenticación OAuth2 con JWT y la gestión de roles."**

**"3. El Publicaciones Service en el puerto 8082, que es el núcleo del negocio y gestiona las publicaciones, estados y revisiones."**

**"4. El Catálogo Service en el puerto 8083, que indexa las publicaciones aprobadas y proporciona endpoints públicos para búsquedas."**

**"5. El Notificaciones Service en el puerto 8084, que maneja notificaciones multicanal: email, WebSocket, push y SMS."**

**"6. El Eureka Server en el puerto 8761, que proporciona service discovery para el registro dinámico de instancias."**

**"La infraestructura incluye CockroachDB como base de datos distribuida, RabbitMQ para mensajería asíncrona, y Jaeger para trazas distribuidas."**

**"Ahora voy a demostrar cada microservicio en funcionamiento."**

---

## 🔐 MICROSERVICIO DE AUTENTICACIÓN (3 minutos)

**"Empezamos con el Auth Service, que es fundamental para la seguridad del sistema."**

**"Este microservicio implementa OAuth2 con JWT, gestión de roles granulares, y un endpoint JWKS para validación de tokens. También incluye usuarios por defecto con credenciales alusivas al rol."**

**"Voy a mostrar cómo funciona la autenticación:"**

[EJECUTAR COMANDO]
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "autor_default", "password": "password123"}'
```

**"Como pueden ver, el sistema devuelve un JWT token que incluye información del usuario y sus roles. Este token se usará para autorizar todas las operaciones posteriores."**

**"Los roles implementados son: ROLE_AUTOR, ROLE_REVISOR, ROLE_EDITOR, ROLE_ADMIN y ROLE_LECTOR, cada uno con permisos específicos."**

**"También tenemos un endpoint JWKS para validación de tokens:"**

[EJECUTAR COMANDO]
```bash
curl http://localhost:8000/.well-known/jwks.json
```

**"Esto permite que otros servicios validen los tokens sin necesidad de compartir las claves secretas."**

---

## 📚 MICROSERVICIO DE PUBLICACIONES (5 minutos)

**"Ahora vamos al núcleo del sistema: el Publicaciones Service. Este microservicio maneja toda la lógica de negocio relacionada con las publicaciones."**

**"El modelo de dominio incluye una entidad abstracta Publicacion, con clases derivadas para Libro y Artículo. Cada publicación tiene un ciclo de vida bien definido."**

**"Los estados del ciclo de vida son: BORRADOR → EN_REVISION → CAMBIOS_SOLICITADOS → APROBADO → PUBLICADO."**

**"Voy a demostrar la creación de una publicación:"**

[EJECUTAR COMANDO]
```bash
curl -X POST http://localhost:8000/libros \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -d '{
    "titulo": "Arquitectura de Microservicios",
    "resumen": "Guía completa de implementación",
    "palabrasClave": ["java", "microservicios", "spring"],
    "isbn": "978-1234567890",
    "numeroPaginas": 250,
    "edicion": "1ra"
  }'
```

**"Como pueden ver, la publicación se crea con estado BORRADOR. Ahora voy a cambiar el estado a EN_REVISION:"**

[EJECUTAR COMANDO]
```bash
curl -X POST http://localhost:8000/estados/publicaciones/{id}/cambiar-estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -d '{
    "nuevoEstado": "EN_REVISION",
    "motivo": "Enviado para revisión editorial",
    "comentarios": "Publicación lista para revisión"
  }'
```

**"Este cambio de estado genera automáticamente un evento de dominio que se publica en RabbitMQ. El sistema mantiene un historial completo de todos los cambios."**

**"Una característica importante es la comunicación síncrona con el Auth Service usando Feign Clients para validar tokens en tiempo real y obtener información del usuario."**

---

## 🔍 MICROSERVICIO DE CATÁLOGO (2 minutos)

**"El Catálogo Service es responsable de indexar las publicaciones aprobadas y proporcionar endpoints públicos para consultas."**

**"Este microservicio consume eventos de RabbitMQ cuando una publicación es aprobada y la indexa automáticamente."**

**"Voy a mostrar el catálogo público:"**

[EJECUTAR COMANDO]
```bash
curl -X GET "http://localhost:8000/api/v1/catalogo/publicaciones"
```

**"Como pueden ver, el catálogo muestra las publicaciones aprobadas. También soporta búsquedas avanzadas:"**

[EJECUTAR COMANDO]
```bash
curl -X GET "http://localhost:8000/api/v1/catalogo/buscar?texto=microservicios"
```

**"El catálogo es completamente público y no requiere autenticación, lo que permite a los lectores acceder fácilmente a las publicaciones."**

---

## 📧 MICROSERVICIO DE NOTIFICACIONES (3 minutos)

**"El Notificaciones Service es responsable de enviar alertas multicanal cuando ocurren eventos importantes en el sistema."**

**"Soporta múltiples canales: Email, WebSocket para notificaciones en tiempo real, Push para dispositivos móviles, y SMS."**

**"Este microservicio consume eventos de RabbitMQ y envía notificaciones automáticamente. Por ejemplo, cuando una publicación es aprobada, se notifica al autor."**

**"Voy a mostrar el historial de notificaciones:"**

[EJECUTAR COMANDO]
```bash
curl -X GET http://localhost:8000/notificaciones/historial
```

**"El sistema incluye reintentos automáticos para notificaciones fallidas y prioridades configurables."**

---

## 🔄 COMUNICACIÓN Y MENSAJERÍA (3 minutos)

**"La comunicación entre microservicios es híbrida: síncrona para validaciones críticas y asíncrona para eventos de dominio."**

**"Para comunicación síncrona usamos Feign Clients. Por ejemplo, cuando el Publicaciones Service necesita validar un token, hace una llamada directa al Auth Service."**

**"Para comunicación asíncrona usamos RabbitMQ con el patrón Outbox para garantizar la entrega de eventos."**

**"Los eventos principales son: publication.submitted, publication.review.requested, publication.approved, y publication.published."**

**"Voy a mostrar la interfaz de RabbitMQ:"**

[ABRIR NAVEGADOR]
http://localhost:15672

**"Como pueden ver, tenemos el exchange 'publication.events' configurado como topic, y múltiples queues consumiendo eventos específicos."**

**"El patrón Outbox garantiza que los eventos no se pierdan, incluso si RabbitMQ no está disponible temporalmente."**

---

## 🔍 OBSERVABILIDAD (3 minutos)

**"La observabilidad es fundamental en una arquitectura de microservicios. Implementamos trazas distribuidas, métricas y logs estructurados."**

**"Para trazas distribuidas usamos Jaeger con OpenTelemetry. Voy a mostrar la interfaz:"**

[ABRIR NAVEGADOR]
http://localhost:16686

**"Como pueden ver, podemos rastrear una transacción completa a través de todos los microservicios. Esto es invaluable para debugging y monitoreo."**

**"Para métricas usamos Prometheus con Micrometer. Cada microservicio expone métricas de JVM, HTTP, base de datos y circuit breakers."**

**"Los circuit breakers están configurados para manejar fallos automáticamente. Si un servicio no responde, el sistema continúa funcionando con fallbacks."**

---

## 🛡️ SEGURIDAD Y AUTORIZACIÓN (2 minutos)

**"La seguridad está implementada con OAuth2 y JWT. Cada endpoint valida el token y verifica los roles del usuario."**

**"Los roles tienen permisos específicos: solo los autores pueden crear publicaciones, solo los editores pueden aprobar, etc."**

**"Voy a demostrar la autorización cambiando de usuario:"**

[EJECUTAR COMANDO]
```bash
curl -X POST http://localhost:8000/auth/login \
  -d '{"username": "editor_default", "password": "password123"}'
```

**"Ahora con el token de editor, puedo aprobar la publicación:"**

[EJECUTAR COMANDO]
```bash
curl -X POST http://localhost:8000/estados/publicaciones/{id}/cambiar-estado \
  -H "Authorization: Bearer {EDITOR_TOKEN}" \
  -d '{"nuevoEstado": "APROBADO", "motivo": "Aprobado por editor"}'
```

**"Como pueden ver, el sistema valida que el usuario tenga el rol de editor antes de permitir la operación."**

---

## 📊 BPMN WORKFLOW (2 minutos)

**"El flujo de trabajo está modelado con BPMN y sigue un proceso específico de revisión editorial."**

**"Los participantes son: Autor, Editor, Revisor y Sistema. Cada uno tiene responsabilidades específicas en el proceso."**

**"El flujo comienza cuando un autor crea una publicación en estado BORRADOR. Luego la envía a revisión, donde el editor asigna revisores."**

**"Los revisores evalúan la publicación y pueden solicitar cambios o recomendar aprobación. El editor toma la decisión final."**

**"Una vez aprobada, el sistema automáticamente publica la publicación en el catálogo y envía notificaciones."**

**"Este flujo está completamente automatizado y cada paso genera eventos que se propagan a través de RabbitMQ."**

---

## 🧪 TESTING Y VALIDACIÓN (2 minutos)

**"El sistema incluye health checks para todos los microservicios:"**

[EJECUTAR COMANDO]
```bash
curl http://localhost:8000/actuator/health
```

**"También tenemos tests unitarios y de integración. Los circuit breakers están configurados para manejar fallos automáticamente."**

**"El sistema es resiliente: si un microservicio falla, los otros continúan funcionando. Los circuit breakers activan fallbacks automáticos."**

---

## 📈 MÉTRICAS Y MONITOREO (1 minuto)

**"Las métricas incluyen tasa de éxito de requests, tiempo de respuesta, uso de recursos, y estado de circuit breakers."**

**"Tenemos alertas configuradas para error rates altos, tiempos de respuesta lentos, y circuit breakers abiertos."**

**"El monitoreo es integral: trazas, métricas y logs están correlacionados para facilitar el debugging."**

---

## 🎯 RESUMEN Y CONCLUSIONES (2 minutos)

**"En resumen, hemos implementado exitosamente el 100% de los requisitos especificados en el caso de estudio."**

**"La arquitectura incluye: 6 microservicios desacoplados, comunicación híbrida síncrona y asíncrona, base de datos distribuida, seguridad robusta, y observabilidad completa."**

**"Características destacadas:**
- **Comunicación Síncrona**: Feign Clients para validación en tiempo real
- **Notificaciones Multicanal**: Email, WebSocket, Push, SMS
- **Auditoría Completa**: Historial detallado de cambios de estado
- **BPMN Workflow**: Flujo específico de revisión editorial
- **Observabilidad Integral**: Trazas, métricas y logs estructurados"

**"Los beneficios implementados incluyen alta disponibilidad con CockroachDB, tolerancia a fallos con circuit breakers, escalabilidad con microservicios independientes, trazabilidad completa, y seguridad granular."**

**"El sistema está listo para producción y puede escalar horizontalmente según las necesidades."**

**"¿Hay alguna pregunta sobre la implementación o les gustaría que profundice en algún aspecto específico?"**

---

## ❓ PREGUNTAS COMUNES Y RESPUESTAS

### **"¿Por qué usar microservicios?"**
**"Los microservicios nos permiten desacoplar el sistema, escalar componentes independientemente, y usar tecnologías específicas para cada dominio. También facilitan el desarrollo en paralelo y la resiliencia."**

### **"¿Cómo manejan la consistencia de datos?"**
**"Usamos event sourcing con el patrón Outbox para garantizar la entrega de eventos. Los eventos se almacenan en la base de datos antes de enviarse a RabbitMQ, asegurando que no se pierdan."**

### **"¿Qué pasa si falla un servicio?"**
**"Los circuit breakers activan fallbacks automáticos. Si el Auth Service no está disponible, el sistema puede continuar funcionando con validaciones locales. Los eventos se almacenan hasta que el servicio se recupere."**

### **"¿Cómo monitorean el sistema?"**
**"Usamos Jaeger para trazas distribuidas, Prometheus para métricas, y logs estructurados. Todo está correlacionado para facilitar el debugging y monitoreo."**

### **"¿Cómo garantizan la seguridad?"**
**"OAuth2 + JWT con roles granulares. Cada endpoint valida el token y verifica los permisos. Los tokens incluyen información de roles y se renuevan automáticamente."**

---

## 🎬 NOTAS PARA EL PRESENTADOR

### **Antes de la Presentación:**
- Verificar que todos los servicios estén corriendo
- Tener las URLs abiertas en el navegador
- Probar los comandos de demostración
- Preparar respuestas a preguntas comunes

### **Durante la Presentación:**
- Mantener calma y confianza
- Explicar cada paso claramente
- Mostrar las interfaces web cuando sea relevante
- Responder preguntas con ejemplos prácticos
- Destacar el cumplimiento del 100% de requisitos

### **Tiempo Total: 25-30 minutos**

**¡Éxito en tu presentación! 🚀**
