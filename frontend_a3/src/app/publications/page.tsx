'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/Layout';
import { Publication, PublicationStatus, PublicationType } from '../../types/publication';
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
  X
} from 'lucide-react';
import Link from 'next/link';

export default function PublicationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PublicationStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<PublicationType | ''>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('fecha');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data for publications
  const mockPublications: Publication[] = [
    {
      id: '1',
      titulo: 'Análisis de Algoritmos de Machine Learning',
      resumen: 'Estudio comparativo de algoritmos de machine learning para clasificación de datos. Se analizan diferentes técnicas y su rendimiento en diversos conjuntos de datos.',
      tipo: PublicationType.ARTICULO,
      estado: PublicationStatus.PUBLICADO,
      autorPrincipalId: '1',
      versionActual: '1.0',
      fechaCreacion: '2024-01-15T10:00:00Z',
      fechaActualizacion: '2024-02-01T10:00:00Z',
      palabrasClave: ['machine learning', 'algoritmos', 'clasificación', 'inteligencia artificial'],
      referenciasBibliograficas: [
        'Smith, J. (2023). Machine Learning Fundamentals. Journal of AI, 15(2), 45-67.',
        'García, M. (2023). Comparative Analysis of ML Algorithms. Computer Science Review, 8(1), 23-41.'
      ],
      metadatos: {
        doi: '10.1000/example.2024.001',
        issn: '1234-5678',
        paginas: 15,
        categoria: 'Computer Science',
        licencia: 'CC BY 4.0'
      }
    },
    {
      id: '2',
      titulo: 'Fundamentos de Programación Web',
      resumen: 'Guía completa de desarrollo web moderno que cubre HTML5, CSS3, JavaScript ES6+ y frameworks populares como React y Vue.js.',
      tipo: PublicationType.LIBRO,
      estado: PublicationStatus.EN_REVISION,
      autorPrincipalId: '1',
      versionActual: '1.0',
      fechaCreacion: '2024-01-20T10:00:00Z',
      palabrasClave: ['programación', 'web', 'desarrollo', 'frontend'],
      isbn: '978-0-123456-78-9',
      numeroPaginas: 350,
      edicion: '1',
      capitulos: [
        { numero: 1, titulo: 'Introducción a HTML', resumenCapitulo: 'Conceptos básicos de HTML5' },
        { numero: 2, titulo: 'CSS Avanzado', resumenCapitulo: 'Estilos y layouts modernos' },
        { numero: 3, titulo: 'JavaScript Moderno', resumenCapitulo: 'ES6+ y programación funcional' },
        { numero: 4, titulo: 'React Fundamentals', resumenCapitulo: 'Componentes y hooks' },
        { numero: 5, titulo: 'Vue.js Essentials', resumenCapitulo: 'Framework progresivo' }
      ]
    },
    {
      id: '3',
      titulo: 'Inteligencia Artificial en Medicina',
      resumen: 'Aplicaciones de inteligencia artificial en diagnóstico médico, incluyendo análisis de imágenes médicas y predicción de enfermedades.',
      tipo: PublicationType.ARTICULO,
      estado: PublicationStatus.CAMBIOS_SOLICITADOS,
      autorPrincipalId: '1',
      versionActual: '1.0',
      fechaCreacion: '2024-01-25T10:00:00Z',
      palabrasClave: ['IA', 'medicina', 'diagnóstico', 'imágenes médicas'],
      referenciasBibliograficas: [
        'Johnson, A. (2023). AI in Medical Imaging. Medical AI Journal, 12(3), 78-95.',
        'Brown, L. (2023). Predictive Medicine with AI. Healthcare Technology, 5(2), 34-52.'
      ],
      metadatos: {
        doi: '10.1000/example.2024.002',
        issn: '2345-6789',
        paginas: 30,
        categoria: 'Medical AI',
        licencia: 'CC BY 4.0'
      }
    },
    {
      id: '4',
      titulo: 'Blockchain y Criptomonedas',
      resumen: 'Análisis del impacto de blockchain en finanzas, incluyendo Bitcoin, Ethereum y aplicaciones descentralizadas.',
      tipo: PublicationType.ARTICULO,
      estado: PublicationStatus.BORRADOR,
      autorPrincipalId: '1',
      versionActual: '1.0',
      fechaCreacion: '2024-01-30T10:00:00Z',
      palabrasClave: ['blockchain', 'criptomonedas', 'fintech', 'descentralización'],
      referenciasBibliograficas: [
        'Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System.',
        'Buterin, V. (2014). Ethereum: A Next-Generation Smart Contract Platform.'
      ]
    },
    {
      id: '5',
      titulo: 'Ciberseguridad en la Era Digital',
      resumen: 'Guía completa sobre seguridad informática, incluyendo amenazas, vulnerabilidades y mejores prácticas de protección.',
      tipo: PublicationType.LIBRO,
      estado: PublicationStatus.APROBADO,
      autorPrincipalId: '1',
      versionActual: '1.0',
      fechaCreacion: '2024-02-05T10:00:00Z',
      palabrasClave: ['ciberseguridad', 'seguridad informática', 'amenazas', 'protección'],
      isbn: '978-0-987654-32-1',
      numeroPaginas: 280,
      edicion: '1',
      capitulos: [
        { numero: 1, titulo: 'Fundamentos de Ciberseguridad', resumenCapitulo: 'Conceptos básicos de seguridad' },
        { numero: 2, titulo: 'Amenazas y Vulnerabilidades', resumenCapitulo: 'Tipos de ataques informáticos' },
        { numero: 3, titulo: 'Protección de Datos', resumenCapitulo: 'Estrategias de protección' },
        { numero: 4, titulo: 'Criptografía Aplicada', resumenCapitulo: 'Técnicas de encriptación' }
      ]
    },
    {
      id: '6',
      titulo: 'Análisis de Datos con Python',
      resumen: 'Técnicas avanzadas de análisis de datos utilizando Python, pandas, numpy y scikit-learn.',
      tipo: PublicationType.ARTICULO,
      estado: PublicationStatus.PUBLICADO,
      autorPrincipalId: '1',
      versionActual: '1.0',
      fechaCreacion: '2024-02-10T10:00:00Z',
      fechaActualizacion: '2024-03-01T10:00:00Z',
      palabrasClave: ['python', 'análisis de datos', 'pandas', 'scikit-learn'],
      referenciasBibliograficas: [
        'McKinney, W. (2017). Python for Data Analysis. O\'Reilly Media.',
        'Pedregosa, F. (2011). Scikit-learn: Machine Learning in Python. JMLR, 12, 2825-2830.'
      ],
      metadatos: {
        doi: '10.1000/example.2024.003',
        issn: '3456-7890',
        paginas: 45,
        categoria: 'Data Science',
        licencia: 'CC BY 4.0'
      }
    }
  ];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Simulate API call delay
    setLoading(true);
    setTimeout(() => {
      setPublications(mockPublications);
      setTotalPages(Math.ceil(mockPublications.length / 5));
      setLoading(false);
    }, 500);
  }, [isAuthenticated, isLoading, router]);

  const getStatusColor = (status: PublicationStatus) => {
    const statusColors: { [key in PublicationStatus]: string } = {
      [PublicationStatus.BORRADOR]: 'bg-gray-100 text-gray-800',
      [PublicationStatus.EN_REVISION]: 'bg-yellow-100 text-yellow-800',
      [PublicationStatus.CAMBIOS_SOLICITADOS]: 'bg-orange-100 text-orange-800',
      [PublicationStatus.APROBADO]: 'bg-green-100 text-green-800',
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

  const handlePublicationAction = (action: string, publicationId: string) => {
    console.log(`${action} publication ${publicationId}`);
    // Here you would implement the actual action
    switch (action) {
      case 'view':
        router.push(`/publications/${publicationId}`);
        break;
      case 'edit':
        router.push(`/publications/${publicationId}/edit`);
        break;
      case 'delete':
        if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
          console.log('Deleting publication:', publicationId);
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Publicaciones</h1>
              <p className="mt-2 text-gray-600">
                Gestiona tus publicaciones académicas y su estado de revisión
              </p>
            </div>
            <Link
              href="/publications/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Publicación
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filtros y Búsqueda</h3>
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
                    placeholder="Buscar por título o resumen..."
                  />
                </div>
              </div>

              {showFilters && (
                <>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as PublicationStatus | '')}
                      className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                      <option value="estado">Estado</option>
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
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </button>
                {(searchTerm || statusFilter || typeFilter) && (
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

        {/* Publications List */}
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
                {searchTerm || statusFilter || typeFilter 
                  ? 'Intenta ajustar los filtros de búsqueda.'
                  : 'Comienza creando tu primera publicación.'
                }
              </p>
              {!searchTerm && !statusFilter && !typeFilter && (
                <div className="mt-6">
                  <Link
                    href="/publications/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Publicación
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {paginatedPublications.map((publication) => (
                <div key={publication.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {publication.titulo}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(publication.estado)}`}>
                            {getStatusIcon(publication.estado)}
                            <span className="ml-1">{publication.estado.replace('_', ' ')}</span>
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {getTypeIcon(publication.tipo)}
                            <span className="ml-1">{publication.tipo}</span>
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{publication.resumen}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>Juan Pérez</span>
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
                         <div className="text-xs text-gray-500 space-y-1 mb-3">
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
                         <div className="text-xs text-gray-500 space-y-1 mb-3">
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

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handlePublicationAction('view', publication.id)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {publication.estado === PublicationStatus.BORRADOR && (
                        <button
                          onClick={() => handlePublicationAction('edit', publication.id)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {publication.estado === PublicationStatus.PUBLICADO && (
                        <>
                          <button
                            onClick={() => handlePublicationAction('share', publication.id)}
                            className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-colors"
                            title="Compartir"
                          >
                            <Share className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePublicationAction('download', publication.id)}
                            className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition-colors"
                            title="Descargar"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {publication.estado === PublicationStatus.BORRADOR && (
                        <button
                          onClick={() => handlePublicationAction('delete', publication.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
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
