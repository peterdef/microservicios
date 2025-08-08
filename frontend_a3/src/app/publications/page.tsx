'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/Layout';
import { Publication, PublicationStatus, PublicationType } from '../../types/publication';
import { publicationService } from '../../services/publicationService';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  BookOpen, 
  FileText, 
  Clock, 
  CheckCircle, 
  Star, 
  AlertCircle, 
  Calendar, 
  User, 
  Tag,
  Download,
  Share,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Bookmark,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default function PublicationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PublicationStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<PublicationType | ''>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('fecha');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch publications from API
  const fetchPublications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all publications for the current user
      const response = await publicationService.getMyPublications();
      const fetchedPublications = response.content || response; // Handle both paginated and direct array responses
      setPublications(fetchedPublications);
      setTotalPages(Math.ceil(fetchedPublications.length / 5));
    } catch (error: any) {
      console.error('Error fetching publications:', error);
      setError(error.message || 'Error al cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      fetchPublications();
    }
  }, [isAuthenticated, isLoading, router]);

  // Refresh publications when returning from create page
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        fetchPublications();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated]);

  const getStatusColor = (status: PublicationStatus) => {
    const statusColors: { [key in PublicationStatus]: string } = {
      [PublicationStatus.BORRADOR]: 'bg-slate-100 text-slate-800',
      [PublicationStatus.EN_REVISION]: 'bg-amber-100 text-amber-800',
      [PublicationStatus.CAMBIOS_SOLICITADOS]: 'bg-orange-100 text-orange-800',
      [PublicationStatus.APROBADO]: 'bg-emerald-100 text-emerald-800',
      [PublicationStatus.PUBLICADO]: 'bg-blue-100 text-blue-800',
      [PublicationStatus.RETIRADO]: 'bg-red-100 text-red-800'
    };
    return statusColors[status];
  };

  const getStatusIcon = (status: PublicationStatus) => {
    const statusIcons: { [key in PublicationStatus]: React.ReactNode } = {
      [PublicationStatus.BORRADOR]: <FileText className="h-4 w-4" />,
      [PublicationStatus.EN_REVISION]: <Clock className="h-4 w-4" />,
      [PublicationStatus.CAMBIOS_SOLICITADOS]: <Edit className="h-4 w-4" />,
      [PublicationStatus.APROBADO]: <CheckCircle className="h-4 w-4" />,
      [PublicationStatus.PUBLICADO]: <Star className="h-4 w-4" />,
      [PublicationStatus.RETIRADO]: <AlertCircle className="h-4 w-4" />
    };
    return statusIcons[status];
  };

  const getTypeIcon = (type: PublicationType) => {
    return type === PublicationType.ARTICULO ? <FileText className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />;
  };

  const handlePublicationAction = async (action: string, publicationId: string) => {
    try {
      switch (action) {
        case 'view':
          router.push(`/publications/${publicationId}`);
          break;
        case 'edit':
          router.push(`/publications/${publicationId}/edit`);
          break;
        case 'delete':
          if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
            await publicationService.deletePublication(publicationId);
            // Refresh the publications list
            fetchPublications();
          }
          break;
        case 'share':
          // Implement share functionality
          console.log('Sharing publication:', publicationId);
          break;
        case 'download':
          // Implement download functionality
          console.log('Downloading publication:', publicationId);
          break;
      }
    } catch (error: any) {
      console.error(`Error in ${action} action:`, error);
      alert(error.message || `Error al ${action} la publicación`);
    }
  };

  const filteredPublications = publications.filter(publication => {
    const matchesSearch = publication.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         publication.resumen.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || publication.estado === statusFilter;
    const matchesType = !typeFilter || publication.tipo === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort publications
  const sortedPublications = [...filteredPublications].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'fecha':
        aValue = new Date(a.fechaCreacion || '').getTime();
        bValue = new Date(b.fechaCreacion || '').getTime();
        break;
      case 'titulo':
        aValue = a.titulo.toLowerCase();
        bValue = b.titulo.toLowerCase();
        break;
      case 'estado':
        aValue = a.estado;
        bValue = b.estado;
        break;
      default:
        aValue = a.titulo.toLowerCase();
        bValue = b.titulo.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const paginatedPublications = sortedPublications.slice(currentPage * 5, (currentPage + 1) * 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
    setCurrentPage(0);
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
            <p className="text-gray-600 font-medium">Cargando publicaciones...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar publicaciones</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={fetchPublications}
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
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">
                Mis Publicaciones
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Gestiona tus publicaciones académicas y su estado de revisión
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BarChart3 className="w-4 h-4" />
                <span>{filteredPublications.length} publicaciones</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Bookmark className="w-4 h-4" />
                <span>{publications.filter(p => p.estado === PublicationStatus.PUBLICADO).length} publicadas</span>
              </div>
            </div>
            <Link
              href="/publications/create"
              className="btn-primary inline-flex items-center px-6 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nueva Publicación
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-indigo-500" />
              Filtros y Búsqueda
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? 'Ocultar' : 'Mostrar'} filtros</span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input w-full pl-10"
                    placeholder="Buscar por título o resumen..."
                  />
                </div>
              </div>

              {showFilters && (
                <>
                  <div>
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as PublicationStatus | '')}
                      className="input w-full"
                    >
                      <option value="">Todos los estados</option>
                      <option value={PublicationStatus.BORRADOR}>Borrador</option>
                      <option value={PublicationStatus.EN_REVISION}>En Revisión</option>
                      <option value={PublicationStatus.CAMBIOS_SOLICITADOS}>Cambios Solicitados</option>
                      <option value={PublicationStatus.APROBADO}>Aprobado</option>
                      <option value={PublicationStatus.PUBLICADO}>Publicado</option>
                      <option value={PublicationStatus.RETIRADO}>Retirado</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo
                    </label>
                    <select
                      id="type"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as PublicationType | '')}
                      className="input w-full"
                    >
                      <option value="">Todos los tipos</option>
                      <option value={PublicationType.ARTICULO}>Artículo</option>
                      <option value={PublicationType.LIBRO}>Libro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sort" className="block text-sm font-semibold text-gray-700 mb-2">
                      Ordenar por
                    </label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input w-full"
                    >
                      <option value="fecha">Fecha</option>
                      <option value="titulo">Título</option>
                      <option value="estado">Estado</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  className="btn-primary inline-flex items-center px-6 py-2"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </button>
                {(searchTerm || statusFilter || typeFilter) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="btn-secondary inline-flex items-center px-6 py-2"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title={`Ordenar ${sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
                >
                  {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Publications List */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bookmark className="w-5 h-5 mr-2 text-indigo-500" />
                Publicaciones ({filteredPublications.length})
              </h2>
              <div className="text-sm text-gray-500">
                Mostrando {currentPage * 5 + 1} a {Math.min((currentPage + 1) * 5, filteredPublications.length)} de {filteredPublications.length} resultados
              </div>
            </div>
          </div>

          {paginatedPublications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron publicaciones</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter || typeFilter 
                  ? 'Intenta ajustar los filtros de búsqueda.'
                  : 'Comienza creando tu primera publicación.'
                }
              </p>
              {!searchTerm && !statusFilter && !typeFilter && (
                <Link
                  href="/publications/create"
                  className="btn-primary inline-flex items-center px-6 py-3"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Crear Publicación
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {paginatedPublications.map((publication) => (
                <div key={publication.id} className="p-6 hover:bg-gray-50/50 transition-all duration-200 group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {publication.titulo}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(publication.estado)}`}>
                            {getStatusIcon(publication.estado)}
                            <span className="ml-1">{publication.estado.replace('_', ' ')}</span>
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {getTypeIcon(publication.tipo)}
                            <span className="ml-1">{publication.tipo}</span>
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{publication.resumen}</p>
                      
                      <div className="flex items-center space-x-6 text-xs text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{publication.autor || 'Autor'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{publication.fechaCreacion ? new Date(publication.fechaCreacion).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        {publication.palabrasClave && publication.palabrasClave.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Tag className="h-3 w-3" />
                            <span>{publication.palabrasClave.slice(0, 2).join(', ')}</span>
                            {publication.palabrasClave.length > 2 && (
                              <span>+{publication.palabrasClave.length - 2} más</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Additional metadata for articles */}
                      {publication.tipo === PublicationType.ARTICULO && publication.metadatos && (
                        <div className="text-xs text-gray-500 space-y-1 mb-4">
                          {publication.metadatos.doi && publication.metadatos.doi.length > 0 && (
                            <p><strong>DOI:</strong> {publication.metadatos.doi}</p>
                          )}
                          {publication.metadatos.categoria && publication.metadatos.categoria.length > 0 && (
                            <p><strong>Categoría:</strong> {publication.metadatos.categoria}</p>
                          )}
                        </div>
                      )}

                      {/* Additional metadata for books */}
                      {publication.tipo === PublicationType.LIBRO && (
                        <div className="text-xs text-gray-500 space-y-1 mb-4">
                          {publication.isbn && publication.isbn.length > 0 && (
                            <p><strong>ISBN:</strong> {publication.isbn}</p>
                          )}
                          {publication.numeroPaginas && publication.numeroPaginas > 0 && (
                            <p><strong>Páginas:</strong> {publication.numeroPaginas}</p>
                          )}
                          {publication.capitulos && publication.capitulos.length > 0 && (
                            <p><strong>Capítulos:</strong> {publication.capitulos.length}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-6">
                      <button
                        onClick={() => handlePublicationAction('view', publication.id)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 group-hover:scale-110"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {publication.estado === PublicationStatus.BORRADOR && (
                        <button
                          onClick={() => handlePublicationAction('edit', publication.id)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-xl transition-all duration-200 group-hover:scale-110"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {publication.estado === PublicationStatus.PUBLICADO && (
                        <>
                          <button
                            onClick={() => handlePublicationAction('share', publication.id)}
                            className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-xl transition-all duration-200 group-hover:scale-110"
                            title="Compartir"
                          >
                            <Share className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePublicationAction('download', publication.id)}
                            className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-xl transition-all duration-200 group-hover:scale-110"
                            title="Descargar"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {publication.estado === PublicationStatus.BORRADOR && (
                        <button
                          onClick={() => handlePublicationAction('delete', publication.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200 group-hover:scale-110"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {currentPage * 5 + 1} a {Math.min((currentPage + 1) * 5, filteredPublications.length)} de {filteredPublications.length} resultados
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700 font-medium">
                    Página {currentPage + 1} de {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
