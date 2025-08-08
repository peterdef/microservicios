# Sistema de Gestión de Publicaciones Académicas

Sistema integral para la gestión de publicaciones académicas con persistencia de datos dinámica y sistema de respaldo automático.

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)
```powershell
# En PowerShell, ejecute:
.\start-dev.ps1
```

### Opción 2: Inicio Manual

#### 1. Iniciar Servidor Mock
```bash
# Terminal 1 - Servidor Mock
node mock-server.js
```

#### 2. Iniciar Frontend
```bash
# Terminal 2 - Frontend
npm run dev
```

## 📋 Requisitos

- Node.js 16+
- npm o yarn

## 🔧 Instalación

```bash
npm install
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:3000
- **Servidor Mock**: http://localhost:8080

## 👤 Credenciales de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| autor | password | Autor |
| revisor | password | Revisor |
| editor | password | Editor |
| admin | password | Administrador |
| lector | password | Lector |

## 🗄️ Persistencia de Datos

### Archivos de Datos
- **Usuarios**: `data/users.json`
- **Publicaciones**: `data/publications.json`
- **Revisiones**: `data/reviews.json`
- **Notificaciones**: `data/notifications.json`
- **Respaldos**: `data/backups/`

### Sistema de Respaldos
- **Automático**: Cada 10 operaciones
- **Manual**: Desde el panel de administración
- **Restauración**: Desde respaldos guardados
- **Limpieza**: Eliminación automática de respaldos antiguos

## 🔌 Endpoints API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registro de usuario
- `GET /api/auth/me` - Información del usuario actual

### Publicaciones
- `GET /api/publicaciones` - Listar publicaciones
- `POST /api/publicaciones` - Crear publicación
- `PUT /api/publicaciones/:id` - Actualizar publicación
- `DELETE /api/publicaciones/:id` - Eliminar publicación
- `GET /api/publicaciones/mis-publicaciones` - Mis publicaciones

### Revisiones
- `GET /api/reviews/mis-reviews` - Mis revisiones
- `POST /api/reviews` - Crear revisión
- `PUT /api/reviews/:id` - Actualizar revisión

### Notificaciones
- `GET /api/notificaciones/mis-notificaciones` - Mis notificaciones
- `PUT /api/notificaciones/:id/leer` - Marcar como leída

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas del dashboard

### Administración
- `GET /api/admin/users` - Gestión de usuarios
- `POST /api/admin/backup` - Crear respaldo
- `GET /api/admin/backups` - Listar respaldos
- `POST /api/admin/backup/restore/:name` - Restaurar respaldo
- `DELETE /api/admin/backup/:name` - Eliminar respaldo
- `POST /api/admin/export` - Exportar datos
- `POST /api/admin/import` - Importar datos
- `GET /api/admin/stats` - Estadísticas del sistema
- `POST /api/admin/backup/clean` - Limpiar respaldos antiguos

## 🎯 Características Principales

### 📊 Dashboard Dinámico
- Estadísticas en tiempo real
- Gráficos de actividad
- Resumen de publicaciones y revisiones
- Notificaciones recientes

### 📝 Gestión de Publicaciones
- Creación y edición de publicaciones
- Estados de publicación (Borrador, En Revisión, Publicado)
- Sistema de palabras clave
- Metadatos completos

### 📚 Catálogo Dinámico
- Visualización de todas las publicaciones del sistema
- Búsqueda avanzada por título, autor y palabras clave
- Filtros por categoría y tipo de publicación
- Ordenamiento por fecha y título
- Paginación de resultados
- Datos obtenidos dinámicamente del backup

### 👥 Sistema de Usuarios
- Roles diferenciados (Autor, Revisor, Editor, Admin, Lector)
- Gestión de permisos
- Perfiles de usuario

### 🔍 Sistema de Revisiones
- Asignación de revisores
- Estados de revisión
- Comentarios y feedback
- Sistema de prioridades

### 🔔 Sistema de Notificaciones
- Notificaciones en tiempo real
- Configuración de preferencias
- Diferentes tipos de notificación

### 💾 Sistema de Respaldos
- Respaldos automáticos
- Respaldos manuales
- Restauración de datos
- Exportación/Importación

## 🛠️ Solución de Problemas

### Error 404 en Dashboard
Si aparece "Error loading stats: 404 Not Found":

1. **Verificar que el servidor mock esté corriendo**:
   ```bash
   node mock-server.js
   ```

2. **Verificar que aparezca el mensaje**:
   ```
   Mock server running on http://localhost:8080
   ```

3. **Recargar la página del dashboard**

### Error de Autenticación
Si aparece "Error de autenticación":

1. **Cerrar sesión y volver a iniciar**
2. **Verificar credenciales de prueba**
3. **Limpiar localStorage del navegador**

### Error de Conectividad
Si no se pueden cargar los datos:

1. **Verificar que ambos servidores estén corriendo**
2. **Verificar puertos 3000 y 8080**
3. **Revisar consola del navegador para errores**

## 📁 Estructura del Proyecto

```
frontend_a3/
├── src/
│   ├── app/                 # Páginas Next.js
│   ├── components/          # Componentes React
│   ├── contexts/           # Contextos de React
│   ├── services/           # Servicios de API
│   └── types/              # Tipos TypeScript
├── data/                   # Datos persistentes
│   ├── users.json
│   ├── publications.json
│   ├── reviews.json
│   ├── notifications.json
│   └── backups/
├── mock-server.js          # Servidor mock
├── start-dev.ps1          # Script de inicio
└── README.md
```

## 🔄 Scripts Disponibles

- `.\start-dev.ps1` - Inicia todo el entorno de desarrollo
- `.\start-mock-server.ps1` - Solo inicia el servidor mock
- `npm run dev` - Solo inicia el frontend
- `node check-server.js` - Verifica si el servidor mock está funcionando

## 📈 Características Avanzadas

### Panel de Administración
- Gestión completa de usuarios
- Sistema de respaldos
- Estadísticas del sistema
- Monitoreo de salud

### Sistema de Roles
- **Autor**: Crear y gestionar publicaciones
- **Revisor**: Revisar publicaciones asignadas
- **Editor**: Gestionar el proceso editorial
- **Admin**: Acceso completo al sistema
- **Lector**: Acceso de solo lectura

### Persistencia de Datos
- Almacenamiento en JSON
- Respaldos automáticos
- Restauración de datos
- Exportación/Importación

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

