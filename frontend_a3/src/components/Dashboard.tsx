'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from './Layout';
import { 
  BookOpen, 
  FileText, 
  Clock, 
  CheckCircle, 
  Star, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Database, 
  Activity,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Tag,
  Download,
  Share,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import Link from 'next/link';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const getRoleDisplayName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      'ROLE_AUTOR': 'Autor',
      'ROLE_REVISOR': 'Revisor',
      'ROLE_EDITOR': 'Editor',
      'ROLE_ADMIN': 'Administrador',
      'ROLE_LECTOR': 'Lector'
    };
    return roleNames[role] || role;
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'BORRADOR': 'bg-gray-100 text-gray-800',
      'EN_REVISION': 'bg-yellow-100 text-yellow-800',
      'CAMBIOS_SOLICITADOS': 'bg-orange-100 text-orange-800',
      'APROBADO': 'bg-green-100 text-green-800',
      'PUBLICADO': 'bg-blue-100 text-blue-800',
      'RETIRADO': 'bg-red-100 text-red-800',
      'PENDIENTE': 'bg-gray-100 text-gray-800',
      'EN_PROCESO': 'bg-blue-100 text-blue-800',
      'DEVUELTA': 'bg-orange-100 text-orange-800',
      'ACEPTADA': 'bg-green-100 text-green-800',
      'RECHAZADA': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const statusIcons: { [key: string]: React.ReactNode } = {
      'BORRADOR': <FileText className="h-4 w-4" />,
      'EN_REVISION': <Clock className="h-4 w-4" />,
      'CAMBIOS_SOLICITADOS': <Edit className="h-4 w-4" />,
      'APROBADO': <CheckCircle className="h-4 w-4" />,
      'PUBLICADO': <Star className="h-4 w-4" />,
      'RETIRADO': <AlertCircle className="h-4 w-4" />,
      'PENDIENTE': <Clock className="h-4 w-4" />,
      'EN_PROCESO': <Eye className="h-4 w-4" />,
      'DEVUELTA': <Edit className="h-4 w-4" />,
      'ACEPTADA': <CheckCircle className="h-4 w-4" />,
      'RECHAZADA': <AlertCircle className="h-4 w-4" />
    };
    return statusIcons[status] || <Clock className="h-4 w-4" />;
  };

  // Mock data for publications
  const mockPublications = [
    {
      id: 1,
      titulo: 'Análisis de Algoritmos de Machine Learning',
      tipo: 'ARTICULO',
      estado: 'PUBLICADO',
      fechaCreacion: '2024-01-15',
      autor: 'Juan Pérez',
      palabrasClave: ['machine learning', 'algoritmos', 'clasificación'],
      resumen: 'Estudio comparativo de algoritmos de machine learning para clasificación de datos',
      vistas: 1247,
      descargas: 89,
      citaciones: 12
    },
    {
      id: 2,
      titulo: 'Fundamentos de Programación Web',
      tipo: 'LIBRO',
      estado: 'EN_REVISION',
      fechaCreacion: '2024-01-20',
      autor: 'Juan Pérez',
      palabrasClave: ['programación', 'web', 'desarrollo'],
      resumen: 'Guía completa de desarrollo web moderno',
      vistas: 0,
      descargas: 0,
      citaciones: 0
    },
    {
      id: 3,
      titulo: 'Inteligencia Artificial en Medicina',
      tipo: 'ARTICULO',
      estado: 'CAMBIOS_SOLICITADOS',
      fechaCreacion: '2024-01-25',
      autor: 'Juan Pérez',
      palabrasClave: ['IA', 'medicina', 'diagnóstico'],
      resumen: 'Aplicaciones de IA en diagnóstico médico',
      vistas: 0,
      descargas: 0,
      citaciones: 0
    },
    {
      id: 4,
      titulo: 'Blockchain y Criptomonedas',
      tipo: 'ARTICULO',
      estado: 'BORRADOR',
      fechaCreacion: '2024-01-30',
      autor: 'Juan Pérez',
      palabrasClave: ['blockchain', 'criptomonedas', 'fintech'],
      resumen: 'Análisis del impacto de blockchain en finanzas',
      vistas: 0,
      descargas: 0,
      citaciones: 0
    }
  ];

  // Mock data for reviews
  const mockReviews = [
    {
      id: 1,
      publicacionTitulo: 'Fundamentos de Programación Web',
      estado: 'EN_PROCESO',
      fechaAsignacion: '2024-01-25',
      prioridad: 'ALTA',
      diasRestantes: 5,
      progreso: 75
    },
    {
      id: 2,
      publicacionTitulo: 'Inteligencia Artificial en Medicina',
      estado: 'PENDIENTE',
      fechaAsignacion: '2024-01-28',
      prioridad: 'MEDIA',
      diasRestantes: 12,
      progreso: 0
    },
    {
      id: 3,
      publicacionTitulo: 'Análisis de Datos con Python',
      estado: 'ACEPTADA',
      fechaAsignacion: '2024-01-20',
      prioridad: 'BAJA',
      diasRestantes: 0,
      progreso: 100
    }
  ];

  // Mock statistics
  const mockStats = {
    totalPublications: 12,
    publishedPublications: 8,
    pendingReviews: 3,
    unreadNotifications: 5,
    totalViews: 3456,
    totalDownloads: 234,
    totalCitations: 45,
    recentActivity: [
      { action: 'Publicación creada', item: 'Blockchain y Criptomonedas', time: '2 horas', type: 'create' },
      { action: 'Revisión completada', item: 'Análisis de Datos con Python', time: '1 día', type: 'review' },
      { action: 'Publicación aprobada', item: 'Machine Learning Avanzado', time: '2 días', type: 'approve' },
      { action: 'Nueva citación', item: 'Fundamentos de IA', time: '3 días', type: 'citation' }
    ]
  };

  // Mock analytics data
  const analyticsData = {
    views: { current: 1247, previous: 1100, change: 13.4 },
    downloads: { current: 89, previous: 75, change: 18.7 },
    citations: { current: 12, previous: 8, change: 50.0 },
    publications: { current: 12, previous: 10, change: 20.0 }
  };

  const handlePublicationAction = (action: string, publicationId: number) => {
    console.log(`${action} publication ${publicationId}`);
    // Here you would implement the actual action
  };

  const handleReviewAction = (action: string, reviewId: number) => {
    console.log(`${action} review ${reviewId}`);
    // Here you would implement the actual action
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {user?.nombres}!
          </h1>
          <p className="mt-2 text-gray-600">
            Aquí tienes un resumen de tu actividad en el sistema de publicaciones académicas.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Publicaciones</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.totalPublications}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+{analyticsData.publications.change}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Publicadas</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.publishedPublications}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+15.2%</span>
                  <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vistas</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.totalViews.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+{analyticsData.views.change}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Descargas</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.totalDownloads}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+{analyticsData.downloads.change}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Download className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Role-specific content */}
          <div className="lg:col-span-2">
            {user?.roles.includes('ROLE_AUTOR') && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Mis Publicaciones</h3>
                    <Link
                      href="/publications"
                      className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Ver todas
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {mockPublications.slice(0, 3).map((publication) => (
                      <div key={publication.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-sm font-medium text-gray-900">{publication.titulo}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(publication.estado)}`}>
                              {getStatusIcon(publication.estado)}
                              <span className="ml-1">{publication.estado.replace('_', ' ')}</span>
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{publication.resumen}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{publication.fechaCreacion}</span>
                            </div>
                            {publication.vistas > 0 && (
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span>{publication.vistas} vistas</span>
                              </div>
                            )}
                            {publication.descargas > 0 && (
                              <div className="flex items-center space-x-1">
                                <Download className="h-3 w-3" />
                                <span>{publication.descargas} descargas</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePublicationAction('view', publication.id)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {publication.estado === 'BORRADOR' && (
                            <button
                              onClick={() => handlePublicationAction('edit', publication.id)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {publication.estado === 'PUBLICADO' && (
                            <button
                              onClick={() => handlePublicationAction('share', publication.id)}
                              className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-colors"
                              title="Compartir"
                            >
                              <Share className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/publications/create"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Publicación
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {user?.roles.includes('ROLE_REVISOR') && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Revisiones Asignadas</h3>
                    <Link
                      href="/reviews"
                      className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      Ver todas
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {mockReviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-sm font-medium text-gray-900">{review.publicacionTitulo}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.estado)}`}>
                              {getStatusIcon(review.estado)}
                              <span className="ml-1">{review.estado.replace('_', ' ')}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                            <span>Asignada: {review.fechaAsignacion}</span>
                            <span>• {review.diasRestantes} días restantes</span>
                          </div>
                          {review.progreso > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${review.progreso}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleReviewAction('view', review.id)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                            title="Ver revisión"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {review.estado === 'PENDIENTE' && (
                            <button
                              onClick={() => handleReviewAction('start', review.id)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                              title="Iniciar revisión"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockStats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`h-2 w-2 rounded-full ${
                          activity.type === 'create' ? 'bg-blue-500' :
                          activity.type === 'review' ? 'bg-green-500' :
                          activity.type === 'approve' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.action}</span>: {activity.item}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Rápidas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Citaciones</span>
                  <span className="text-lg font-semibold text-gray-900">{mockStats.totalCitations}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revisiones Pendientes</span>
                  <span className="text-lg font-semibold text-gray-900">{mockStats.pendingReviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Notificaciones</span>
                  <span className="text-lg font-semibold text-gray-900">{mockStats.unreadNotifications}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                {user?.roles.includes('ROLE_AUTOR') && (
                  <Link
                    href="/publications/create"
                    className="flex items-center space-x-3 p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Plus className="h-5 w-5 text-indigo-600" />
                    <span>Nueva Publicación</span>
                  </Link>
                )}
                <Link
                  href="/catalog"
                  className="flex items-center space-x-3 p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span>Explorar Catálogo</span>
                </Link>
                <Link
                  href="/notifications"
                  className="flex items-center space-x-3 p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span>Ver Notificaciones</span>
                </Link>
              </div>
            </div>

            {/* Time Period Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Período de Tiempo</h3>
              <div className="space-y-2">
                {[
                  { value: 'week', label: 'Esta semana' },
                  { value: 'month', label: 'Este mes' },
                  { value: 'quarter', label: 'Este trimestre' },
                  { value: 'year', label: 'Este año' }
                ].map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedTimeframe(period.value)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedTimeframe === period.value
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
