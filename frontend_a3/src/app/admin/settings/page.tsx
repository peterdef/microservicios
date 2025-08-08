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
  Square,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Crown,
  User,
  UserX,
  UserCheck as UserCheckIcon,
  Key,
  Settings as SettingsIcon,
  Save,
  Globe as GlobeIcon,
  Shield as ShieldIcon,
  Database as DatabaseIcon,
  Bell as BellIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  Users as UsersIcon,
  FileText as FileTextIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
  Info as InfoIcon,
  Wrench,
  Cog,
  Zap,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  HardDrive,
  Cloud,
  Wifi,
  WifiOff,
  Server,
  Database as DatabaseIcon2,
  HardDrive as HardDriveIcon,
  Cloud as CloudIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Server as ServerIcon
} from 'lucide-react';

interface SystemConfig {
  general: {
    siteName: string;
    siteDescription: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
  security: {
    passwordMinLength: number;
    requireSpecialChars: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    enableTwoFactor: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    notificationFrequency: string;
    autoDeleteOldNotifications: boolean;
    notificationRetentionDays: number;
  };
  storage: {
    maxFileSize: number;
    allowedFileTypes: string[];
    storageProvider: string;
    backupFrequency: string;
    enableCompression: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    cacheDuration: number;
    enableGzip: boolean;
    maxConcurrentUsers: number;
    enableCDN: boolean;
  };
}

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<SystemConfig>({
    general: {
      siteName: 'Sistema de Publicaciones',
      siteDescription: 'Plataforma de gestión de publicaciones académicas',
      timezone: 'America/Mexico_City',
      language: 'es',
      maintenanceMode: false
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      enableTwoFactor: false
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'admin@test.com',
      smtpPassword: '********',
      fromEmail: 'noreply@test.com',
      fromName: 'Sistema de Publicaciones'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      notificationFrequency: 'immediate',
      autoDeleteOldNotifications: true,
      notificationRetentionDays: 30
    },
    storage: {
      maxFileSize: 10,
      allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
      storageProvider: 'local',
      backupFrequency: 'daily',
      enableCompression: true
    },
    performance: {
      cacheEnabled: true,
      cacheDuration: 3600,
      enableGzip: true,
      maxConcurrentUsers: 100,
      enableCDN: false
    }
  });
  const [selectedTab, setSelectedTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadSettings();
    }
  }, [isAuthenticated, isLoading, router]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      // En un sistema real, aquí cargaríamos la configuración desde el backend
      // Por ahora usamos la configuración por defecto
      setLoading(false);
    } catch (error: any) {
      console.error('Error loading settings:', error);
      setError(error.message || 'Error al cargar configuración');
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // En un sistema real, aquí guardaríamos la configuración en el backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular guardado
      setSaving(false);
      // Mostrar mensaje de éxito
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setError(error.message || 'Error al guardar configuración');
      setSaving(false);
    }
  };

  const handleRestartSystem = async () => {
    try {
      setSaving(true);
      // En un sistema real, aquí reiniciaríamos el sistema
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular reinicio
      setSaving(false);
      setShowRestartModal(false);
      // Mostrar mensaje de éxito
    } catch (error: any) {
      console.error('Error restarting system:', error);
      setError(error.message || 'Error al reiniciar sistema');
      setSaving(false);
    }
  };

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
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
                <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
                <p className="text-gray-600">Administra la configuración general del sistema</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowRestartModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reiniciar Sistema
                </button>
                <button 
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
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
                { id: 'general', name: 'General', icon: Cog },
                { id: 'security', name: 'Seguridad', icon: ShieldIcon },
                { id: 'email', name: 'Email', icon: MailIcon },
                { id: 'notifications', name: 'Notificaciones', icon: BellIcon },
                { id: 'storage', name: 'Almacenamiento', icon: DatabaseIcon },
                { id: 'performance', name: 'Rendimiento', icon: Zap }
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
          {selectedTab === 'general' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Configuración General
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configuración básica del sistema
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Sitio</label>
                    <input
                      type="text"
                      value={config.general.siteName}
                      onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción del Sitio</label>
                    <input
                      type="text"
                      value={config.general.siteDescription}
                      onChange={(e) => updateConfig('general', 'siteDescription', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Zona Horaria</label>
                    <select
                      value={config.general.timezone}
                      onChange={(e) => updateConfig('general', 'timezone', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="America/Mexico_City">México (GMT-6)</option>
                      <option value="America/New_York">Nueva York (GMT-5)</option>
                      <option value="Europe/Madrid">Madrid (GMT+1)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Idioma</label>
                    <select
                      value={config.general.language}
                      onChange={(e) => updateConfig('general', 'language', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.general.maintenanceMode}
                    onChange={(e) => updateConfig('general', 'maintenanceMode', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Modo de Mantenimiento
                  </label>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'security' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Configuración de Seguridad
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configuración de seguridad y autenticación
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Longitud Mínima de Contraseña</label>
                    <input
                      type="number"
                      value={config.security.passwordMinLength}
                      onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tiempo de Sesión (minutos)</label>
                    <input
                      type="number"
                      value={config.security.sessionTimeout}
                      onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Máximo Intentos de Login</label>
                    <input
                      type="number"
                      value={config.security.maxLoginAttempts}
                      onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.security.requireSpecialChars}
                      onChange={(e) => updateConfig('security', 'requireSpecialChars', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Requerir Caracteres Especiales en Contraseñas
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.security.enableTwoFactor}
                      onChange={(e) => updateConfig('security', 'enableTwoFactor', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Habilitar Autenticación de Dos Factores
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'email' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Configuración de Email
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configuración del servidor SMTP para envío de emails
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Servidor SMTP</label>
                    <input
                      type="text"
                      value={config.email.smtpHost}
                      onChange={(e) => updateConfig('email', 'smtpHost', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Puerto SMTP</label>
                    <input
                      type="number"
                      value={config.email.smtpPort}
                      onChange={(e) => updateConfig('email', 'smtpPort', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Usuario SMTP</label>
                    <input
                      type="text"
                      value={config.email.smtpUser}
                      onChange={(e) => updateConfig('email', 'smtpUser', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña SMTP</label>
                    <input
                      type="password"
                      value={config.email.smtpPassword}
                      onChange={(e) => updateConfig('email', 'smtpPassword', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Remitente</label>
                    <input
                      type="email"
                      value={config.email.fromEmail}
                      onChange={(e) => updateConfig('email', 'fromEmail', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre Remitente</label>
                    <input
                      type="text"
                      value={config.email.fromName}
                      onChange={(e) => updateConfig('email', 'fromName', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'notifications' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Configuración de Notificaciones
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configuración de notificaciones del sistema
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Frecuencia de Notificaciones</label>
                    <select
                      value={config.notifications.notificationFrequency}
                      onChange={(e) => updateConfig('notifications', 'notificationFrequency', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="immediate">Inmediata</option>
                      <option value="hourly">Cada hora</option>
                      <option value="daily">Diaria</option>
                      <option value="weekly">Semanal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Días de Retención</label>
                    <input
                      type="number"
                      value={config.notifications.notificationRetentionDays}
                      onChange={(e) => updateConfig('notifications', 'notificationRetentionDays', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.notifications.emailNotifications}
                      onChange={(e) => updateConfig('notifications', 'emailNotifications', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Habilitar Notificaciones por Email
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.notifications.pushNotifications}
                      onChange={(e) => updateConfig('notifications', 'pushNotifications', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Habilitar Notificaciones Push
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.notifications.autoDeleteOldNotifications}
                      onChange={(e) => updateConfig('notifications', 'autoDeleteOldNotifications', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Eliminar Notificaciones Antiguas Automáticamente
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'storage' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Configuración de Almacenamiento
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configuración de almacenamiento de archivos
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tamaño Máximo de Archivo (MB)</label>
                    <input
                      type="number"
                      value={config.storage.maxFileSize}
                      onChange={(e) => updateConfig('storage', 'maxFileSize', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Proveedor de Almacenamiento</label>
                    <select
                      value={config.storage.storageProvider}
                      onChange={(e) => updateConfig('storage', 'storageProvider', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="local">Local</option>
                      <option value="s3">Amazon S3</option>
                      <option value="gcs">Google Cloud Storage</option>
                      <option value="azure">Azure Blob Storage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Frecuencia de Backup</label>
                    <select
                      value={config.storage.backupFrequency}
                      onChange={(e) => updateConfig('storage', 'backupFrequency', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="hourly">Cada hora</option>
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipos de Archivo Permitidos</label>
                  <input
                    type="text"
                    value={config.storage.allowedFileTypes.join(', ')}
                    onChange={(e) => updateConfig('storage', 'allowedFileTypes', e.target.value.split(',').map(t => t.trim()))}
                    placeholder="pdf, doc, docx, jpg, png"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.storage.enableCompression}
                    onChange={(e) => updateConfig('storage', 'enableCompression', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Habilitar Compresión de Archivos
                  </label>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'performance' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Configuración de Rendimiento
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configuración de optimización y rendimiento del sistema
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duración del Cache (segundos)</label>
                    <input
                      type="number"
                      value={config.performance.cacheDuration}
                      onChange={(e) => updateConfig('performance', 'cacheDuration', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Usuarios Concurrentes Máximos</label>
                    <input
                      type="number"
                      value={config.performance.maxConcurrentUsers}
                      onChange={(e) => updateConfig('performance', 'maxConcurrentUsers', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.performance.cacheEnabled}
                      onChange={(e) => updateConfig('performance', 'cacheEnabled', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Habilitar Cache
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.performance.enableGzip}
                      onChange={(e) => updateConfig('performance', 'enableGzip', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Habilitar Compresión Gzip
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.performance.enableCDN}
                      onChange={(e) => updateConfig('performance', 'enableCDN', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Habilitar CDN
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Restart Confirmation Modal */}
        {showRestartModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar Reinicio</h3>
                <p className="text-sm text-gray-500 mb-4">
                  ¿Estás seguro de que quieres reiniciar el sistema? 
                  Esto puede causar interrupciones temporales en el servicio.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setShowRestartModal(false)}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleRestartSystem}
                    disabled={saving}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                  >
                    {saving ? 'Reiniciando...' : 'Reiniciar Sistema'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
