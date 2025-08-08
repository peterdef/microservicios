'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { reviewService } from '../../services/reviewService';
import { notificationService } from '../../services/notificationService';
import { publicationService } from '../../services/publicationService';
import { Layout } from '../../components/Layout';
import { 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Star,
  MessageSquare,
  FileText,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Save,
  X,
  Info,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';

interface Review {
  id: number;
  publicacion: {
    id: number;
    titulo: string;
    autor?: {
      id: number;
      nombres: string;
      apellidos: string;
      email: string;
    };
    autores?: string[];
    abstract?: string;
    contenido?: string;
  };
  revisor: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
  };
  estado: string;
  fechaAsignacion: string;
  fechaLimite: string;
  fechaInicio?: string;
  fechaCompletado?: string;
  comentarios: string[] | string;
  calificacion?: number;
  recomendacion?: string;
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [pendingPublications, setPendingPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'assigned' | 'in-progress' | 'completed'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state for review completion
  const [reviewForm, setReviewForm] = useState({
    calificacion: 0,
    recomendacion: '',
    comentarios: ''
  });

  useEffect(() => {
    if (user && user.roles.includes('ROLE_REVISOR')) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    await Promise.all([
      loadMyReviews(),
      loadPendingPublications()
    ]);
  };

  const loadMyReviews = async () => {
    try {
      setLoading(true);
      const reviews = await reviewService.getMyReviews();
      // Asegurar que los datos tengan la estructura correcta
      const formattedReviews = reviews.map((review: any) => ({
        ...review,
        publicacion: {
          ...review.publicacion,
          autor: review.publicacion.autor || null,
          autores: review.publicacion.autores || []
        },
        comentarios: review.comentarios || []
      }));
      setMyReviews(formattedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setMessage({ type: 'error', text: 'Error al cargar las revisiones' });
    } finally {
      setLoading(false);
    }
  };

  // Cargar todas las publicaciones pendientes de revisión
  const loadPendingPublications = async () => {
    try {
      const publications = await publicationService.getPublicationsByStatus('PENDIENTE_REVISION');
      // Asegurar que los datos tengan la estructura correcta
      const formattedPublications = publications.map((publication: any) => ({
        ...publication,
        autor: publication.autor || null,
        abstract: publication.abstract || publication.resumen || '',
        categoria: publication.categoria || 'Sin categoría'
      }));
      setPendingPublications(formattedPublications);
    } catch (error) {
      console.error('Error loading pending publications:', error);
      setPendingPublications([]);
    }
  };

  const handleStartReview = async (reviewId: number) => {
    try {
      // Buscar la notificación correspondiente
      const notifications = await notificationService.getMyNotifications();
      const reviewNotification = notifications.find((n: any) => 
        n.tipo === 'REVIEW_ASSIGNED' && n.metadata?.reviewId === reviewId
      );

      if (reviewNotification) {
        await notificationService.iniciarRevision(reviewNotification.id);
        setMessage({ type: 'success', text: 'Revisión iniciada exitosamente' });
        await loadMyReviews();
      } else {
        // Si no hay notificación, actualizar directamente
        await reviewService.updateReview(reviewId, {
          estado: 'EN_PROGRESO',
          fechaCompletado: new Date().toISOString()
        });
        setMessage({ type: 'success', text: 'Revisión iniciada exitosamente' });
        await loadMyReviews();
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al iniciar revisión' });
    }
  };

  const handleCompleteReview = async () => {
    if (!selectedReview) return;

    if (reviewForm.calificacion < 1 || reviewForm.calificacion > 10) {
      setMessage({ type: 'error', text: 'La calificación debe ser entre 1 y 10' });
      return;
    }

    if (!reviewForm.recomendacion) {
      setMessage({ type: 'error', text: 'Debes seleccionar una recomendación' });
      return;
    }

    if (!reviewForm.comentarios.trim()) {
      setMessage({ type: 'error', text: 'Debes agregar comentarios a la revisión' });
      return;
    }

    try {
      // Buscar la notificación correspondiente
      const notifications = await notificationService.getMyNotifications();
      const reviewNotification = notifications.find((n: any) => 
        n.tipo === 'REVIEW_STARTED' && n.metadata?.reviewId === selectedReview.id
      );

      if (reviewNotification) {
        await notificationService.completarRevision(reviewNotification.id, {
          calificacion: reviewForm.calificacion,
          recomendacion: reviewForm.recomendacion as 'ACEPTAR' | 'RECHAZAR' | 'CAMBIOS_MINOR' | 'CAMBIOS_MAJOR',
          comentarios: reviewForm.comentarios
        });
      } else {
        // Si no hay notificación, actualizar directamente
        await reviewService.updateReview(selectedReview.id, {
          estado: 'COMPLETADA',
          fechaCompletado: new Date().toISOString(),
          comentarios: reviewForm.comentarios
        });
      }

      setMessage({ type: 'success', text: 'Revisión completada exitosamente' });
      setShowReviewModal(false);
      setSelectedReview(null);
      setReviewForm({ calificacion: 0, recomendacion: '', comentarios: '' });
      await loadMyReviews();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al completar revisión' });
    }
  };

  // Métodos para aprobar/rechazar publicaciones directamente
  const handleApprovePublication = async (publicationId: number) => {
    try {
      await publicationService.updatePublication(publicationId, {
        estado: 'APROBADA'
      });

      // Crear notificación para el autor
      const publication = pendingPublications.find(p => p.id === publicationId);
      if (publication && publication.autor) {
        await notificationService.createRoleBasedNotification(
          'PUBLICATION_APPROVED' as any,
          'PUBLICATION' as any,
          'Publicación Aprobada',
          `Tu publicación "${publication.titulo}" ha sido aprobada y está lista para publicación.`,
          publication.autor.email,
          'MEDIUM' as any,
          {
            publicationId: publicationId,
            publicationTitle: publication.titulo
          }
        );
      }

      setMessage({ type: 'success', text: 'Publicación aprobada exitosamente' });
      await loadAllData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al aprobar publicación' });
    }
  };

  const handleRejectPublication = async (publicationId: number) => {
    try {
      await publicationService.updatePublication(publicationId, {
        estado: 'RECHAZADA'
      });

      // Crear notificación para el autor
      const publication = pendingPublications.find(p => p.id === publicationId);
      if (publication && publication.autor) {
        await notificationService.createRoleBasedNotification(
          'PUBLICATION_REJECTED' as any,
          'PUBLICATION' as any,
          'Publicación Rechazada',
          `Tu publicación "${publication.titulo}" ha sido rechazada. Por favor, revisa los comentarios del revisor.`,
          publication.autor.email,
          'HIGH' as any,
          {
            publicationId: publicationId,
            publicationTitle: publication.titulo
          }
        );
      }

      setMessage({ type: 'success', text: 'Publicación rechazada exitosamente' });
      await loadAllData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al rechazar publicación' });
    }
  };

  const handleRequestChanges = async (publicationId: number) => {
    try {
      await publicationService.updatePublication(publicationId, {
        estado: 'CAMBIOS_SOLICITADOS'
      });

      // Crear notificación para el autor
      const publication = pendingPublications.find(p => p.id === publicationId);
      if (publication && publication.autor) {
        await notificationService.createRoleBasedNotification(
          'PUBLICATION_CHANGES_REQUESTED' as any,
          'PUBLICATION' as any,
          'Cambios Solicitados',
          `Se han solicitado cambios en tu publicación "${publication.titulo}". Por favor, revisa los comentarios del revisor.`,
          publication.autor.email,
          'HIGH' as any,
          {
            publicationId: publicationId,
            publicationTitle: publication.titulo
          }
        );
      }

      setMessage({ type: 'success', text: 'Cambios solicitados exitosamente' });
      await loadAllData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al solicitar cambios' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASIGNADA':
        return 'bg-blue-100 text-blue-800';
      case 'EN_PROGRESO':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETADA':
        return 'bg-green-100 text-green-800';
      case 'VENCIDA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ASIGNADA':
        return <Eye className="h-4 w-4" />;
      case 'EN_PROGRESO':
        return <Clock className="h-4 w-4" />;
      case 'COMPLETADA':
        return <CheckCircle className="h-4 w-4" />;
      case 'VENCIDA':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'ACEPTAR':
        return <ThumbsUp className="h-4 w-4 text-green-600" />;
      case 'RECHAZAR':
        return <ThumbsDown className="h-4 w-4 text-red-600" />;
      case 'CAMBIOS_MINOR':
      case 'CAMBIOS_MAJOR':
        return <Edit className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const filteredReviews = myReviews.filter(review => {
    switch (filter) {
      case 'assigned':
        return review.estado === 'ASIGNADA';
      case 'in-progress':
        return review.estado === 'EN_PROGRESO';
      case 'completed':
        return review.estado === 'COMPLETADA';
      default:
        return true;
    }
  });

  const isOverdue = (review: Review) => {
    return new Date(review.fechaLimite) < new Date() && review.estado !== 'COMPLETADA';
  };

  const calculateAverageReviewTime = () => {
    const completedReviews = myReviews.filter(r => r.estado === 'COMPLETADA');
    if (completedReviews.length === 0) return 0;

    const totalDays = completedReviews.reduce((sum, review) => {
      const startDate = new Date(review.fechaInicio || review.fechaAsignacion);
      const endDate = new Date(review.fechaCompletado || review.fechaLimite);
      return sum + (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    }, 0);

    return Math.round((totalDays / completedReviews.length) * 10) / 10;
  };

  const calculateAverageRating = () => {
    const completedReviews = myReviews.filter(r => r.estado === 'COMPLETADA');
    if (completedReviews.length === 0) return 0;

    const totalRating = completedReviews.reduce((sum, review) => {
      return sum + (review.calificacion || 0);
    }, 0);

    return Math.round((totalRating / completedReviews.length) * 10) / 10;
  };

  const calculateProgressDays = (review: Review) => {
    const startDate = new Date(review.fechaAsignacion);
    const currentDate = new Date();
    return Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateProgressPercentage = (review: Review) => {
    const startDate = new Date(review.fechaAsignacion);
    const endDate = new Date(review.fechaLimite);
    const currentDate = new Date();
    
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = currentDate.getTime() - startDate.getTime();
    
    if (totalDuration <= 0) return 100;
    
    const percentage = (elapsed / totalDuration) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceso Denegado</h3>
          <p className="text-gray-500">
            Debes iniciar sesión para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  const isReviewer = user.roles.includes('ROLE_REVISOR');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando revisiones...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isReviewer ? 'Mis Revisiones' : 'Publicaciones Pendientes'}
              </h1>
              <p className="mt-2 text-gray-600">
                {isReviewer 
                  ? 'Gestiona las revisiones asignadas y emite tus evaluaciones'
                  : 'Visualiza las publicaciones que están pendientes de revisión'
                }
              </p>
            </div>
            <button
              onClick={loadAllData}
              className="btn-secondary flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 mr-2" />
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-${isReviewer ? '5' : '3'} gap-6 mb-8`}>
          {isReviewer && (
            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mis Revisiones</p>
                  <p className="text-2xl font-bold text-gray-900">{myReviews.length}</p>
                </div>
              </div>
            </div>
          )}

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{pendingPublications.length}</p>
              </div>
            </div>
          </div>

          {!isReviewer && (
            <>
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Sistema Activo</p>
                    <p className="text-2xl font-bold text-gray-900">✓</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {isReviewer && (
            <>
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Asignadas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {myReviews.filter(r => r.estado === 'ASIGNADA').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completadas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {myReviews.filter(r => r.estado === 'COMPLETADA').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Vencidas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {myReviews.filter(r => isOverdue(r)).length}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Progress Overview - Solo para revisores */}
        {isReviewer && myReviews.length > 0 && (
          <div className="card mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Progreso de Revisiones
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Progreso General */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Progreso General</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Completadas</span>
                      <span className="text-sm font-medium text-green-600">
                        {myReviews.filter(r => r.estado === 'COMPLETADA').length}/{myReviews.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(myReviews.filter(r => r.estado === 'COMPLETADA').length / myReviews.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Tiempo Promedio */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Tiempo Promedio</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Días por revisión</span>
                      <span className="text-sm font-medium text-blue-600">
                        {calculateAverageReviewTime()} días
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Basado en revisiones completadas
                    </div>
                  </div>
                </div>

                {/* Calificación Promedio */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Calificación Promedio</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Puntuación</span>
                      <span className="text-sm font-medium text-yellow-600">
                        {calculateAverageRating()}/10
                      </span>
                    </div>
                    <div className="flex items-center">
                      {[...Array(10)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.round(calculateAverageRating()) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'assigned', label: 'Asignadas' },
              { key: 'in-progress', label: 'En Progreso' },
              { key: 'completed', label: 'Completadas' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === filterOption.key
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pending Publications */}
        <div className="card mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Publicaciones Pendientes de Revisión ({pendingPublications.length})
            </h3>
            {!isReviewer && (
              <p className="text-sm text-gray-600 mt-1">
                Solo los revisores pueden aprobar o rechazar publicaciones
              </p>
            )}
          </div>
          <div className="p-6">
            {pendingPublications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No hay publicaciones pendientes de revisión</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPublications.map((publication) => (
                  <div key={publication.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 mr-3">
                            {publication.titulo || 'Sin título'}
                          </h4>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pendiente
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <strong>Autor:</strong> {publication.autor ? `${publication.autor.nombres || ''} ${publication.autor.apellidos || ''}`.trim() : 'No especificado'}
                          </div>
                          <div>
                            <strong>Categoría:</strong> {publication.categoria || 'Sin categoría'}
                          </div>
                          <div>
                            <strong>Tipo:</strong> {publication.tipo || 'Artículo'}
                          </div>
                          <div>
                            <strong>Fecha de envío:</strong> {publication.fechaCreacion ? new Date(publication.fechaCreacion).toLocaleDateString() : 'Sin fecha'}
                          </div>
                        </div>

                        {publication.palabrasClave && publication.palabrasClave.length > 0 && (
                          <div className="mb-3">
                            <strong className="text-sm text-gray-700">Palabras clave:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {publication.palabrasClave.map((keyword: string, index: number) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {isReviewer && (
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => handleApprovePublication(publication.id)}
                            className="btn-primary flex items-center text-sm px-4 py-2"
                          >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleRequestChanges(publication.id)}
                            className="btn-secondary flex items-center text-sm px-4 py-2"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Solicitar Cambios
                          </button>
                          <button
                            onClick={() => handleRejectPublication(publication.id)}
                            className="btn-secondary flex items-center text-sm px-4 py-2 bg-red-600 hover:bg-red-700"
                          >
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {publication.resumen && (
                      <div className="mt-4 p-4 bg-white rounded-md border border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-2">Resumen</h5>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {publication.resumen.length > 300 
                            ? `${publication.resumen.substring(0, 300)}...` 
                            : publication.resumen
                          }
                        </p>
                        {publication.resumen.length > 300 && (
                          <button className="text-indigo-600 hover:text-indigo-800 text-sm mt-2">
                            Leer más
                          </button>
                        )}
                      </div>
                    )}

                    {publication.tipo === 'LIBRO' && publication.capitulos && publication.capitulos.length > 0 && (
                      <div className="mt-4 p-4 bg-white rounded-md border border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-2">Capítulos ({publication.capitulos.length})</h5>
                        <div className="space-y-2">
                          {publication.capitulos.slice(0, 3).map((chapter: any, index: number) => (
                            <div key={index} className="text-sm text-gray-700">
                              <strong>Capítulo {chapter.numero}:</strong> {chapter.titulo}
                            </div>
                          ))}
                          {publication.capitulos.length > 3 && (
                            <div className="text-sm text-gray-500">
                              +{publication.capitulos.length - 3} capítulos más
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews List - Solo para revisores */}
        {isReviewer && (
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Mis Revisiones Asignadas ({filteredReviews.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Gestiona tus revisiones asignadas y completa las evaluaciones
              </p>
            </div>
          <div className="p-6">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No hay revisiones asignadas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div key={review.id} className={`p-6 rounded-lg border ${
                    isOverdue(review) ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                  } hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <h4 className="text-lg font-semibold text-gray-900 mr-3">
                            {review.publicacion.titulo || 'Sin título'}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.estado)}`}>
                            {getStatusIcon(review.estado)}
                            <span className="ml-1">{review.estado}</span>
                          </span>
                          {isOverdue(review) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Vencida
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <strong>Autor:</strong> {review.publicacion.autor ? `${review.publicacion.autor.nombres || ''} ${review.publicacion.autor.apellidos || ''}`.trim() : 'No especificado'}
                          </div>
                          <div>
                            <strong>Asignada:</strong> {new Date(review.fechaAsignacion).toLocaleDateString()}
                          </div>
                          <div>
                            <strong>Límite:</strong> {new Date(review.fechaLimite).toLocaleDateString()}
                          </div>
                        </div>

                        {review.calificacion && (
                          <div className="mb-3">
                            <div className="flex items-center">
                              <strong className="text-sm text-gray-700 mr-2">Calificación:</strong>
                              <div className="flex items-center">
                                {[...Array(10)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.calificacion! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm">({review.calificacion}/10)</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {review.recomendacion && (
                          <div className="mb-3">
                            <div className="flex items-center">
                              {getRecommendationIcon(review.recomendacion)}
                              <span className="ml-2 text-sm font-medium">
                                Recomendación: {review.recomendacion}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Información de progreso */}
                        {review.estado === 'EN_PROGRESO' && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-md">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-blue-700">Revisión en progreso</span>
                              <span className="text-blue-600 font-medium">
                                {calculateProgressDays(review)} días transcurridos
                              </span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${calculateProgressPercentage(review)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        {review.estado === 'ASIGNADA' && (
                          <button
                            onClick={() => handleStartReview(review.id)}
                            className="btn-primary flex items-center px-4 py-2"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Iniciar Revisión
                          </button>
                        )}
                        {review.estado === 'EN_PROGRESO' && (
                          <button
                            onClick={() => {
                              setSelectedReview(review);
                              setShowReviewModal(true);
                            }}
                            className="btn-primary flex items-center px-4 py-2"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completar Revisión
                          </button>
                        )}
                        {review.estado === 'COMPLETADA' && (
                          <button
                            onClick={() => {
                              setSelectedReview(review);
                              setShowReviewModal(true);
                            }}
                            className="btn-secondary flex items-center px-4 py-2"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      {review.estado === 'COMPLETADA' && review.fechaCompletado && (
                        <span>Completada: {new Date(review.fechaCompletado).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Review Completion Modal */}
        {showReviewModal && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedReview.estado === 'COMPLETADA' ? 'Detalles de Revisión' : 'Completar Revisión'}
                </h3>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedReview(null);
                    setReviewForm({ calificacion: 0, recomendacion: '', comentarios: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Publicación</h4>
                <p className="text-sm text-blue-700">{selectedReview.publicacion.titulo}</p>
                <p className="text-xs text-blue-600">
                  Autor: {selectedReview.publicacion.autor 
                    ? `${selectedReview.publicacion.autor.nombres} ${selectedReview.publicacion.autor.apellidos}`
                    : selectedReview.publicacion.autores 
                      ? selectedReview.publicacion.autores.join(', ')
                      : 'No especificado'
                  }
                </p>
              </div>

              {selectedReview.estado === 'COMPLETADA' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
                    <div className="flex items-center">
                      {[...Array(10)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < (selectedReview.calificacion || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm">({selectedReview.calificacion}/10)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recomendación</label>
                    <div className="flex items-center">
                      {getRecommendationIcon(selectedReview.recomendacion || '')}
                      <span className="ml-2 text-sm font-medium">{selectedReview.recomendacion}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios</label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">
                        {typeof selectedReview.comentarios === 'string' 
                          ? selectedReview.comentarios 
                          : selectedReview.comentarios 
                            ? selectedReview.comentarios.join('\n') 
                            : 'Sin comentarios'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calificación (1-10)
                    </label>
                    <div className="flex items-center space-x-2">
                      {[...Array(10)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setReviewForm(prev => ({ ...prev, calificacion: i + 1 }))}
                          className={`p-1 rounded ${
                            i < reviewForm.calificacion ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <Star className={`h-6 w-6 ${
                            i < reviewForm.calificacion ? 'fill-current' : ''
                          }`} />
                        </button>
                      ))}
                      <span className="ml-2 text-sm">({reviewForm.calificacion}/10)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recomendación
                    </label>
                    <select
                      value={reviewForm.recomendacion}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, recomendacion: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Selecciona una recomendación</option>
                      <option value="ACEPTAR">Aceptar</option>
                      <option value="RECHAZAR">Rechazar</option>
                      <option value="CAMBIOS_MINOR">Cambios Menores</option>
                      <option value="CAMBIOS_MAJOR">Cambios Mayores</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentarios
                    </label>
                    <textarea
                      value={reviewForm.comentarios}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comentarios: e.target.value }))}
                      rows={6}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Escribe tus comentarios y observaciones sobre la publicación..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setShowReviewModal(false);
                        setSelectedReview(null);
                        setReviewForm({ calificacion: 0, recomendacion: '', comentarios: '' });
                      }}
                      className="btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCompleteReview}
                      className="btn-primary flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Completar Revisión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
