'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/Layout';
import { Publication, PublicationStatus, PublicationType } from '../../types/publication';
import { publicationService } from '../../services/publicationService';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Share, 
  BookOpen, 
  FileText, 
  Star, 
  Calendar, 
  User, 
  Tag,
  ChevronDown,
  ChevronUp,
  X,
  Bookmark,
  BookmarkPlus,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function CatalogPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<PublicationType | ''>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('fecha');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch published publications from API
  const fetchPublications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all publications from backup (not just published ones for now)
      const response = await publicationService.getPublications();
      
      console.log('API Response:', response); // Debug log
      
      const fetchedPublications = response;
      console.log('Fetched Publications:', fetchedPublications); // Debug log
      
      setPublications(fetchedPublications);
      setTotalPages(Math.ceil(fetchedPublications.length / 5));
    } catch (error: any) {
      console.error('Error fetching publications:', error);
      
      if (error.message.includes('401')) {
        setError('Error de autenticación. Por favor, inicie sesión nuevamente.');
      } else {
        setError(error.message || 'Error al cargar las publicaciones');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  // Refresh publications when returning to the page
  useEffect(() => {
    const handleFocus = () => {
      fetchPublications();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const getTypeIcon = (type: PublicationType) => {
    return type === PublicationType.ARTICULO ? <FileText className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />;
  };

  const handlePublicationAction = async (action: string, publicationId: string) => {
    try {
      switch (action) {
        case 'view':
          // Navigate to publication detail
          console.log('Viewing publication:', publicationId);
          break;
        case 'download':
          // Implement download functionality
          console.log('Downloading publication:', publicationId);
          break;
        case 'share':
          // Implement share functionality
          console.log('Sharing publication:', publicationId);
          break;
        case 'favorite':
          setFavorites(prev => 
            prev.includes(publicationId) 
              ? prev.filter(id => id !== publicationId)
              : [...prev, publicationId]
          );
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
    const matchesCategory = !categoryFilter || 
                           (publication.metadatos?.categoria && publication.metadatos.categoria.includes(categoryFilter));
    const matchesType = !typeFilter || publication.tipo === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
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
    setCategoryFilter('');
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
            <p className="text-gray-600 font-medium">Cargando catálogo...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar el catálogo</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            

            
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
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Catálogo de Publicaciones</h1>
              <p className="mt-2 text-gray-600">
                Explora y descubre publicaciones académicas de alta calidad
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {publications.length} publicaciones disponibles
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Búsqueda y Filtros</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? 'Ocultar' : 'Mostrar'} filtros</span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Buscar por título, autor o palabras clave..."
                  />
                </div>
              </div>

              {showFilters && (
                <>
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
                      <option value="Computer Science">Computer Science</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Security">Security</option>
                      <option value="Medical AI">Medical AI</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <select
                      id="type"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as PublicationType | '')}
                      className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Todos los tipos</option>
                      <option value={PublicationType.ARTICULO}>Artículo</option>
                      <option value={PublicationType.LIBRO}>Libro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                      Ordenar por
                    </label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="fecha">Fecha</option>
                      <option value="titulo">Título</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </button>
                {(searchTerm || categoryFilter || typeFilter) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
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

        {/* Publications Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Publicaciones ({filteredPublications.length})
              </h2>
              <div className="text-sm text-gray-500">
                Mostrando {currentPage * 5 + 1} a {Math.min((currentPage + 1) * 5, filteredPublications.length)} de {filteredPublications.length} resultados
              </div>
            </div>
          </div>

          {paginatedPublications.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No se encontraron publicaciones</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm || categoryFilter || typeFilter 
                  ? 'Intenta ajustar los filtros de búsqueda.'
                  : 'No hay publicaciones disponibles en este momento.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {paginatedPublications.map((publication) => (
                <div key={publication.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getTypeIcon(publication.tipo)}
                          <span className="ml-1">{publication.tipo}</span>
                        </span>
                        <button
                          onClick={() => handlePublicationAction('favorite', publication.id || '')}
                          className={`p-1 rounded-full transition-colors ${
                            favorites.includes(publication.id || '')
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-400 hover:text-yellow-500'
                          }`}
                          title={favorites.includes(publication.id || '') ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        >
                          {favorites.includes(publication.id || '') ? <Bookmark className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {publication.titulo}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{publication.resumen}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{publication.autor?.nombres} {publication.autor?.apellidos || 'Autor'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{publication.fechaCreacion ? new Date(publication.fechaCreacion).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>

                    {publication.palabrasClave && publication.palabrasClave.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {publication.palabrasClave.slice(0, 3).map((keyword: string, index: number) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Tag className="h-3 w-3 mr-1" />
                            {keyword}
                          </span>
                        ))}
                        {publication.palabrasClave.length > 3 && (
                          <span className="text-xs text-gray-500">+{publication.palabrasClave.length - 3} más</span>
                        )}
                      </div>
                    )}

                    {/* Additional metadata */}
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

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePublicationAction('view', publication.id || '')}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </button>
                        <button
                          onClick={() => handlePublicationAction('download', publication.id || '')}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Descargar
                        </button>
                      </div>
                      <button
                        onClick={() => handlePublicationAction('share', publication.id || '')}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-colors"
                      >
                        <Share className="h-3 w-3 mr-1" />
                        Compartir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {currentPage * 5 + 1} a {Math.min((currentPage + 1) * 5, filteredPublications.length)} de {filteredPublications.length} resultados
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Página {currentPage + 1} de {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
