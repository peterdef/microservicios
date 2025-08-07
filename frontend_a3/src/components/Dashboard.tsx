'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  BookOpen, 
  Eye, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Activity,
  Bell,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  Award,
  Zap,
  Globe,
  Bookmark,
  Lightbulb,
  Rocket,
  Home,
  Settings,
  Mail,
  MessageSquare,
  Download,
  Share2,
  Heart,
  ThumbsUp,
  CalendarDays,
  Clock3,
  Users2,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronRight,
  Play,
  Pause,
  RefreshCw,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalPublications: number;
  myPublications: number;
  pendingReviews: number;
  completedReviews: number;
  recentActivity: number;
  publicationsByStatus: { status: string; count: number }[];
  publicationsByType: { type: string; count: number }[];
  recentPublications: Array<{
    id: string;
    title: string;
    status: string;
    date: string;
    type: string;
    views?: number;
    downloads?: number;
    likes?: number;
  }>;
  recentReviews: Array<{
    id: string;
    publicationTitle: string;
    status: string;
    date: string;
    reviewer?: string;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    date: string;
    read: boolean;
  }>;
  activityTimeline: Array<{
    id: string;
    action: string;
    description: string;
    date: string;
    icon: string;
    color: string;
  }>;
}

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock dashboard data with more realistic and engaging content
  const mockStats: DashboardStats = {
    totalPublications: 45,
    myPublications: 12,
    pendingReviews: 3,
    completedReviews: 8,
    recentActivity: 15,
    publicationsByStatus: [
      { status: 'BORRADOR', count: 8 },
      { status: 'EN_REVISION', count: 15 },
      { status: 'APROBADO', count: 12 },
      { status: 'PUBLICADO', count: 10 }
    ],
    publicationsByType: [
      { type: 'ARTICULO', count: 32 },
      { type: 'LIBRO', count: 13 }
    ],
    recentPublications: [
      {
        id: '1',
        title: 'Análisis de Algoritmos de Machine Learning',
        status: 'EN_REVISION',
        date: '2024-01-25',
        type: 'ARTICULO',
        views: 156,
        downloads: 23,
        likes: 12
      },
      {
        id: '2',
        title: 'Fundamentos de Programación Web',
        status: 'BORRADOR',
        date: '2024-01-24',
        type: 'LIBRO',
        views: 89,
        downloads: 5,
        likes: 8
      },
      {
        id: '3',
        title: 'Inteligencia Artificial en Medicina',
        status: 'APROBADO',
        date: '2024-01-23',
        type: 'ARTICULO',
        views: 234,
        downloads: 45,
        likes: 28
      },
      {
        id: '4',
        title: 'Blockchain y Criptomonedas',
        status: 'PUBLICADO',
        date: '2024-01-22',
        type: 'ARTICULO',
        views: 567,
        downloads: 89,
        likes: 67
      }
    ],
    recentReviews: [
      {
        id: '1',
        publicationTitle: 'Blockchain y Criptomonedas',
        status: 'EN_PROCESO',
        date: '2024-01-25',
        reviewer: 'Dr. María García'
      },
      {
        id: '2',
        publicationTitle: 'Desarrollo de Aplicaciones Móviles',
        status: 'COMPLETADA',
        date: '2024-01-24',
        reviewer: 'Dr. Carlos López'
      },
      {
        id: '3',
        publicationTitle: 'Ciberseguridad Avanzada',
        status: 'EN_PROCESO',
        date: '2024-01-23',
        reviewer: 'Dr. Ana Martínez'
      }
    ],
    notifications: [
      {
        id: '1',
        title: 'Nueva publicación aprobada',
        message: 'Tu artículo "Machine Learning Fundamentals" ha sido aprobado para publicación.',
        type: 'success',
        date: '2024-01-25T10:30:00Z',
        read: false
      },
      {
        id: '2',
        title: 'Revisión solicitada',
        message: 'Se te ha asignado una nueva revisión: "Data Science Applications".',
        type: 'info',
        date: '2024-01-24T15:45:00Z',
        read: false
      },
      {
        id: '3',
        title: 'Cambios requeridos',
        message: 'Tu publicación "Web Development Guide" requiere algunos cambios antes de la aprobación.',
        type: 'warning',
        date: '2024-01-23T09:15:00Z',
        read: true
      }
    ],
    activityTimeline: [
      {
        id: '1',
        action: 'Publicación creada',
        description: 'Nueva publicación "AI in Healthcare" creada',
        date: '2024-01-25T14:30:00Z',
        icon: 'FileText',
        color: 'blue'
      },
      {
        id: '2',
        action: 'Revisión completada',
        description: 'Revisión de "Blockchain Basics" completada',
        date: '2024-01-24T16:20:00Z',
        icon: 'CheckCircle',
        color: 'green'
      },
      {
        id: '3',
        action: 'Artículo publicado',
        description: 'Artículo "Machine Learning Fundamentals" publicado',
        date: '2024-01-23T11:45:00Z',
        icon: 'Star',
        color: 'purple'
      },
      {
        id: '4',
        action: 'Comentario recibido',
        description: 'Nuevo comentario en "Web Development Guide"',
        date: '2024-01-22T13:15:00Z',
        icon: 'MessageSquare',
        color: 'orange'
      }
    ]
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setStats(mockStats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'BORRADOR': 'bg-slate-100 text-slate-800',
      'EN_REVISION': 'bg-amber-100 text-amber-800',
      'APROBADO': 'bg-emerald-100 text-emerald-800',
      'PUBLICADO': 'bg-blue-100 text-blue-800',
      'EN_PROCESO': 'bg-orange-100 text-orange-800',
      'COMPLETADA': 'bg-emerald-100 text-emerald-800'
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
      'COMPLETADA': <CheckCircle className="h-4 w-4" />
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
      'error': <AlertCircle className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <Info className="h-4 w-4" />;
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      'info': 'text-blue-600 bg-blue-50',
      'success': 'text-green-600 bg-green-50',
      'warning': 'text-yellow-600 bg-yellow-50',
      'error': 'text-red-600 bg-red-50'
    };
    return colors[type as keyof typeof colors] || 'text-blue-600 bg-blue-50';
  };

  const getTimelineIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'FileText': <FileText className="h-4 w-4" />,
      'CheckCircle': <CheckCircle className="h-4 w-4" />,
      'Star': <Star className="h-4 w-4" />,
      'MessageSquare': <MessageSquare className="h-4 w-4" />,
      'Eye': <Eye className="h-4 w-4" />,
      'Download': <Download className="h-4 w-4" />,
      'Share2': <Share2 className="h-4 w-4" />
    };
    return icons[iconName] || <Activity className="h-4 w-4" />;
  };

  const getTimelineColor = (color: string) => {
    const colors: { [key: string]: string } = {
      'blue': 'bg-blue-500',
      'green': 'bg-green-500',
      'purple': 'bg-purple-500',
      'orange': 'bg-orange-500',
      'red': 'bg-red-500',
      'yellow': 'bg-yellow-500'
    };
    return colors[color] || 'bg-gray-500';
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
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar el dashboard</h3>
          <p className="text-gray-500">
            No se pudieron cargar las estadísticas del dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
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
                <div className="text-3xl font-bold">{stats.myPublications}</div>
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
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.myPublications}</p>
              <p className="text-xs text-gray-500 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                +2 esta semana
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
                +1 esta semana
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
              <p className="text-sm font-medium text-gray-600 mb-2">Actividad Reciente</p>
              <p className="text-3xl font-bold text-purple-600 mb-1">{stats.recentActivity}</p>
              <p className="text-xs text-gray-500 flex items-center">
                <Zap className="w-3 h-3 mr-1 text-purple-500" />
                +5 esta semana
              </p>
            </div>
            <div className="h-16 w-16 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Activity className="h-8 w-8 text-white" />
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
              {stats.recentPublications.length === 0 ? (
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
                  {stats.recentPublications.map((publication) => (
                    <div key={publication.id} className={`${viewMode === 'grid' ? 'card p-4' : 'flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-100'} hover:bg-white/80 transition-all duration-200 hover:shadow-md group`}>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(publication.type)}
                          <span className="text-sm text-gray-500">{publication.type}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {publication.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {publication.date}
                          </p>
                          {viewMode === 'grid' && publication.views && (
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{publication.views}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Download className="w-3 h-3" />
                                <span>{publication.downloads}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Heart className="w-3 h-3" />
                                <span>{publication.likes}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(publication.status)}`}>
                          {getStatusIcon(publication.status)}
                          <span className="ml-1">{publication.status.replace('_', ' ')}</span>
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
              {stats.activityTimeline.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTimelineColor(activity.color)} text-white text-xs font-medium`}>
                    {getTimelineIcon(activity.icon)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
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
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" />
              Publicaciones por Estado
            </h3>
            <div className="space-y-4">
              {stats.publicationsByStatus.map((item) => (
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

          {/* Recent Reviews */}
          {stats.recentReviews.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-amber-500" />
                Revisiones Recientes
              </h3>
              <div className="space-y-3">
                {stats.recentReviews.map((review) => (
                  <div key={review.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-100 hover:bg-white/80 transition-all duration-200">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {review.publicationTitle}
                      </h4>
                      <p className="text-xs text-gray-500">{review.date}</p>
                      {review.reviewer && (
                        <p className="text-xs text-gray-400">{review.reviewer}</p>
                      )}
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {getStatusIcon(review.status)}
                      <span className="ml-1">{review.status.replace('_', ' ')}</span>
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
              {stats.notifications.map((notification) => (
                <div key={notification.id} className={`p-3 rounded-xl border ${getNotificationColor(notification.type)} ${!notification.read ? 'ring-2 ring-blue-200' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <p className="text-xs mt-1">{notification.message}</p>
                      <p className="text-xs mt-2 opacity-75">{new Date(notification.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
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
