'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/Layout';
import { reviewService } from '../../services/reviewService';
import { Review, ReviewStatus, ReviewSearchParams } from '../../types/review';
import { 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  Calendar,
  User,
  Filter,
  Search
} from 'lucide-react';
import Link from 'next/link';

export default function ReviewsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState<ReviewSearchParams>({
    page: 0,
    size: 10,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadReviews();
    }
  }, [isAuthenticated, searchParams]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getMyReviews(searchParams);
      setReviews(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number);
    } catch (error: any) {
      setError(error.message || 'Error al cargar revisiones');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const estado = formData.get('estado') as string;
    const prioridad = formData.get('prioridad') as string;

    setSearchParams(prev => ({
      ...prev,
      estado: estado ? (estado as ReviewStatus) : undefined,
      prioridad: prioridad || undefined,
      page: 0,
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({
      ...prev,
      page,
    }));
  };

  const getStatusColor = (status: ReviewStatus | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusColors: { [key: string]: string } = {
      [ReviewStatus.PENDIENTE]: 'bg-gray-100 text-gray-800',
      [ReviewStatus.EN_PROCESO]: 'bg-blue-100 text-blue-800',
      [ReviewStatus.DEVUELTA]: 'bg-orange-100 text-orange-800',
      [ReviewStatus.ACEPTADA]: 'bg-green-100 text-green-800',
      [ReviewStatus.RECHAZADA]: 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: ReviewStatus | undefined) => {
    if (!status) return Clock;
    
    const statusIcons: { [key: string]: any } = {
      [ReviewStatus.PENDIENTE]: Clock,
      [ReviewStatus.EN_PROCESO]: FileText,
      [ReviewStatus.DEVUELTA]: AlertCircle,
      [ReviewStatus.ACEPTADA]: CheckCircle,
      [ReviewStatus.RECHAZADA]: XCircle,
    };
    return statusIcons[status] || Clock;
  };

  const getPriorityColor = (priority: string) => {
    const priorityColors: { [key: string]: string } = {
      'BAJA': 'bg-green-100 text-green-800',
      'MEDIA': 'bg-yellow-100 text-yellow-800',
      'ALTA': 'bg-red-100 text-red-800',
    };
    return priorityColors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Mis Revisiones
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {reviews.length} revisiones asignadas
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Search and Filters */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  <Filter className="inline h-5 w-5 mr-2" />
                  Filtros de Búsqueda
                </h3>
                <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                      Estado
                    </label>
                    <select
                      name="estado"
                      id="estado"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Todos los estados</option>
                      <option value={ReviewStatus.PENDIENTE}>Pendiente</option>
                      <option value={ReviewStatus.EN_PROCESO}>En Proceso</option>
                      <option value={ReviewStatus.DEVUELTA}>Devuelta</option>
                      <option value={ReviewStatus.ACEPTADA}>Aceptada</option>
                      <option value={ReviewStatus.RECHAZADA}>Rechazada</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700">
                      Prioridad
                    </label>
                    <select
                      name="prioridad"
                      id="prioridad"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Todas las prioridades</option>
                      <option value="BAJA">Baja</option>
                      <option value="MEDIA">Media</option>
                      <option value="ALTA">Alta</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Buscar
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Reviews List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                    {error.includes('Servidor no disponible') && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                          <strong>Para solucionar este problema:</strong>
                        </p>
                        <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                          <li>Abra una nueva terminal</li>
                          <li>Navegue al directorio del proyecto</li>
                          <li>Ejecute: <code className="bg-yellow-100 px-1 rounded">node mock-server.js</code></li>
                          <li>Espere el mensaje "Mock server running on http://localhost:8080"</li>
                          <li>Recargue esta página</li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay revisiones asignadas</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No tienes revisiones pendientes en este momento.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => {
                      const StatusIcon = getStatusIcon(review.estadoRevision);
                      return (
                        <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.estadoRevision)}`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {review.estadoRevision ? review.estadoRevision.replace('_', ' ') : 'Sin estado'}
                                </span>
                                {review.prioridad && (
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(review.prioridad)}`}>
                                    {review.prioridad}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-lg font-medium text-gray-900 mb-1">
                                Revisión #{review.id}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                Publicación ID: {review.publicacionId}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                {review.fechaAsignacion && (
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>Asignado: {formatDate(review.fechaAsignacion)}</span>
                                  </div>
                                )}
                                {review.fechaInicio && (
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>Iniciado: {formatDate(review.fechaInicio)}</span>
                                  </div>
                                )}
                                {review.fechaCompletado && (
                                  <div className="flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    <span>Completado: {formatDate(review.fechaCompletado)}</span>
                                  </div>
                                )}
                                {review.tiempoEstimado && (
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>Estimado: {review.tiempoEstimado} días</span>
                                  </div>
                                )}
                              </div>
                              {review.comentarios && review.comentarios.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500">
                                    {review.comentarios.length} comentarios realizados
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/reviews/${review.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              {review.estadoRevision && review.estadoRevision === ReviewStatus.PENDIENTE && (
                                <Link
                                  href={`/reviews/${review.id}/start`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <FileText className="h-4 w-4" />
                                </Link>
                              )}
                              {review.estadoRevision && review.estadoRevision === ReviewStatus.EN_PROCESO && (
                                <Link
                                  href={`/reviews/${review.id}/submit`}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Página <span className="font-medium">{currentPage + 1}</span> de{' '}
                          <span className="font-medium">{totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Anterior
                          </button>
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  page === currentPage
                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {page + 1}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Siguiente
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
