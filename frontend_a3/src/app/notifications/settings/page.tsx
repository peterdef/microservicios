'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Layout } from '../../../components/Layout';
import { notificationService } from '../../../services/notificationService';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Monitor, 
  Settings, 
  Save,
  Clock,
  Globe, 
  Languages,
  Volume2,
  VolumeX,
  Calendar,
  Shield,
  Database,
  Activity,
  FileText,
  Eye,
  User,
  AlertTriangle,
  CheckCircle,
  Info,
  Tag
} from 'lucide-react';
import { NotificationType, NotificationCategory, NotificationPriority, ROLE_NOTIFICATION_TYPES } from '../../../types/notification';
import { ROLES } from '../../../types/auth';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  notificationTypes: Record<string, boolean>;
  categories: Record<string, boolean>;
  priorities: Record<string, boolean>;
  frequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY';
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  grouping: boolean;
  retentionDays: number;
  language: string;
    timezone: string;
}

export default function NotificationSettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    inAppNotifications: true,
    notificationTypes: {},
    categories: {},
    priorities: {},
    frequency: 'IMMEDIATE',
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
    grouping: true,
    retentionDays: 30,
    language: 'es',
      timezone: 'America/Mexico_City'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      return;
    }

    if (isAuthenticated) {
      loadSettings();
    }
  }, [isAuthenticated, isLoading]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const savedSettings = await notificationService.getNotificationSettings();
      
      // Initialize notification types based on user roles
      const userRoles = user?.roles || [];
      const allowedTypes = new Set<string>();
      
      userRoles.forEach(role => {
        const roleNotifications = ROLE_NOTIFICATION_TYPES[role as keyof typeof ROLE_NOTIFICATION_TYPES];
        if (roleNotifications) {
          roleNotifications.forEach(type => allowedTypes.add(type));
        }
      });

      // Initialize default settings for allowed types
      const notificationTypes: Record<string, boolean> = {};
      const categories: Record<string, boolean> = {};
      const priorities: Record<string, boolean> = {};

      // Initialize all notification types
      Object.values(NotificationType).forEach(type => {
        notificationTypes[type] = allowedTypes.has(type);
      });

      // Initialize all categories
      Object.values(NotificationCategory).forEach(category => {
        categories[category] = true;
      });

      // Initialize all priorities
      Object.values(NotificationPriority).forEach(priority => {
        priorities[priority] = true;
      });

      setSettings({
        ...savedSettings,
        notificationTypes,
        categories,
        priorities
      });
    } catch (error: any) {
      console.error('Error loading settings:', error);
      setError(error.message || 'Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      await notificationService.updateNotificationSettings(settings);
      setSuccess('Configuración guardada exitosamente');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setError(error.message || 'Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleType = (type: string) => {
    setSettings(prev => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [type]: !prev.notificationTypes[type]
      }
    }));
  };

  const handleToggleCategory = (category: string) => {
    setSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category]
      }
    }));
  };

  const handleTogglePriority = (priority: string) => {
    setSettings(prev => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        [priority]: !prev.priorities[priority]
      }
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'REVIEW_ASSIGNED':
      case 'REVIEW_COMPLETED':
      case 'REVIEW_OVERDUE':
      case 'REVIEW_REMINDER':
        return <Eye className="h-4 w-4" />;
      case 'PUBLICATION_SUBMITTED':
      case 'PUBLICATION_APPROVED':
      case 'PUBLICATION_PUBLISHED':
      case 'PUBLICATION_REJECTED':
      case 'PUBLICATION_CHANGES_REQUESTED':
        return <FileText className="h-4 w-4" />;
      case 'USER_REGISTERED':
      case 'USER_ROLE_CHANGED':
      case 'USER_ACCOUNT_LOCKED':
      case 'USER_ACCOUNT_UNLOCKED':
        return <User className="h-4 w-4" />;
      case 'SYSTEM_ALERT':
      case 'SYSTEM_MAINTENANCE':
      case 'SECURITY_ALERT':
      case 'PERFORMANCE_ALERT':
        return <Shield className="h-4 w-4" />;
      case 'BACKUP_CREATED':
      case 'BACKUP_RESTORED':
      case 'BACKUP_FAILED':
        return <Database className="h-4 w-4" />;
      case 'CITATION_RECEIVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'COMMENT_RECEIVED':
        return <Info className="h-4 w-4" />;
      case 'NEW_PUBLICATION_AVAILABLE':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PUBLICATION':
        return <FileText className="h-4 w-4" />;
      case 'REVIEW':
        return <Eye className="h-4 w-4" />;
      case 'SYSTEM':
        return <Activity className="h-4 w-4" />;
      case 'USER':
        return <User className="h-4 w-4" />;
      case 'ADMIN':
        return <Shield className="h-4 w-4" />;
      case 'EDITORIAL':
        return <Settings className="h-4 w-4" />;
      case 'SECURITY':
        return <AlertTriangle className="h-4 w-4" />;
      case 'PERFORMANCE':
        return <Activity className="h-4 w-4" />;
      case 'BACKUP':
        return <Database className="h-4 w-4" />;
      case 'EMAIL':
        return <Mail className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <AlertTriangle className="h-4 w-4" />;
      case 'HIGH':
        return <AlertTriangle className="h-4 w-4" />;
      case 'MEDIUM':
        return <Info className="h-4 w-4" />;
      case 'LOW':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
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
            <p className="text-gray-600 font-medium">Cargando configuración...</p>
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
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuración de Notificaciones</h1>
              <p className="text-gray-600">Personaliza cómo recibes las notificaciones del sistema</p>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* General Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Methods */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Métodos de Entrega
              </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Notificaciones por Email</p>
                      <p className="text-sm text-gray-500">Recibe notificaciones en tu correo electrónico</p>
              </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
          </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Notificaciones Push</p>
                      <p className="text-sm text-gray-500">Recibe notificaciones en tu dispositivo móvil</p>
            </div>
              </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => setSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
            </div>
            
              <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Monitor className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Notificaciones en la Aplicación</p>
                      <p className="text-sm text-gray-500">Recibe notificaciones dentro de la aplicación web</p>
              </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                      checked={settings.inAppNotifications}
                      onChange={(e) => setSettings(prev => ({ ...prev, inAppNotifications: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                    </div>
            </div>
          </div>

            {/* Frequency Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Frecuencia de Notificaciones
              </h3>
            <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frecuencia de entrega
                  </label>
                  <select
                    value={settings.frequency}
                    onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="IMMEDIATE">Inmediata</option>
                    <option value="DAILY">Diaria (resumen)</option>
                    <option value="WEEKLY">Semanal (resumen)</option>
                  </select>
              </div>

              <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Horas Silenciosas</p>
                      <p className="text-sm text-gray-500">No recibir notificaciones durante ciertas horas</p>
              </div>
            </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.quietHours.enabled}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        quietHours: { ...prev.quietHours, enabled: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
          </div>

                {settings.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de inicio
                    </label>
                    <input
                      type="time"
                        value={settings.quietHours.start}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          quietHours: { ...prev.quietHours, start: e.target.value }
                        }))}
                      className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de fin
                    </label>
                    <input
                      type="time"
                        value={settings.quietHours.end}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          quietHours: { ...prev.quietHours, end: e.target.value }
                        }))}
                      className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
              </div>
            </div>

            {/* Notification Types */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Tipos de Notificación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(settings.notificationTypes).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(type)}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{type.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => handleToggleType(type)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Categorías
              </h3>
              <div className="space-y-3">
                {Object.entries(settings.categories).map(([category, enabled]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(category)}
                      <span className="text-sm text-gray-700">{category}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => handleToggleCategory(category)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Priorities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Prioridades
              </h3>
              <div className="space-y-3">
                {Object.entries(settings.priorities).map(([priority, enabled]) => (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getPriorityIcon(priority)}
                      <span className="text-sm text-gray-700">{priority}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => handleTogglePriority(priority)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configuración Adicional
              </h3>
              <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retención de notificaciones (días)
                </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={settings.retentionDays}
                    onChange={(e) => setSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))}
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Agrupar notificaciones</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.grouping}
                      onChange={(e) => setSettings(prev => ({ ...prev, grouping: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración
              </>
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
}

