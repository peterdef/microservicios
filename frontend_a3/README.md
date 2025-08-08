# Sistema de Gestión de Publicaciones Académicas

Sistema integral para la gestión de publicaciones académicas con datos quemados para inicio de sesión y sistema de backup para nuevos registros.

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)
```powershell
# En PowerShell, ejecute:
.\start-dev.ps1
```

### Opción 2: Inicio Manual

#### 1. Iniciar Frontend
```bash
# Terminal - Frontend
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

## 👤 Credenciales de Prueba (Datos Quemados)

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| autor@test.com | password | Autor |
| revisor@test.com | password | Revisor |
| editor@test.com | password | Editor |
| admin@test.com | password | Administrador |
| lector@test.com | password | Lector |

## 💾 Sistema de Datos

### Datos Quemados
- **Usuarios de prueba**: 5 usuarios predefinidos para inicio de sesión
- **Persistencia**: Almacenados en localStorage del navegador
- **Backup automático**: Los nuevos registros se guardan automáticamente

### Sistema de Backup
- **Registro de usuarios**: Los nuevos usuarios se guardan en backup
- **Persistencia**: Datos almacenados en localStorage
- **Gestión**: Panel de administración para gestionar backups
- **Exportación/Importación**: Funcionalidad completa de respaldos

## 🔌 Funcionalidades

### Autenticación
- `POST /api/auth/login` - Iniciar sesión (datos quemados + backup)
- `POST /api/auth/register` - Registro de usuario (se guarda en backup)
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
- `GET /api/admin/users` - Gestión de usuarios (hardcoded + backup)
- `POST /api/admin/backup` - Crear respaldo
- `GET /api/admin/backups` - Listar respaldos
- `POST /api/admin/backup/restore/:name` - Restaurar respaldo
- `DELETE /api/admin/backup/:name` - Eliminar respaldo
- `POST /api/admin/export` - Exportar datos

### Panel Editorial
- `GET /admin/editorial` - Panel de gestión editorial
- Estadísticas de publicaciones y revisiones
- Gestión de revisores y métricas de rendimiento
- Análisis de tasas de éxito y tiempos de revisión

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

### 👥 Sistema de Usuarios
- **Datos quemados**: 5 usuarios de prueba predefinidos
- **Registro dinámico**: Nuevos usuarios se guardan en backup
- **Roles diferenciados**: Autor, Revisor, Editor, Admin, Lector
- **Gestión de permisos**: Panel de administración completo

### 🔍 Sistema de Revisiones
- Asignación de revisores
- Estados de revisión
- Comentarios y feedback
- Sistema de prioridades

### 🔔 Sistema de Notificaciones
- Notificaciones en tiempo real
- Configuración de preferencias
- Diferentes tipos de notificación

### 💾 Sistema de Backup
- **Backup automático**: Al registrar nuevos usuarios
- **Backup manual**: Desde el panel de administración
- **Restauración**: Desde respaldos guardados
- **Exportación/Importación**: Funcionalidad completa
- **Gestión**: Panel de administración para backups

### 📊 Panel Editorial
- **Estadísticas en tiempo real**: Total de publicaciones, reviews pendientes, tasa de éxito
- **Gestión de revisores**: Top revisores con métricas de rendimiento
- **Publicaciones recientes**: Lista de las últimas publicaciones con estados
- **Métricas avanzadas**: Tiempo promedio de revisión, revisores activos
- **Navegación por pestañas**: Resumen, Publicaciones, Revisiones, Revisores, Analíticas

### 🔍 Auditoría del Sistema
- **Logs de actividad**: Registro completo de acciones del sistema
- **Filtros avanzados**: Por fecha, usuario, acción, estado, severidad
- **Exportación de logs**: Descarga en formato CSV
- **Estadísticas de auditoría**: Métricas de actividad y eventos críticos
- **Navegación por pestañas**: Resumen, Logs de Actividad, Filtros, Reportes

### ⚙️ Configuración del Sistema
- **Configuración general**: Nombre del sitio, zona horaria, idioma, modo mantenimiento
- **Configuración de seguridad**: Contraseñas, sesiones, autenticación de dos factores
- **Configuración de email**: Servidor SMTP, notificaciones por email
- **Configuración de notificaciones**: Frecuencia, retención, tipos de notificación
- **Configuración de almacenamiento**: Archivos, backup, compresión, proveedores
- **Configuración de rendimiento**: Cache, CDN, optimización, usuarios concurrentes

## 🛠️ Solución de Problemas

### Error de Autenticación
Si aparece "Error de autenticación":

1. **Verificar credenciales de prueba** (ver tabla arriba)
2. **Limpiar localStorage del navegador**
3. **Reiniciar el navegador**

### Gestión de Usuarios
- **Usuarios hardcoded**: No se pueden eliminar (son de prueba)
- **Usuarios registrados**: Se pueden gestionar desde el panel de admin
- **Backup**: Los nuevos usuarios se guardan automáticamente

### Panel de Administración
- **Acceso**: Solo usuarios con rol ROLE_ADMIN
- **Gestión de usuarios**: Ver, editar y eliminar usuarios registrados
- **Sistema de backup**: Crear, restaurar y eliminar respaldos
- **Estadísticas**: Información detallada del sistema

## 📁 Estructura del Proyecto

```
frontend_a3/
├── src/
│   ├── app/                 # Páginas Next.js
│   ├── components/          # Componentes React
│   ├── contexts/           # Contextos de React
│   ├── services/           # Servicios de API
│   └── types/              # Tipos TypeScript
├── start-dev.ps1          # Script de inicio
└── README.md
```

## 🔄 Scripts Disponibles

- `.\start-dev.ps1` - Inicia el entorno de desarrollo
- `npm run dev` - Solo inicia el frontend

## 📈 Características Avanzadas

### Panel de Administración
- **Gestión de usuarios**: Lista completa, filtros, exportación, estadísticas
- **Sistema de respaldos**: Crear, restaurar, eliminar respaldos
- **Auditoría del sistema**: Logs de actividad, filtros, exportación
- **Configuración del sistema**: General, seguridad, email, notificaciones, almacenamiento, rendimiento
- **Estadísticas del sistema**: Métricas detalladas de usuarios y actividad
- **Monitoreo de salud**: Estado del sistema y validación de integridad

### Sistema de Roles
- **Autor**: Crear y gestionar publicaciones
- **Revisor**: Revisar publicaciones asignadas
- **Editor**: Gestionar el proceso editorial
- **Admin**: Acceso completo al sistema
- **Lector**: Acceso de solo lectura

### Persistencia de Datos
- **Datos quemados**: Usuarios de prueba predefinidos
- **Backup automático**: Al registrar nuevos usuarios
- **localStorage**: Almacenamiento en el navegador
- **Exportación/Importación**: Funcionalidad completa

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

