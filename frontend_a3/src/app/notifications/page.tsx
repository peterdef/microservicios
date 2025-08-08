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
  Settings
} from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  fecha: string;
  leida: boolean;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
  categoria?: string;
  accion?: string;
}

export default function NotificationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
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
      case 'ALTA':
        return 'bg-red-100 text-red-800';
      case 'MEDIA':
        return 'bg-yellow-100 text-yellow-800';
      case 'BAJA':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'ALTA':
        return <AlertCircle className="h-4 w-4" />;
      case 'MEDIA':
        return <Clock className="h-4 w-4" />;
      case 'BAJA':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'REVISION_ASIGNADA':
      case 'RECORDATORIO':
        return <Eye className="h-4 w-4" />;
      case 'PUBLICACION_APROBADA':
        return <CheckCircle className="h-4 w-4" />;
      case 'CAMBIOS_SOLICITADOS':
        return <AlertCircle className="h-4 w-4" />;
      case 'CITACION':
        return <Star className="h-4 w-4" />;
      case 'COMENTARIO':
        return <MessageSquare className="h-4 w-4" />;
      case 'SISTEMA':
        return <Bell className="h-4 w-4" />;
      case 'NUEVA_PUBLICACION':
        return <Mail className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
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

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.leida) ||
                         (filter === 'read' && notification.leida);
    const matchesPriority = !priorityFilter || notification.prioridad === priorityFilter;
    const matchesType = !typeFilter || notification.tipo === typeFilter;
    
    return matchesFilter && matchesPriority && matchesType;
  });

  const unreadCount = notifications.filter(n => !n.leida).length;
  const highPriorityCount = notifications.filter(n => !n.leida && n.prioridad === 'ALTA').length;

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
              {highPriorityCount > 0 && (
                <div className="text-right">
                  <div className="text-sm text-gray-500">Alta prioridad</div>
                  <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
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
                    <option value="REVISION_ASIGNADA">Revisión Asignada</option>
                    <option value="PUBLICACION_APROBADA">Publicación Aprobada</option>
                    <option value="CAMBIOS_SOLICITADOS">Cambios Solicitados</option>
                    <option value="CITACION">Citación</option>
                    <option value="COMENTARIO">Comentario</option>
                    <option value="RECORDATORIO">Recordatorio</option>
                    <option value="SISTEMA">Sistema</option>
                    <option value="NUEVA_PUBLICACION">Nueva Publicación</option>
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
                {filter !== 'all' || priorityFilter || typeFilter
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
                          {notification.categoria && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <Tag className="h-3 w-3 mr-1" />
                              {notification.categoria}
                            </span>
                          )}
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
