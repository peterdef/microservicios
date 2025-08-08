'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/Layout';
import { notificationService } from '../../services/notificationService';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Star, 
  Eye, 
  Trash2, 
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Mail,
  MessageSquare,
  Calendar,
  Tag,
  Settings,
  FileText,
  UserPlus,
  Database,
  Shield,
  BookOpen,
  User,
  Activity,
  Zap,
  AlertTriangle,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { NotificationType, NotificationCategory, NotificationPriority } from '../../types/notification';

interface Notification {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  categoria: string;
  fecha: string;
  leida: boolean;
  prioridad: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  urgente: boolean;
  accion?: string;
  urlAccion?: string;
  icono?: string;
  color?: string;
  metadata?: Record<string, any>;
  relacionadoCon?: {
    tipo: 'publication' | 'review' | 'user' | 'system';
    id: string;
    titulo?: string;
  };
}

export default function NotificationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user notifications
      const response = await notificationService.getMyNotifications();
      console.log('API Response:', response); // Debug log
      
      const fetchedNotifications = response.content || response;
      console.log('Fetched Notifications:', fetchedNotifications); // Debug log
      
      setNotifications(fetchedNotifications);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      setError(error.message || 'Error al cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      return;
    }

    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, isLoading]);

  // Refresh notifications when returning to the page
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        fetchNotifications();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <AlertTriangle className="h-4 w-4" />;
      case 'HIGH':
        return <AlertCircle className="h-4 w-4" />;
      case 'MEDIUM':
        return <Clock className="h-4 w-4" />;
      case 'LOW':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'REVIEW_ASSIGNED':
      case 'REVIEW_COMPLETED':
      case 'REVIEW_OVERDUE':
      case 'REVIEW_REMINDER':
        return <Eye className="h-4 w-4" />;
      case 'PUBLICATION_SUBMITTED':
      case 'PUBLICATION_APPROVED':
      case 'PUBLICATION_PUBLISHED':
      case 'PUBLICATION_REJECTED':
      case 'PUBLICATION_CHANGES_REQUESTED':
        return <FileText className="h-4 w-4" />;
      case 'USER_REGISTERED':
      case 'USER_ROLE_CHANGED':
      case 'USER_ACCOUNT_LOCKED':
      case 'USER_ACCOUNT_UNLOCKED':
        return <UserPlus className="h-4 w-4" />;
      case 'SYSTEM_ALERT':
      case 'SYSTEM_MAINTENANCE':
      case 'SECURITY_ALERT':
      case 'PERFORMANCE_ALERT':
        return <Shield className="h-4 w-4" />;
      case 'BACKUP_CREATED':
      case 'BACKUP_RESTORED':
      case 'BACKUP_FAILED':
        return <Database className="h-4 w-4" />;
      case 'CITATION_RECEIVED':
        return <Star className="h-4 w-4" />;
      case 'COMMENT_RECEIVED':
        return <MessageSquare className="h-4 w-4" />;
      case 'NEW_PUBLICATION_AVAILABLE':
        return <BookOpen className="h-4 w-4" />;
      case 'PASSWORD_CHANGED':
      case 'PROFILE_UPDATED':
      case 'SETTINGS_CHANGED':
        return <Settings className="h-4 w-4" />;
      case 'EXPORT_COMPLETED':
      case 'IMPORT_COMPLETED':
        return <Activity className="h-4 w-4" />;
      case 'EMAIL_SENT':
      case 'EMAIL_FAILED':
        return <Mail className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'PUBLICATION':
        return 'bg-blue-100 text-blue-800';
      case 'REVIEW':
        return 'bg-amber-100 text-amber-800';
      case 'SYSTEM':
        return 'bg-gray-100 text-gray-800';
      case 'USER':
        return 'bg-purple-100 text-purple-800';
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'EDITORIAL':
        return 'bg-indigo-100 text-indigo-800';
      case 'SECURITY':
        return 'bg-red-100 text-red-800';
      case 'PERFORMANCE':
        return 'bg-orange-100 text-orange-800';
      case 'BACKUP':
        return 'bg-green-100 text-green-800';
      case 'EMAIL':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNotificationAction = async (action: string, notificationId: number) => {
    try {
      switch (action) {
        case 'mark-read':
          await notificationService.markAsRead(notificationId);
          setNotifications(prev => 
            prev.map(notif => 
              notif.id === notificationId 
                ? { ...notif, leida: true }
                : notif
            )
          );
          break;
        case 'mark-unread':
          await notificationService.markAsUnread(notificationId);
          setNotifications(prev => 
            prev.map(notif => 
              notif.id === notificationId 
                ? { ...notif, leida: false }
                : notif
            )
          );
          break;
        case 'delete':
          if (confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
            await notificationService.deleteNotification(notificationId);
            setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
          }
          break;
        case 'iniciar_revision':
          await notificationService.iniciarRevision(notificationId);
          // Refresh notifications after starting review
          await fetchNotifications();
          alert('Revisión iniciada exitosamente');
          break;
        case 'completar_revision':
          // Show review completion form
          handleCompletarRevision(notificationId);
          break;
        case 'action':
          // Handle specific notification action
          console.log('Executing notification action:', notificationId);
          break;
      }
    } catch (error: any) {
      console.error(`Error in ${action} action:`, error);
      alert(error.message || `Error al ${action} la notificación`);
    }
  };

  const handleCompletarRevision = async (notificationId: number) => {
    const calificacion = prompt('Ingresa la calificación (1-10):');
    if (!calificacion) return;
    
    const calificacionNum = parseInt(calificacion);
    if (isNaN(calificacionNum) || calificacionNum < 1 || calificacionNum > 10) {
      alert('La calificación debe ser un número entre 1 y 10');
      return;
    }

    const recomendacion = prompt('Ingresa la recomendación (ACEPTAR/RECHAZAR/CAMBIOS_MINOR/CAMBIOS_MAJOR):');
    if (!recomendacion || !['ACEPTAR', 'RECHAZAR', 'CAMBIOS_MINOR', 'CAMBIOS_MAJOR'].includes(recomendacion)) {
      alert('La recomendación debe ser: ACEPTAR, RECHAZAR, CAMBIOS_MINOR o CAMBIOS_MAJOR');
      return;
    }

    const comentarios = prompt('Ingresa los comentarios de la revisión:');
    if (!comentarios) {
      alert('Debes ingresar comentarios');
      return;
    }

    try {
      await notificationService.completarRevision(notificationId, {
        calificacion: calificacionNum,
        recomendacion: recomendacion as 'ACEPTAR' | 'RECHAZAR' | 'CAMBIOS_MINOR' | 'CAMBIOS_MAJOR',
        comentarios: comentarios
      });
      
      // Refresh notifications after completing review
      await fetchNotifications();
      alert('Revisión completada exitosamente');
    } catch (error: any) {
      console.error('Error completing review:', error);
      alert(error.message || 'Error al completar la revisión');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.leida) ||
                         (filter === 'read' && notification.leida);
    const matchesPriority = !priorityFilter || notification.prioridad === priorityFilter;
    const matchesType = !typeFilter || notification.tipo === typeFilter;
    const matchesCategory = !categoryFilter || notification.categoria === categoryFilter;
    
    return matchesFilter && matchesPriority && matchesType && matchesCategory;
  });

  const unreadCount = notifications.filter(n => !n.leida).length;
  const urgentCount = notifications.filter(n => !n.leida && (n.prioridad === 'URGENT' || n.urgente)).length;

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, leida: true })));
    } catch (error: any) {
      console.error('Error marking all as read:', error);
      alert(error.message || 'Error al marcar todas como leídas');
    }
  };

  const clearFilters = () => {
    setFilter('all');
    setPriorityFilter('');
    setTypeFilter('');
    setCategoryFilter('');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-gray-600 font-medium">Cargando notificaciones...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar las notificaciones</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={fetchNotifications}
              className="btn-primary inline-flex items-center px-6 py-3"
            >
              Reintentar
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
              <p className="mt-2 text-gray-600">
                Gestiona tus notificaciones y mantente al día con las actualizaciones del sistema
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">No leídas</div>
                <div className="text-2xl font-bold text-gray-900">{unreadCount}</div>
              </div>
              {urgentCount > 0 && (
                <div className="text-right">
                  <div className="text-sm text-gray-500">Urgentes</div>
                  <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Filter className="h-4 w-4" />
                <span>{showFilters ? 'Ocultar' : 'Mostrar'} filtros</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Marcar todas como leídas
                </button>
              )}
              <Link
                href="/notifications/settings"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
                className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Todas ({notifications.length})</option>
                <option value="unread">No leídas ({unreadCount})</option>
                <option value="read">Leídas ({notifications.length - unreadCount})</option>
              </select>
            </div>

            {showFilters && (
              <>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    id="priority"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Todas las prioridades</option>
                    <option value="URGENT">Urgente</option>
                    <option value="HIGH">Alta</option>
                    <option value="MEDIUM">Media</option>
                    <option value="LOW">Baja</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    id="category"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Todas las categorías</option>
                    <option value="PUBLICATION">Publicación</option>
                    <option value="REVIEW">Revisión</option>
                    <option value="SYSTEM">Sistema</option>
                    <option value="USER">Usuario</option>
                    <option value="ADMIN">Administración</option>
                    <option value="EDITORIAL">Editorial</option>
                    <option value="SECURITY">Seguridad</option>
                    <option value="PERFORMANCE">Rendimiento</option>
                    <option value="BACKUP">Backup</option>
                    <option value="EMAIL">Email</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    id="type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Todos los tipos</option>
                    <option value="REVIEW_ASSIGNED">Revisión Asignada</option>
                    <option value="REVIEW_COMPLETED">Revisión Completada</option>
                    <option value="REVIEW_OVERDUE">Revisión Vencida</option>
                    <option value="REVIEW_REMINDER">Recordatorio de Revisión</option>
                    <option value="PUBLICATION_SUBMITTED">Publicación Enviada</option>
                    <option value="PUBLICATION_APPROVED">Publicación Aprobada</option>
                    <option value="PUBLICATION_PUBLISHED">Publicación Publicada</option>
                    <option value="PUBLICATION_REJECTED">Publicación Rechazada</option>
                    <option value="PUBLICATION_CHANGES_REQUESTED">Cambios Solicitados</option>
                    <option value="USER_REGISTERED">Usuario Registrado</option>
                    <option value="SYSTEM_ALERT">Alerta del Sistema</option>
                    <option value="SECURITY_ALERT">Alerta de Seguridad</option>
                    <option value="BACKUP_CREATED">Backup Creado</option>
                    <option value="NEW_PUBLICATION_AVAILABLE">Nueva Publicación</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Notificaciones ({filteredNotifications.length})
              </h2>
              <div className="text-sm text-gray-500">
                {filteredNotifications.filter(n => !n.leida).length} no leídas
              </div>
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No hay notificaciones</h3>
              <p className="mt-2 text-sm text-gray-500">
                {filter !== 'all' || priorityFilter || typeFilter || categoryFilter
                  ? 'Intenta ajustar los filtros para ver más notificaciones.'
                  : 'No tienes notificaciones en este momento.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.leida ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        !notification.leida ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {getTypeIcon(notification.tipo)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className={`text-sm font-medium ${
                            !notification.leida ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.titulo}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.prioridad)}`}>
                            {getPriorityIcon(notification.prioridad)}
                            <span className="ml-1">{notification.prioridad}</span>
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(notification.categoria)}`}>
                            <Tag className="h-3 w-3 mr-1" />
                            {notification.categoria}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleNotificationAction(
                              notification.leida ? 'mark-unread' : 'mark-read', 
                              notification.id
                            )}
                            className={`p-1 rounded-full transition-colors ${
                              notification.leida 
                                ? 'text-gray-400 hover:text-gray-600' 
                                : 'text-blue-600 hover:text-blue-800'
                            }`}
                            title={notification.leida ? 'Marcar como no leída' : 'Marcar como leída'}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleNotificationAction('delete', notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded-full transition-colors"
                            title="Eliminar notificación"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{notification.mensaje}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(notification.fecha).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(notification.fecha).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        
                        {notification.accion && (
                          <button
                            onClick={() => handleNotificationAction('action', notification.id)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
                          >
                            {notification.accion}
                          </button>
                        )}
                        
                        {/* Review action buttons */}
                        {notification.tipo.includes('REVIEW') && !notification.leida && (
                          <div className="flex space-x-2">
                            {notification.tipo === 'REVIEW_ASSIGNED' && (
                              <button
                                onClick={() => handleNotificationAction('iniciar_revision', notification.id)}
                                className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                                title="Iniciar revisión"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Iniciar Revisión
                              </button>
                            )}
                            {notification.tipo === 'REVIEW_STARTED' && (
                              <button
                                onClick={() => handleNotificationAction('completar_revision', notification.id)}
                                className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                title="Completar revisión"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completar Revisión
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
