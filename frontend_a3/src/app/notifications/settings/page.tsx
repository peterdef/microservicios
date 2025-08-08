'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Layout } from '../../../components/Layout';
import { notificationService } from '../../../services/notificationService';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Globe, 
  Shield, 
  Clock, 
  Save,
  AlertCircle,
  CheckCircle,
  X,
  Settings,
  User,
  Calendar,
  Tag,
  Volume2,
  VolumeX,
  Eye,
  EyeOff
} from 'lucide-react';

interface NotificationSettings {
  email: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    types: string[];
  };
  push: {
    enabled: boolean;
    types: string[];
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    types: string[];
  };
  privacy: {
    showReadStatus: boolean;
    allowAnalytics: boolean;
  };
  schedule: {
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    timezone: string;
  };
}

export default function NotificationSettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      frequency: 'immediate',
      types: ['PUBLICACION_APROBADA', 'CAMBIOS_SOLICITADOS', 'REVISION_ASIGNADA']
    },
    push: {
      enabled: true,
      types: ['PUBLICACION_APROBADA', 'CAMBIOS_SOLICITADOS', 'REVISION_ASIGNADA', 'URGENTE']
    },
    inApp: {
      enabled: true,
      sound: true,
      types: ['PUBLICACION_APROBADA', 'CAMBIOS_SOLICITADOS', 'REVISION_ASIGNADA', 'COMENTARIO', 'CITACION']
    },
    privacy: {
      showReadStatus: true,
      allowAnalytics: false
    },
    schedule: {
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      timezone: 'America/Mexico_City'
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const notificationTypes = [
    { value: 'PUBLICACION_APROBADA', label: 'Publicación Aprobada', icon: CheckCircle },
    { value: 'CAMBIOS_SOLICITADOS', label: 'Cambios Solicitados', icon: AlertCircle },
    { value: 'REVISION_ASIGNADA', label: 'Revisión Asignada', icon: Eye },
    { value: 'COMENTARIO', label: 'Comentarios', icon: Tag },
    { value: 'CITACION', label: 'Citaciones', icon: Globe },
    { value: 'RECORDATORIO', label: 'Recordatorios', icon: Clock },
    { value: 'SISTEMA', label: 'Sistema', icon: Settings },
    { value: 'URGENTE', label: 'Urgentes', icon: AlertCircle }
  ];

  const frequencyOptions = [
    { value: 'immediate', label: 'Inmediato' },
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' }
  ];

  const timezones = [
    { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
    { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
    { value: 'America/Los_Angeles', label: 'Los Ángeles (GMT-8)' },
    { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
    { value: 'UTC', label: 'UTC' }
  ];

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.getNotificationSettings();
      console.log('Settings Response:', response);
      
      if (response && response.settings) {
        setSettings(response.settings);
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      setError(error.message || 'Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      return;
    }

    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated, isLoading]);

  const handleSettingChange = (section: keyof NotificationSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleTypeToggle = (section: 'email' | 'push' | 'inApp', type: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        types: prev[section].types.includes(type)
          ? prev[section].types.filter(t => t !== type)
          : [...prev[section].types, type]
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      await notificationService.updateNotificationSettings(settings);
      setSuccess('Configuración guardada exitosamente');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setError(error.message || 'Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = notificationTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : Bell;
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuración de Notificaciones</h1>
              <p className="mt-2 text-gray-600">
                Personaliza cómo y cuándo recibir notificaciones
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Notificaciones por Email</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Habilitar emails</span>
                <button
                  onClick={() => handleSettingChange('email', 'enabled', !settings.email.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.email.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.email.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {settings.email.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frecuencia de emails
                    </label>
                    <select
                      value={settings.email.frequency}
                      onChange={(e) => handleSettingChange('email', 'frequency', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {frequencyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tipos de notificaciones por email
                    </label>
                    <div className="space-y-2">
                      {notificationTypes.map(type => {
                        const Icon = getTypeIcon(type.value);
                        return (
                          <label key={type.value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.email.types.includes(type.value)}
                              onChange={() => handleTypeToggle('email', type.value)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <Icon className="h-4 w-4 ml-2 text-gray-500" />
                            <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Smartphone className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Notificaciones Push</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Habilitar push</span>
                <button
                  onClick={() => handleSettingChange('push', 'enabled', !settings.push.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.push.enabled ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.push.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {settings.push.enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipos de notificaciones push
                  </label>
                  <div className="space-y-2">
                    {notificationTypes.map(type => {
                      const Icon = getTypeIcon(type.value);
                      return (
                        <label key={type.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.push.types.includes(type.value)}
                            onChange={() => handleTypeToggle('push', type.value)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <Icon className="h-4 w-4 ml-2 text-gray-500" />
                          <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* In-App Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Notificaciones en la App</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Habilitar notificaciones</span>
                <button
                  onClick={() => handleSettingChange('inApp', 'enabled', !settings.inApp.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.inApp.enabled ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.inApp.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {settings.inApp.enabled && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Sonido de notificaciones</span>
                    <button
                      onClick={() => handleSettingChange('inApp', 'sound', !settings.inApp.sound)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.inApp.sound ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.inApp.sound ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tipos de notificaciones en la app
                    </label>
                    <div className="space-y-2">
                      {notificationTypes.map(type => {
                        const Icon = getTypeIcon(type.value);
                        return (
                          <label key={type.value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.inApp.types.includes(type.value)}
                              onChange={() => handleTypeToggle('inApp', type.value)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <Icon className="h-4 w-4 ml-2 text-gray-500" />
                            <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-orange-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Privacidad</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Mostrar estado de lectura</span>
                <button
                  onClick={() => handleSettingChange('privacy', 'showReadStatus', !settings.privacy.showReadStatus)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.privacy.showReadStatus ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.privacy.showReadStatus ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Permitir análisis</span>
                <button
                  onClick={() => handleSettingChange('privacy', 'allowAnalytics', !settings.privacy.allowAnalytics)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.privacy.allowAnalytics ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.privacy.allowAnalytics ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Schedule Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-indigo-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Horario</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Horas silenciosas</span>
                <button
                  onClick={() => handleSettingChange('schedule', 'quietHours', { ...settings.schedule.quietHours, enabled: !settings.schedule.quietHours.enabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.schedule.quietHours.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.schedule.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {settings.schedule.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inicio
                    </label>
                    <input
                      type="time"
                      value={settings.schedule.quietHours.start}
                      onChange={(e) => handleSettingChange('schedule', 'quietHours', { ...settings.schedule.quietHours, start: e.target.value })}
                      className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fin
                    </label>
                    <input
                      type="time"
                      value={settings.schedule.quietHours.end}
                      onChange={(e) => handleSettingChange('schedule', 'quietHours', { ...settings.schedule.quietHours, end: e.target.value })}
                      className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zona horaria
                </label>
                <select
                  value={settings.schedule.timezone}
                  onChange={(e) => handleSettingChange('schedule', 'timezone', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {timezones.map(tz => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Guardando configuración...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Guardar Configuración
              </>
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
}
