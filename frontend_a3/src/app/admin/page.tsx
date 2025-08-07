'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Settings, 
  Shield, 
  BarChart3, 
  Activity,
  UserPlus,
  Database,
  Server,
  Bell,
  FileText,
  BookOpen,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user?.roles.includes('ROLE_ADMIN')) {
      loadStats();
    }
  }, [isAuthenticated, user]);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Mock stats - in real app, these would come from API
      setStats({
        totalUsers: 1250,
        totalPublications: 342,
        totalReviews: 156,
        activeUsers: 89,
        publicationsThisMonth: 23,
        reviewsThisMonth: 45,
        systemHealth: 'HEALTHY',
        lastBackup: '2024-01-15T10:30:00Z',
        storageUsed: '2.3 GB',
        uptime: '99.8%'
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
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

  if (!user?.roles.includes('ROLE_ADMIN')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Acceso Denegado</h3>
          <p className="mt-1 text-sm text-gray-500">
            No tienes permisos para acceder a esta sección.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  Panel de Administración
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Administrador del Sistema
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* System Overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Usuarios Totales
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats?.totalUsers || 0}
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
                    <FileText className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Publicaciones
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats?.totalPublications || 0}
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
                    <BookOpen className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Revisiones
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats?.totalReviews || 0}
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
                    <Activity className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Usuarios Activos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats?.activeUsers || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Estado del Sistema
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Estado General</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      stats?.systemHealth === 'HEALTHY' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {stats?.systemHealth === 'HEALTHY' ? 'Saludable' : 'Problemas'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Tiempo Activo</span>
                    <span className="text-sm text-gray-900">{stats?.uptime || '99.8%'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Almacenamiento</span>
                    <span className="text-sm text-gray-900">{stats?.storageUsed || '2.3 GB'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Último Backup</span>
                    <span className="text-sm text-gray-900">
                      {stats?.lastBackup ? new Date(stats.lastBackup).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Actividad del Mes
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Nuevas Publicaciones</span>
                    <span className="text-sm text-gray-900">{stats?.publicationsThisMonth || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Revisiones Completadas</span>
                    <span className="text-sm text-gray-900">{stats?.reviewsThisMonth || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Usuarios Registrados</span>
                    <span className="text-sm text-gray-900">+12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Notificaciones Enviadas</span>
                    <span className="text-sm text-gray-900">1,234</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Acciones de Administración
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/admin/users"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-indigo-300"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                      <Users className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Gestión de Usuarios
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Administrar usuarios, roles y permisos
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/publications"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-indigo-300"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                      <FileText className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Gestión de Publicaciones
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Moderar y administrar publicaciones
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/reviews"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-indigo-300"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                      <BookOpen className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Gestión de Revisiones
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Asignar y supervisar revisiones
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/notifications"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-indigo-300"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                      <Bell className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Gestión de Notificaciones
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Configurar plantillas y preferencias
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/system"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-indigo-300"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-gray-50 text-gray-700 ring-4 ring-white">
                      <Server className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Configuración del Sistema
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Configuraciones generales y mantenimiento
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/analytics"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-indigo-300"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                      <BarChart3 className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Análisis y Reportes
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Estadísticas y reportes del sistema
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Acciones Rápidas
              </h3>
              <div className="flex flex-wrap gap-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Usuario
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <Database className="h-4 w-4 mr-2" />
                  Backup del Sistema
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Ver Logs
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Generar Reporte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
