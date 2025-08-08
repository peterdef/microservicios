'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { Layout } from '../../../components/Layout';
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
  Activity,
  Shield,
  Database,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  FileCheck,
  FileX,
  RefreshCw,
  CalendarDays,
  Filter as FilterIcon,
  Download as DownloadIcon,
  Eye as EyeIcon,
  AlertTriangle,
  Info,
  CheckSquare,
  Square
} from 'lucide-react';

interface AuditLog {
  id: number;
  timestamp: string;
  user: {
    nombres: string;
    apellidos: string;
    email: string;
  };
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface AuditStats {
  totalLogs: number;
  todayLogs: number;
  failedActions: number;
  criticalEvents: number;
  uniqueUsers: number;
  topActions: { action: string; count: number }[];
  topUsers: { user: string; count: number }[];
}

export default function AuditPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    user: '',
    action: '',
    status: '',
    severity: ''
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadAuditData();
    }
  }, [isAuthenticated, isLoading, router]);

  const loadAuditData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular datos de auditoría
      const mockLogs: AuditLog[] = [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          user: { nombres: 'Admin', apellidos: 'Sistema', email: 'admin@test.com' },
          action: 'LOGIN',
          resource: 'Authentication',
          details: 'Inicio de sesión exitoso',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'SUCCESS',
          severity: 'LOW'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: { nombres: 'Autor', apellidos: 'Test', email: 'autor@test.com' },
          action: 'CREATE_PUBLICATION',
          resource: 'Publications',
          details: 'Nueva publicación creada: "Avances en IA"',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          status: 'SUCCESS',
          severity: 'MEDIUM'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: { nombres: 'Revisor', apellidos: 'Experto', email: 'revisor@test.com' },
          action: 'UPDATE_REVIEW',
          resource: 'Reviews',
          details: 'Revisión actualizada para publicación ID: 123',
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (Linux x86_64)',
          status: 'SUCCESS',
          severity: 'MEDIUM'
        },
        {
          id: 4,
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          user: { nombres: 'Admin', apellidos: 'Sistema', email: 'admin@test.com' },
          action: 'DELETE_USER',
          resource: 'Users',
          details: 'Usuario eliminado: usuario@test.com',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'SUCCESS',
          severity: 'HIGH'
        },
        {
          id: 5,
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          user: { nombres: 'Usuario', apellidos: 'Desconocido', email: 'unknown@test.com' },
          action: 'LOGIN_FAILED',
          resource: 'Authentication',
          details: 'Intento de inicio de sesión fallido',
          ipAddress: '192.168.1.103',
          userAgent: 'Mozilla/5.0 (Unknown)',
          status: 'FAILURE',
          severity: 'MEDIUM'
        }
      ];

      setLogs(mockLogs);

      // Calcular estadísticas
      const auditStats: AuditStats = {
        totalLogs: mockLogs.length,
        todayLogs: mockLogs.filter(log => {
          const today = new Date();
          const logDate = new Date(log.timestamp);
          return logDate.toDateString() === today.toDateString();
        }).length,
        failedActions: mockLogs.filter(log => log.status === 'FAILURE').length,
        criticalEvents: mockLogs.filter(log => log.severity === 'CRITICAL').length,
        uniqueUsers: new Set(mockLogs.map(log => log.user.email)).size,
        topActions: calculateTopActions(mockLogs),
        topUsers: calculateTopUsers(mockLogs)
      };

      setStats(auditStats);

    } catch (error: any) {
      console.error('Error loading audit data:', error);
      setError(error.message || 'Error al cargar datos de auditoría');
    } finally {
      setLoading(false);
    }
  };

  const calculateTopActions = (logs: AuditLog[]) => {
    const actionCounts: { [key: string]: number } = {};
    logs.forEach(log => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });
    return Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const calculateTopUsers = (logs: AuditLog[]) => {
    const userCounts: { [key: string]: number } = {};
    logs.forEach(log => {
      const userKey = `${log.user.nombres} ${log.user.apellidos}`;
      userCounts[userKey] = (userCounts[userKey] || 0) + 1;
    });
    return Object.entries(userCounts)
      .map(([user, count]) => ({ user, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'FAILURE': return 'bg-red-100 text-red-800';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'bg-blue-100 text-blue-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN': return <Unlock className="h-4 w-4" />;
      case 'LOGOUT': return <Lock className="h-4 w-4" />;
      case 'CREATE_PUBLICATION': return <FileText className="h-4 w-4" />;
      case 'UPDATE_PUBLICATION': return <Edit className="h-4 w-4" />;
      case 'DELETE_PUBLICATION': return <Trash2 className="h-4 w-4" />;
      case 'CREATE_REVIEW': return <UserCheck className="h-4 w-4" />;
      case 'UPDATE_REVIEW': return <Edit className="h-4 w-4" />;
      case 'CREATE_USER': return <UserPlus className="h-4 w-4" />;
      case 'UPDATE_USER': return <Edit className="h-4 w-4" />;
      case 'DELETE_USER': return <UserMinus className="h-4 w-4" />;
      case 'LOGIN_FAILED': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportLogs = () => {
    const csvContent = [
      ['ID', 'Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP', 'Status', 'Severity'].join(','),
      ...logs.map(log => [
        log.id,
        log.timestamp,
        `${log.user.nombres} ${log.user.apellidos}`,
        log.action,
        log.resource,
        log.details,
        log.ipAddress,
        log.status,
        log.severity
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
                <h1 className="text-2xl font-bold text-gray-900">Auditoría del Sistema</h1>
                <p className="text-gray-600">Registro de actividades y eventos del sistema</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={exportLogs}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Exportar Logs
                </button>
                <button 
                  onClick={loadAuditData}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
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
                { id: 'logs', name: 'Logs de Actividad', icon: Activity },
                { id: 'filters', name: 'Filtros', icon: FilterIcon },
                { id: 'reports', name: 'Reportes', icon: FileText }
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
                          <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total de Logs
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.totalLogs}
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
                          <CalendarDays className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Logs Hoy
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.todayLogs}
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
                          <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Acciones Fallidas
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.failedActions}
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
                          <AlertTriangle className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Eventos Críticos
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {stats.criticalEvents}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Actions */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Acciones Más Frecuentes
                  </h3>
                </div>
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {stats?.topActions.map((action, index) => (
                      <li key={index} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {getActionIcon(action.action)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {action.action}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {action.count} veces
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Top Users */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Usuarios Más Activos
                  </h3>
                </div>
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {stats?.topUsers.map((user, index) => (
                      <li key={index} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.user.split(' ').map(n => n.charAt(0)).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.user}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.count} actividades
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'logs' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Logs de Actividad
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Registro detallado de todas las actividades del sistema
                </p>
              </div>
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Recurso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Detalles
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IP
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Severidad
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(log.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.user.nombres} {log.user.apellidos}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getActionIcon(log.action)}
                              <span className="ml-2 text-sm text-gray-900">{log.action}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.resource}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {log.details}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.ipAddress}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                              {log.severity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'filters' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Filtros de Auditoría
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configura filtros para buscar logs específicos
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha Desde</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha Hasta</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Usuario</label>
                    <input
                      type="text"
                      value={filters.user}
                      onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                      placeholder="Buscar por usuario..."
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Acción</label>
                    <select
                      value={filters.action}
                      onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todas las acciones</option>
                      <option value="LOGIN">Login</option>
                      <option value="LOGOUT">Logout</option>
                      <option value="CREATE_PUBLICATION">Crear Publicación</option>
                      <option value="UPDATE_PUBLICATION">Actualizar Publicación</option>
                      <option value="DELETE_PUBLICATION">Eliminar Publicación</option>
                      <option value="CREATE_REVIEW">Crear Revisión</option>
                      <option value="UPDATE_REVIEW">Actualizar Revisión</option>
                      <option value="CREATE_USER">Crear Usuario</option>
                      <option value="UPDATE_USER">Actualizar Usuario</option>
                      <option value="DELETE_USER">Eliminar Usuario</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todos los estados</option>
                      <option value="SUCCESS">Éxito</option>
                      <option value="FAILURE">Fallo</option>
                      <option value="WARNING">Advertencia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Severidad</label>
                    <select
                      value={filters.severity}
                      onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todas las severidades</option>
                      <option value="LOW">Baja</option>
                      <option value="MEDIUM">Media</option>
                      <option value="HIGH">Alta</option>
                      <option value="CRITICAL">Crítica</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setFilters({
                      dateFrom: '',
                      dateTo: '',
                      user: '',
                      action: '',
                      status: '',
                      severity: ''
                    })}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Limpiar Filtros
                  </button>
                  <button
                    onClick={() => {/* Aplicar filtros */}}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'reports' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Reportes de Auditoría
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Genera reportes detallados de auditoría
                </p>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Funcionalidad en desarrollo</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Los reportes detallados estarán disponibles próximamente.
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
