'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/adminService';
import { 
  Users, 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RotateCcw, 
  Settings, 
  BarChart3,
  Shield,
  HardDrive,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Trash,
  Archive,
  FileArchive,
  Server,
  Cpu,
  Memory,
  Info,
  HardDrive as HardDriveIcon
} from 'lucide-react';

interface Backup {
  name: string;
  path: string;
  date: string;
  files: string[];
}

interface SystemStats {
  users: {
    total: number;
    byRole: { [key: string]: number };
  };
  publications: {
    total: number;
    byStatus: { [key: string]: number };
    byType: { [key: string]: number };
  };
  reviews: {
    total: number;
    byStatus: { [key: string]: number };
  };
  notifications: {
    total: number;
    unread: number;
    byType: { [key: string]: number };
  };
  backups: {
    total: number;
    latest: string;
  };
  system: {
    uptime: number;
    memory: any;
    dataFiles: { [key: string]: boolean };
  };
}

export default function AdminPage() {
  const { user } = useAuth();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user && user.roles.includes('ROLE_ADMIN')) {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [backupsData, statsData] = await Promise.all([
        adminService.getBackups(),
        adminService.getSystemStats()
      ]);
      setBackups(backupsData);
      setSystemStats(statsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setMessage({ type: 'error', text: 'Error al cargar datos administrativos' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      await adminService.createBackup();
      setMessage({ type: 'success', text: 'Backup creado exitosamente' });
      loadAdminData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al crear backup' });
    }
  };

  const handleRestoreBackup = async (backupName: string) => {
    if (confirm(`¿Estás seguro de que quieres restaurar el backup "${backupName}"? Esto sobrescribirá todos los datos actuales.`)) {
      try {
        await adminService.restoreBackup(backupName);
        setMessage({ type: 'success', text: 'Backup restaurado exitosamente' });
        loadAdminData();
      } catch (error) {
        setMessage({ type: 'error', text: 'Error al restaurar backup' });
      }
    }
  };

  const handleDeleteBackup = async (backupName: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el backup "${backupName}"?`)) {
      try {
        await adminService.deleteBackup(backupName);
        setMessage({ type: 'success', text: 'Backup eliminado exitosamente' });
        loadAdminData();
      } catch (error) {
        setMessage({ type: 'error', text: 'Error al eliminar backup' });
      }
    }
  };

  const handleCleanOldBackups = async () => {
    if (confirm('¿Estás seguro de que quieres limpiar los backups antiguos (más de 30 días)?')) {
      try {
        const result = await adminService.cleanOldBackups(30);
        setMessage({ type: 'success', text: result.message });
        loadAdminData();
      } catch (error) {
        setMessage({ type: 'error', text: 'Error al limpiar backups antiguos' });
      }
    }
  };

  const handleExportData = async () => {
    try {
      const result = await adminService.exportData('json');
      setMessage({ type: 'success', text: `Datos exportados: ${result.file}` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al exportar datos' });
    }
  };

  if (!user || !user.roles.includes('ROLE_ADMIN')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceso Denegado</h3>
          <p className="text-gray-500">
            No tienes permisos de administrador para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestión completa del sistema y datos</p>
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

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'backups', name: 'Backups', icon: Database },
              { id: 'users', name: 'Usuarios', icon: Users },
              { id: 'system', name: 'Sistema', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
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

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && systemStats && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuarios</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.users.total}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Publicaciones</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.publications.total}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revisiones</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.reviews.total}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Database className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Backups</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.backups.total}</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tiempo activo</span>
                  <span className="text-sm font-medium">
                    {Math.floor(systemStats.system.uptime / 3600)}h {Math.floor((systemStats.system.uptime % 3600) / 60)}m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Memoria usada</span>
                  <span className="text-sm font-medium">
                    {Math.round(systemStats.system.memory.used / 1024 / 1024)} MB
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Archivos de datos</span>
                  <span className="text-sm font-medium">
                    {Object.values(systemStats.system.dataFiles).filter(Boolean).length}/4
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificaciones</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-sm font-medium">{systemStats.notifications.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">No leídas</span>
                  <span className="text-sm font-medium">{systemStats.notifications.unread}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backups Tab */}
      {activeTab === 'backups' && (
        <div className="space-y-6">
          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleCreateBackup}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Backup
            </button>
            <button
              onClick={handleExportData}
              className="btn-secondary flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Datos
            </button>
            <button
              onClick={handleCleanOldBackups}
              className="btn-secondary flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar Antiguos
            </button>
          </div>

          {/* Backups List */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Backups Disponibles</h3>
            </div>
            <div className="p-6">
              {backups.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay backups disponibles</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {backups.map((backup) => (
                    <div key={backup.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <FileArchive className="h-5 w-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">{backup.name}</h4>
                          <p className="text-sm text-gray-500">{backup.date}</p>
                          <p className="text-xs text-gray-400">{backup.files.length} archivos</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRestoreBackup(backup.name)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Restaurar"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBackup(backup.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Eliminar"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Usuarios del Sistema</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <Info className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Información sobre usuarios</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Los usuarios hardcoded (de prueba) no se pueden eliminar. Solo los usuarios registrados pueden ser gestionados.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {systemStats?.users && Object.entries(systemStats.users.byRole).map(([role, count]) => (
                      <div key={role} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{role.replace('ROLE_', '')}</p>
                            <p className="text-2xl font-bold text-gray-900">{count}</p>
                          </div>
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Acciones de Usuario</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={handleExportData}
                    className="btn-secondary flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Usuarios
                  </button>
                  <button 
                    onClick={() => window.location.href = '/register'}
                    className="btn-primary flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar Nuevo Usuario
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Servidor</span>
                  <span className="text-sm font-medium">API Server</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Persistencia</span>
                  <span className="text-sm font-medium">JSON Files</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Backup Automático</span>
                  <span className="text-sm font-medium">Activado</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones del Sistema</h3>
              <div className="space-y-3">
                <button className="w-full btn-secondary flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reiniciar Sistema
                </button>
                <button className="w-full btn-secondary flex items-center justify-center">
                  <HardDriveIcon className="h-4 w-4 mr-2" />
                  Optimizar Datos
                </button>
                <button className="w-full btn-secondary flex items-center justify-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Validar Integridad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
