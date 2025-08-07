# Sistema de Gestión de Publicaciones Académicas

## Descripción

Este es el frontend del Sistema de Gestión de Publicaciones Académicas, una plataforma integral para la gestión del ciclo de vida completo de publicaciones académicas y editoriales. El sistema permite el registro y autenticación segura de usuarios, creación y edición de publicaciones, flujo de revisión colaborativa, control de cambios, aprobación editorial y publicación final en un catálogo accesible.

## Características Principales

### 🔐 Autenticación y Autorización
- Sistema de autenticación basado en JWT
- Roles de usuario: Autor, Revisor, Editor, Administrador, Lector
- Registro seguro de usuarios con validaciones
- Gestión de sesiones y tokens de acceso

### 📚 Gestión de Publicaciones
- Creación de artículos y libros
- Control de versiones y estados
- Metadatos completos (ISBN, DOI, categorías, etc.)
- Gestión de archivos adjuntos
- Palabras clave y referencias bibliográficas

### 👥 Sistema de Roles
- **Autor**: Crear y gestionar publicaciones propias
- **Revisor**: Evaluar publicaciones asignadas
- **Editor**: Aprobar publicaciones y asignar revisores
- **Administrador**: Gestión completa del sistema
- **Lector**: Acceso al catálogo público

### 🔄 Flujo de Revisión
- Estados: Borrador → En Revisión → Cambios Solicitados → Aprobado → Publicado
- Comentarios estructurados por secciones
- Historial de cambios y versiones
- Notificaciones automáticas

### 📢 Sistema de Notificaciones
- Notificaciones en tiempo real
- Múltiples canales (email, web push, in-app)
- Preferencias personalizables
- Plantillas configurables

### 🎯 Catálogo Público
- Búsqueda avanzada por múltiples criterios
- Filtros por tipo, categoría, autor
- Vista detallada de publicaciones
- Descarga de contenido aprobado

## Tecnologías Utilizadas

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Estado**: React Context API
- **Autenticación**: JWT con refresh tokens

## Estructura del Proyecto

```
src/
├── app/                    # Páginas de la aplicación
│   ├── auth/              # Autenticación
│   ├── dashboard/         # Panel principal
│   ├── publications/      # Gestión de publicaciones
│   ├── reviews/           # Sistema de revisiones
│   ├── catalog/           # Catálogo público
│   ├── notifications/     # Centro de notificaciones
│   └── admin/             # Panel de administración
├── components/            # Componentes reutilizables
├── contexts/             # Contextos de React
├── services/             # Servicios de API
├── types/                # Definiciones de TypeScript
└── utils/                # Utilidades
```

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd frontend_a3
```

2. Instalar dependencias:
```bash
npm install
```

3. Instalar dependencias del servidor mock (opcional, para desarrollo):
```bash
npm install --legacy-peer-deps express cors jsonwebtoken
```

### Desarrollo Rápido

Para desarrollo y pruebas, hemos incluido un servidor mock que simula la API del backend:

#### Opción 1: Usar los scripts automáticos
```bash
# En Windows (PowerShell)
.\start-dev.ps1

# En Windows (Command Prompt)
start-dev.bat
```

#### Opción 2: Iniciar manualmente

1. **Iniciar el servidor mock** (en una terminal):
```bash
node mock-server.js
```

2. **Iniciar el frontend** (en otra terminal):
```bash
npm run dev
```

### Configuración de Variables de Entorno

El proyecto está configurado para usar el servidor mock por defecto. Si quieres conectar con el backend real:

1. Crear archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. Ejecutar en modo desarrollo:
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar en modo producción
- `npm run lint` - Ejecutar linter

## Credenciales de Prueba

Para probar el sistema, puedes usar las siguientes credenciales:

- **Autor**: `autor` / `password`
- **Revisor**: `revisor` / `password`
- **Editor**: `editor` / `password`
- **Administrador**: `admin` / `password`
- **Lector**: `lector` / `password`

## Servidor Mock para Desarrollo

Para facilitar el desarrollo y pruebas, incluimos un servidor mock que simula la API del backend:

### Características del Mock Server
- ✅ Autenticación JWT completa
- ✅ Gestión de usuarios y roles
- ✅ Endpoints de publicaciones
- ✅ Sistema de revisiones
- ✅ Notificaciones
- ✅ Datos de prueba predefinidos

### Endpoints Disponibles
- `POST /api/auth/login` - Autenticación
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Información del usuario
- `GET /api/publicaciones` - Lista de publicaciones
- `GET /api/publicaciones/mis-publicaciones` - Publicaciones del usuario
- `GET /api/reviews/mis-reviews` - Revisiones asignadas
- `GET /api/notificaciones/mis-notificaciones` - Notificaciones del usuario

### Iniciar el Mock Server
```bash
node mock-server.js
```

El servidor estará disponible en `http://localhost:8080`

## Funcionalidades por Rol

### Autor
- Crear y editar publicaciones
- Ver estado de revisiones
- Responder a comentarios
- Subir archivos adjuntos

### Revisor
- Ver publicaciones asignadas
- Comentar y evaluar
- Emitir recomendaciones
- Historial de revisiones

### Editor
- Aprobar/rechazar publicaciones
- Asignar revisores
- Gestionar flujo editorial
- Estadísticas de revisión

### Administrador
- Gestión de usuarios
- Asignación de roles
- Configuración del sistema
- Monitoreo y reportes

### Lector
- Buscar en catálogo
- Ver publicaciones aprobadas
- Descargar contenido
- Filtros avanzados

## API Endpoints

El frontend se conecta a los siguientes endpoints del backend:

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión

### Publicaciones
- `GET /api/publications` - Listar publicaciones
- `POST /api/publications` - Crear publicación
- `GET /api/publications/{id}` - Obtener publicación
- `PUT /api/publications/{id}` - Actualizar publicación
- `DELETE /api/publications/{id}` - Eliminar publicación

### Revisiones
- `GET /api/reviews` - Listar revisiones
- `POST /api/reviews` - Crear revisión
- `PUT /api/reviews/{id}` - Actualizar revisión
- `POST /api/reviews/{id}/submit` - Enviar revisión

### Notificaciones
- `GET /api/notifications` - Listar notificaciones
- `POST /api/notifications/{id}/read` - Marcar como leída
- `GET /api/notifications/unread-count` - Contar no leídas

## Desarrollo

### Estructura de Componentes

Los componentes están organizados por funcionalidad:

- **Auth**: Componentes de autenticación
- **Dashboard**: Panel principal y navegación
- **Publications**: Gestión de publicaciones
- **Reviews**: Sistema de revisiones
- **Notifications**: Centro de notificaciones
- **Admin**: Panel de administración

### Patrones Utilizados

- **Context API**: Para estado global de autenticación
- **Custom Hooks**: Para lógica reutilizable
- **Service Layer**: Para comunicación con API
- **TypeScript**: Para tipado estático
- **Responsive Design**: Con Tailwind CSS

### Convenciones de Código

- Nombres de archivos en kebab-case
- Componentes en PascalCase
- Hooks personalizados con prefijo `use`
- Servicios con sufijo `Service`
- Tipos con sufijo descriptivo

## Despliegue

### Producción

1. Construir el proyecto:
```bash
npm run build
```

2. Ejecutar en producción:
```bash
npm start
```

### Variables de Entorno de Producción

```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com
NEXT_PUBLIC_WS_URL=wss://api.tudominio.com
```

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo.

---

**Nota**: Este frontend está diseñado para trabajar con un backend de microservicios que implementa la arquitectura descrita en el documento de especificaciones del proyecto.
