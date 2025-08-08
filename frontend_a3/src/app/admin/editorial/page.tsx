'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { Layout } from '../../../components/Layout';
import { publicationService } from '../../../services/publicationService';
import { reviewService } from '../../../services/reviewService';
import { notificationService } from '../../../services/notificationService';
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  BarChart3,
  Calendar,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  Settings,
  Bell,
  Star,
  TrendingUp,
  BookOpen,
  UserCheck,
  Award,
  Target,
  PieChart,
  Activity
} from 'lucide-react';

interface EditorialStats {
  totalPublications: number;
  pendingReviews: number;
  completedReviews: number;
  averageReviewTime: number;
  publicationSuccessRate: number;
  activeReviewers: number;
  publicationsThisMonth: number;
  reviewsThisMonth: number;
}

interface PublicationSummary {
  id: number;
  titulo: string;
  autor: {
    nombres: string;
    apellidos: string;
    email: string;
  };
  estado: string;
  fechaCreacion: string;
  categoria: string;
  prioridad: string;
}

interface ReviewerSummary {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  especialidades: string[];
  publicacionesRevisadas: number;
  tiempoPromedio: number;
  calificacion: number;
}

export default function EditorialPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<EditorialStats | null>(null);
  const [recentPublications, setRecentPublications] = useState<PublicationSummary[]>([]);
  const [topReviewers, setTopReviewers] = useState<ReviewerSummary[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadEditorialData();
    }
  }, [isAuthenticated, isLoading, router]);

  const loadEditorialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos de publicaciones y reviews
      const [publications, reviews] = await Promise.all([
        publicationService.getPublications(),
        reviewService.getReviews()
      ]);

      // Calcular estadísticas
      const editorialStats: EditorialStats = {
        totalPublications: publications.length,
        pendingReviews: reviews.filter((r: any) => r.estado === 'PENDIENTE').length,
        completedReviews: reviews.filter((r: any) => r.estado === 'COMPLETADA').length,
        averageReviewTime: calculateAverageReviewTime(reviews),
        publicationSuccessRate: calculatePublicationSuccessRate(publications),
        activeReviewers: calculateActiveReviewers(reviews),
        publicationsThisMonth: calculatePublicationsThisMonth(publications),
        reviewsThisMonth: calculateReviewsThisMonth(reviews)
      };

      setStats(editorialStats);

             // Preparar publicaciones recientes
       const recentPubs = publications
         .slice(0, 5)
         .map((pub: any) => ({
           id: pub.id,
           titulo: pub.titulo,
           autor: pub.autor || { nombres: 'Autor', apellidos: 'Desconocido', email: 'autor@desconocido.com' },
           estado: pub.estado,
           fechaCreacion: pub.fechaCreacion,
           categoria: pub.categoria,
           prioridad: getPriorityFromStatus(pub.estado)
         }));

      setRecentPublications(recentPubs);

      // Preparar revisores top
      const reviewers = calculateTopReviewers(reviews);
      setTopReviewers(reviewers);

      // Preparar reviews pendientes
      const pending = reviews
        .filter((r: any) => r.estado === 'PENDIENTE')
        .slice(0, 10);
      setPendingReviews(pending);

    } catch (error: any) {
      console.error('Error loading editorial data:', error);
      setError(error.message || 'Error al cargar datos editoriales');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageReviewTime = (reviews: any[]): number => {
    const completedReviews = reviews.filter((r: any) => r.estado === 'COMPLETADA' && r.fechaCompletado);
    if (completedReviews.length === 0) return 0;

    const totalDays = completedReviews.reduce((sum: number, review: any) => {
      const start = new Date(review.fechaAsignacion);
      const end = new Date(review.fechaCompletado);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    }, 0);

    return Math.round(totalDays / completedReviews.length);
  };

  const calculatePublicationSuccessRate = (publications: any[]): number => {
    if (publications.length === 0) return 0;
    const published = publications.filter((p: any) => p.estado === 'PUBLICADO').length;
    return Math.round((published / publications.length) * 100);
  };

     const calculateActiveReviewers = (reviews: any[]): number => {
     const activeReviewers = new Set();
     reviews.forEach((review: any) => {
       if (review.revisor && review.revisor.email && review.revisor.nombres && review.revisor.apellidos) {
         activeReviewers.add(review.revisor.email);
       }
     });
     return activeReviewers.size;
   };

  const calculatePublicationsThisMonth = (publications: any[]): number => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    return publications.filter((pub: any) => {
      const pubDate = new Date(pub.fechaCreacion);
      return pubDate >= thisMonth;
    }).length;
  };

  const calculateReviewsThisMonth = (reviews: any[]): number => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    return reviews.filter((review: any) => {
      const reviewDate = new Date(review.fechaAsignacion);
      return reviewDate >= thisMonth;
    }).length;
  };

  const getPriorityFromStatus = (status: string): string => {
    switch (status) {
      case 'PUBLICADO': return 'BAJA';
      case 'EN_REVISION': return 'ALTA';
      case 'BORRADOR': return 'MEDIA';
      default: return 'MEDIA';
    }
  };

  const calculateTopReviewers = (reviews: any[]): ReviewerSummary[] => {
    const reviewerStats: { [key: string]: any } = {};

         reviews.forEach((review: any) => {
       if (review.revisor && review.revisor.email && review.revisor.nombres && review.revisor.apellidos) {
         const email = review.revisor.email;
         if (!reviewerStats[email]) {
           reviewerStats[email] = {
             id: review.revisor.id,
             nombres: review.revisor.nombres,
             apellidos: review.revisor.apellidos,
             email: review.revisor.email,
             especialidades: ['General'],
             publicacionesRevisadas: 0,
             tiempoTotal: 0,
             reviewsCount: 0
           };
         }

        reviewerStats[email].publicacionesRevisadas++;
        reviewerStats[email].reviewsCount++;

        if (review.estado === 'COMPLETADA' && review.fechaCompletado) {
          const start = new Date(review.fechaAsignacion);
          const end = new Date(review.fechaCompletado);
          const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
          reviewerStats[email].tiempoTotal += days;
        }
      }
    });

    return Object.values(reviewerStats)
      .map((reviewer: any) => ({
        ...reviewer,
        tiempoPromedio: reviewer.reviewsCount > 0 ? Math.round(reviewer.tiempoTotal / reviewer.reviewsCount) : 0,
        calificacion: Math.min(5, Math.max(1, 5 - Math.floor(reviewer.tiempoPromedio / 7)))
      }))
      .sort((a: any, b: any) => b.publicacionesRevisadas - a.publicacionesRevisadas)
      .slice(0, 5);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLICADO': return 'bg-green-100 text-green-800';
      case 'EN_REVISION': return 'bg-yellow-100 text-yellow-800';
      case 'BORRADOR': return 'bg-gray-100 text-gray-800';
      case 'PENDIENTE': return 'bg-blue-100 text-blue-800';
      case 'COMPLETADA': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLICADO': return <CheckCircle className="h-4 w-4" />;
      case 'EN_REVISION': return <Clock className="h-4 w-4" />;
      case 'BORRADOR': return <FileText className="h-4 w-4" />;
      case 'PENDIENTE': return <AlertCircle className="h-4 w-4" />;
      case 'COMPLETADA': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel Editorial</h1>
                <p className="text-gray-600">Gestión de publicaciones y revisiones</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Publicación
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', name: 'Resumen', icon: BarChart3 },
                { id: 'publications', name: 'Publicaciones', icon: FileText },
                { id: 'reviews', name: 'Revisiones', icon: UserCheck },
                { id: 'reviewers', name: 'Revisores', icon: Users },
                { id: 'analytics', name: 'Analíticas', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Publicaciones
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.totalPublications}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Reviews Pendientes
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.pendingReviews}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Tasa de Éxito
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.publicationSuccessRate}%
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Revisores Activos
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.activeReviewers}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Publications */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Publicaciones Recientes
                  </h3>
                </div>
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {recentPublications.map((publication) => (
                      <li key={publication.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {getStatusIcon(publication.estado)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {publication.titulo}
                              </div>
                                                             <div className="text-sm text-gray-500">
                                 {publication.autor?.nombres} {publication.autor?.apellidos} • {publication.categoria}
                               </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(publication.estado)}`}>
                              {publication.estado}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(publication.fechaCreacion)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Top Reviewers */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Top Revisores
                  </h3>
                </div>
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {topReviewers.map((reviewer) => (
                      <li key={reviewer.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {reviewer.nombres.charAt(0)}{reviewer.apellidos.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {reviewer.nombres} {reviewer.apellidos}
                              </div>
                              <div className="text-sm text-gray-500">
                                {reviewer.publicacionesRevisadas} publicaciones revisadas
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                              {reviewer.tiempoPromedio} días promedio
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < reviewer.calificacion ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'publications' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Gestión de Publicaciones
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Administra todas las publicaciones del sistema
                </p>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Funcionalidad en desarrollo</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    La gestión completa de publicaciones estará disponible próximamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'reviews' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Gestión de Revisiones
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Administra las revisiones pendientes y completadas
                </p>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Funcionalidad en desarrollo</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    La gestión completa de revisiones estará disponible próximamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'reviewers' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Gestión de Revisores
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Administra el equipo de revisores
                </p>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Funcionalidad en desarrollo</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    La gestión completa de revisores estará disponible próximamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'analytics' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Analíticas Editoriales
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Estadísticas detalladas y métricas de rendimiento
                </p>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Funcionalidad en desarrollo</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Las analíticas detalladas estarán disponibles próximamente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
