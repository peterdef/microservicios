'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  Users, 
  Bell, 
  TrendingUp, 
  Eye, 
  Download, 
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Star,
  MessageSquare,
  Calendar,
  BarChart3,
  Activity,
  BookOpen,
  Info,
  AlertTriangle,
  Plus,
  Sparkles,
  Rocket,
  Grid,
  List,
  ArrowUpRight,
  Target,
  Award,
  Zap,
  RefreshCw,
  Filter,
  MoreHorizontal,
  CalendarDays,
  Clock3,
  Bookmark,
  Search
} from 'lucide-react';
import Link from 'next/link';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('auth_token');

interface DashboardStats {
  totalPublications: number;
  publishedPublications: number;
  draftPublications: number;
  inReviewPublications: number;
  totalReviews: number;
  completedReviews: number;
  pendingReviews: number;
  unreadNotifications: number;
  totalNotifications: number;
}

interface Publication {
  id: number;
  titulo: string;
  resumen: string;
  tipo: string;
  estado: string;
  autorId: number;
  autor: string;
  fechaCreacion: string;
  fechaPublicacion?: string;
  palabrasClave?: string[];
  referencias?: string[];
  metadata?: any;
  isbn?: string;
  numeroPaginas?: number;
  edicion?: number;
  capitulos?: any[];
}

interface Review {
  id: number;
  publicacionId: number;
  publicacionTitulo: string;
  revisorId: number;
  revisor: string;
  estado: string;
  fechaAsignacion: string;
  fechaInicio?: string;
  prioridad: string;
  recomendacion?: string;
  comentarios?: any[];
}

interface Notification {
  id: number;
  usuarioId: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  estado: string;
  prioridad: string;
  fechaCreacion: string;
  leida: boolean;
}

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError('');
        
        // Load dashboard statistics
        const statsResponse = await fetch('/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          console.error('Error loading stats:', statsResponse.status, statsResponse.statusText);
          if (statsResponse.status === 401) {
            setError('Error de autenticación. Por favor, inicie sesión nuevamente.');
          } else if (statsResponse.status === 404) {
            setError('Servidor mock no disponible. Ejecute "node mock-server.js" en una nueva terminal.');
          } else {
            setError('No se pudieron cargar las estadísticas del dashboard.');
          }
        }

        // Load user publications
        const publicationsResponse = await fetch('/api/publicaciones/mis-publicaciones', {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });
        
        if (publicationsResponse.ok) {
          const publicationsData = await publicationsResponse.json();
          setPublications(publicationsData.content || []);
        } else {
          console.error('Error loading publications:', publicationsResponse.status, publicationsResponse.statusText);
        }

        // Load user reviews
        const reviewsResponse = await fetch('/api/reviews/mis-reviews', {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });
        
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.content || []);
        } else {
          console.error('Error loading reviews:', reviewsResponse.status, reviewsResponse.statusText);
        }

        // Load user notifications
        const notificationsResponse = await fetch('/api/notificaciones/mis-notificaciones', {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });
        
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData.content || []);
        } else {
          console.error('Error loading notifications:', notificationsResponse.status, notificationsResponse.statusText);
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Error al cargar los datos del dashboard. Verifique que el servidor esté funcionando.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'BORRADOR': 'bg-slate-100 text-slate-800',
      'EN_REVISION': 'bg-amber-100 text-amber-800',
      'APROBADO': 'bg-emerald-100 text-emerald-800',
      'PUBLICADO': 'bg-blue-100 text-blue-800',
      'EN_PROCESO': 'bg-orange-100 text-orange-800',
      'COMPLETADA': 'bg-emerald-100 text-emerald-800',
      'ASIGNADA': 'bg-purple-100 text-purple-800'
    };
    return statusColors[status] || 'bg-slate-100 text-slate-800';
  };

  const getStatusIcon = (status: string) => {
    const statusIcons: { [key: string]: React.ReactNode } = {
      'BORRADOR': <FileText className="h-4 w-4" />,
      'EN_REVISION': <Clock className="h-4 w-4" />,
      'APROBADO': <CheckCircle className="h-4 w-4" />,
      'PUBLICADO': <Star className="h-4 w-4" />,
      'EN_PROCESO': <Activity className="h-4 w-4" />,
      'COMPLETADA': <CheckCircle className="h-4 w-4" />,
      'ASIGNADA': <Eye className="h-4 w-4" />
    };
    return statusIcons[status] || <FileText className="h-4 w-4" />;
  };

  const getTypeIcon = (type: string) => {
    return type === 'ARTICULO' ? <FileText className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />;
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      'info': <Info className="h-4 w-4" />,
      'success': <CheckCircle className="h-4 w-4" />,
      'warning': <AlertTriangle className="h-4 w-4" />,
      'error': <AlertCircle className="h-4 w-4" />,
      'REVISION_ASIGNADA': <Eye className="h-4 w-4" />,
      'PUBLICACION_ENVIADA': <FileText className="h-4 w-4" />,
      'NUEVA_PUBLICACION': <Plus className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <Info className="h-4 w-4" />;
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      'info': 'text-blue-600 bg-blue-50',
      'success': 'text-green-600 bg-green-50',
      'warning': 'text-yellow-600 bg-yellow-50',
      'error': 'text-red-600 bg-red-50',
      'REVISION_ASIGNADA': 'text-purple-600 bg-purple-50',
      'PUBLICACION_ENVIADA': 'text-blue-600 bg-blue-50',
      'NUEVA_PUBLICACION': 'text-green-600 bg-green-50'
    };
    return colors[type as keyof typeof colors] || 'text-blue-600 bg-blue-50';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRecentPublications = () => {
    return publications
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
      .slice(0, 4);
  };

  const getRecentReviews = () => {
    return reviews
      .sort((a, b) => new Date(b.fechaAsignacion).getTime() - new Date(a.fechaAsignacion).getTime())
      .slice(0, 3);
  };

  const getRecentNotifications = () => {
    return notifications
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
      .slice(0, 3);
  };

  const getPublicationsByStatus = () => {
    const statusCounts: { [key: string]: number } = {};
    publications.forEach(pub => {
      statusCounts[pub.estado] = (statusCounts[pub.estado] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
  };

  const getPublicationsByType = () => {
    const typeCounts: { [key: string]: number } = {};
    publications.forEach(pub => {
      typeCounts[pub.tipo] = (typeCounts[pub.tipo] || 0) + 1;
    });
    return Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar el dashboard</h3>
          <p className="text-gray-500 mb-4">
            {error || 'No se pudieron cargar las estadísticas del dashboard.'}
          </p>
          {error.includes('servidor') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 font-medium mb-2">Para solucionar este problema:</p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Verifique que el servidor mock esté corriendo</li>
                <li>• Ejecute: <code className="bg-yellow-100 px-1 rounded">node mock-server.js</code></li>
                <li>• Recargue la página</li>
              </ul>
            </div>
          )}
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const recentPublications = getRecentPublications();
  const recentReviews = getRecentReviews();
  const recentNotifications = getRecentNotifications();
  const publicationsByStatus = getPublicationsByStatus();
  const publicationsByType = getPublicationsByType();

  return (
    <div className="p-6 lg:p-8">
      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error en el dashboard</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              {error.includes('mock') && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-xs text-yellow-800 font-medium mb-2">Para solucionar:</p>
                  <ol className="text-xs text-yellow-700 space-y-1">
                    <li>1. Abra una nueva terminal</li>
                    <li>2. Navegue al directorio del proyecto</li>
                    <li>3. Ejecute: <code className="bg-yellow-100 px-1 rounded">node mock-server.js</code></li>
                    <li>4. Espere el mensaje "Mock server running on http://localhost:8080"</li>
                    <li>5. Recargue esta página</li>
                  </ol>
                </div>
              )}
            </div>
            <button 
              onClick={() => setError('')} 
              className="text-red-400 hover:text-red-600 ml-3"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Welcome Header with Enhanced Design */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  ¡Bienvenido, {user?.nombres}!
                </h1>
                <p className="text-indigo-100 text-lg">
                  Aquí tienes un resumen completo de tu actividad académica
                </p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2 text-indigo-100">
                    <CalendarDays className="w-4 h-4" />
                    <span className="text-sm">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-indigo-100">
                    <Clock3 className="w-4 h-4" />
                    <span className="text-sm">{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.totalPublications}</div>
                <div className="text-indigo-100">Publicaciones</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Mis Publicaciones</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalPublications}</p>
              <p className="text-xs text-gray-500 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                {stats.publishedPublications} publicadas
              </p>
            </div>
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Revisiones Pendientes</p>
              <p className="text-3xl font-bold text-amber-600 mb-1">{stats.pendingReviews}</p>
              <p className="text-xs text-gray-500 flex items-center">
                <Target className="w-3 h-3 mr-1 text-amber-500" />
                Requieren atención
              </p>
            </div>
            <div className="h-16 w-16 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Revisiones Completadas</p>
              <p className="text-3xl font-bold text-emerald-600 mb-1">{stats.completedReviews}</p>
              <p className="text-xs text-gray-500 flex items-center">
                <Award className="w-3 h-3 mr-1 text-emerald-500" />
                Total: {stats.totalReviews}
              </p>
            </div>
            <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Notificaciones</p>
              <p className="text-3xl font-bold text-purple-600 mb-1">{stats.unreadNotifications}</p>
              <p className="text-xs text-gray-500 flex items-center">
                <Zap className="w-3 h-3 mr-1 text-purple-500" />
                {stats.totalNotifications} total
              </p>
            </div>
            <div className="h-16 w-16 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Bell className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Publications and Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Enhanced Publications Section */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Bookmark className="w-5 h-5 mr-2 text-indigo-500" />
                    Publicaciones Recientes
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <Link
                  href="/publications"
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center hover:scale-105 transition-transform"
                >
                  Ver todas
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentPublications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay publicaciones recientes</h3>
                  <p className="text-gray-500 mb-6">
                    Comienza creando tu primera publicación
                  </p>
                  <Link
                    href="/publications/create"
                    className="btn-primary inline-flex items-center px-6 py-3"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Nueva Publicación
                  </Link>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                  {recentPublications.map((publication) => (
                    <div key={publication.id} className={`${viewMode === 'grid' ? 'card p-4' : 'flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-100'} hover:bg-white/80 transition-all duration-200 hover:shadow-md group`}>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(publication.tipo)}
                          <span className="text-sm text-gray-500">{publication.tipo}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {publication.titulo}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {formatDate(publication.fechaCreacion)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(publication.estado)}`}>
                          {getStatusIcon(publication.estado)}
                          <span className="ml-1">{publication.estado.replace('_', ' ')}</span>
                        </span>
                        {viewMode === 'list' && (
                          <div className="flex items-center space-x-1">
                            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-500" />
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              {recentNotifications.length > 0 ? (
                recentNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500 text-white text-xs font-medium">
                      {getNotificationIcon(notification.tipo)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.titulo}</p>
                      <p className="text-xs text-gray-500">{notification.mensaje}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(notification.fechaCreacion)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No hay actividad reciente</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions, Stats, and Notifications */}
        <div className="space-y-6">
          {/* Enhanced Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-indigo-500" />
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              {user?.roles.includes('ROLE_AUTOR') && (
                <Link
                  href="/publications/create"
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
                >
                  <Plus className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-900">Nueva Publicación</span>
                </Link>
              )}
              
              <Link
                href="/catalog"
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <Search className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-900">Explorar Catálogo</span>
              </Link>
              
              <Link
                href="/notifications"
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <Bell className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-900">Ver Notificaciones</span>
              </Link>
              
              {user?.roles.includes('ROLE_REVISOR') && (
                <Link
                  href="/reviews"
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
                >
                  <Eye className="h-5 w-5 text-amber-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-900">Mis Revisiones</span>
                </Link>
              )}
            </div>
          </div>

          {/* Enhanced Publications by Status */}
          {publicationsByStatus.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" />
                Publicaciones por Estado
              </h3>
              <div className="space-y-4">
                {publicationsByStatus.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{item.status.replace('_', ' ')}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(item.count / stats.totalPublications) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Reviews */}
          {recentReviews.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-amber-500" />
                Revisiones Recientes
              </h3>
              <div className="space-y-3">
                {recentReviews.map((review) => (
                  <div key={review.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-100 hover:bg-white/80 transition-all duration-200">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {review.publicacionTitulo}
                      </h4>
                      <p className="text-xs text-gray-500">{formatDate(review.fechaAsignacion)}</p>
                      <p className="text-xs text-gray-400">{review.revisor}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.estado)}`}>
                      {getStatusIcon(review.estado)}
                      <span className="ml-1">{review.estado.replace('_', ' ')}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-500" />
              Notificaciones
            </h3>
            <div className="space-y-3">
              {recentNotifications.length > 0 ? (
                recentNotifications.map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-xl border ${getNotificationColor(notification.tipo)} ${!notification.leida ? 'ring-2 ring-blue-200' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.tipo)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{notification.titulo}</h4>
                        <p className="text-xs mt-1">{notification.mensaje}</p>
                        <p className="text-xs mt-2 opacity-75">{formatDate(notification.fechaCreacion)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Bell className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No hay notificaciones</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Activity Chart */}
      <div className="mt-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
              Análisis de Actividad
            </h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl flex items-center justify-center border border-gray-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">Gráfico de actividad</p>
              <p className="text-xs text-gray-400">Próximamente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
