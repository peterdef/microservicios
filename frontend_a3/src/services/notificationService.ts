import { Notification } from '../types/notification';

const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('auth_token');

export const notificationService = {
  // Obtener mis notificaciones
  async getMyNotifications() {
    const response = await fetch(`${API_BASE_URL}/notificaciones/mis-notificaciones`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener mis notificaciones');
    }

    return response.json();
  },

  // Marcar notificación como leída
  async markAsRead(id: number) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/${id}/leer`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al marcar como leída');
    }

    return response.json();
  },

  // Marcar notificación como no leída
  async markAsUnread(id: number) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/${id}/no-leer`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al marcar como no leída');
    }

    return response.json();
  },

  // Obtener conteo de notificaciones no leídas
  async getUnreadCount() {
    const response = await fetch(`${API_BASE_URL}/notificaciones/unread-count`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener conteo de notificaciones');
    }

    return response.json();
  },

  // Crear nueva notificación
  async createNotification(notification: Partial<Notification>) {
    const response = await fetch(`${API_BASE_URL}/notificaciones`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear notificación');
    }

    return response.json();
  },

  // Actualizar notificación
  async updateNotification(id: number, notification: Partial<Notification>) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar notificación');
    }

    return response.json();
  },

  // Eliminar notificación
  async deleteNotification(id: number) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar notificación');
    }

    return response.json();
  },

  // Obtener notificación por ID
  async getNotificationById(id: number) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/${id}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificación');
    }

    return response.json();
  },

  // Marcar todas las notificaciones como leídas
  async markAllAsRead() {
    const response = await fetch(`${API_BASE_URL}/notificaciones/mark-all-read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al marcar todas como leídas');
    }

    return response.json();
  },

  // Obtener notificaciones por tipo
  async getNotificationsByType(type: string) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/type/${type}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones por tipo');
    }

    return response.json();
  },

  // Obtener notificaciones por prioridad
  async getNotificationsByPriority(priority: string) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/priority/${priority}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones por prioridad');
    }

    return response.json();
  },

  // Obtener notificaciones por fecha
  async getNotificationsByDate(startDate: string, endDate: string) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/date-range`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startDate, endDate }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones por fecha');
    }

    return response.json();
  },

  // Obtener notificaciones leídas
  async getReadNotifications() {
    const response = await fetch(`${API_BASE_URL}/notificaciones/read`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones leídas');
    }

    return response.json();
  },

  // Obtener notificaciones no leídas
  async getUnreadNotifications() {
    const response = await fetch(`${API_BASE_URL}/notificaciones/unread`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones no leídas');
    }

    return response.json();
  },

  // Obtener notificaciones urgentes
  async getUrgentNotifications() {
    const response = await fetch(`${API_BASE_URL}/notificaciones/urgent`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones urgentes');
    }

    return response.json();
  },

  // Marcar notificación como urgente
  async markAsUrgent(id: number) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/${id}/urgent`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al marcar como urgente');
    }

    return response.json();
  },

  // Obtener estadísticas de notificaciones
  async getNotificationStats() {
    const response = await fetch(`${API_BASE_URL}/notificaciones/stats`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas de notificaciones');
    }

    return response.json();
  },

  // Obtener notificaciones recientes
  async getRecentNotifications(limit: number = 10) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/recent?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones recientes');
    }

    return response.json();
  },

  // Obtener notificaciones por usuario
  async getNotificationsByUser(userId: number) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
      
      if (!response.ok) {
      throw new Error('Error al obtener notificaciones por usuario');
    }

    return response.json();
  },

  // Enviar notificación a múltiples usuarios
  async sendBulkNotification(userIds: number[], notification: Partial<Notification>) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/bulk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIds, notification }),
    });

    if (!response.ok) {
      throw new Error('Error al enviar notificaciones masivas');
    }

    return response.json();
  },

  // Obtener plantillas de notificaciones
  async getNotificationTemplates() {
    const response = await fetch(`${API_BASE_URL}/notificaciones/templates`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener plantillas de notificaciones');
    }

    return response.json();
  },

  // Crear notificación desde plantilla
  async createFromTemplate(templateId: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/template/${templateId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al crear notificación desde plantilla');
    }

    return response.json();
  },

  // Exportar notificaciones
  async exportNotifications(format: 'pdf' | 'csv' | 'json', filters?: any) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/export`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ format, filters }),
    });

    if (!response.ok) {
      throw new Error('Error al exportar notificaciones');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notifications.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Limpiar notificaciones antiguas
  async clearOldNotifications(daysOld: number = 30) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/clear-old`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ daysOld }),
    });

    if (!response.ok) {
      throw new Error('Error al limpiar notificaciones antiguas');
    }

    return response.json();
  },

  // Obtener configuración de notificaciones
  async getNotificationSettings() {
    const response = await fetch(`${API_BASE_URL}/notificaciones/settings`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener configuración de notificaciones');
    }

    return response.json();
  },

  // Actualizar configuración de notificaciones
  async updateNotificationSettings(settings: any) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar configuración de notificaciones');
    }

    return response.json();
  },

  // Obtener notificaciones programadas
  async getScheduledNotifications() {
    const response = await fetch(`${API_BASE_URL}/notificaciones/scheduled`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones programadas');
    }

    return response.json();
  },

  // Programar notificación
  async scheduleNotification(notification: Partial<Notification>, scheduledDate: string) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/schedule`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notification, scheduledDate }),
    });

    if (!response.ok) {
      throw new Error('Error al programar notificación');
    }

    return response.json();
  },

  // Cancelar notificación programada
  async cancelScheduledNotification(id: number) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/scheduled/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al cancelar notificación programada');
    }

    return response.json();
  },

  // Obtener notificaciones por aplicación
  async getNotificationsByApp(appId: string) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/app/${appId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones por aplicación');
    }

    return response.json();
  },

  // Obtener métricas de notificaciones
  async getNotificationMetrics() {
    const response = await fetch(`${API_BASE_URL}/notificaciones/metrics`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener métricas de notificaciones');
    }

    return response.json();
  },

  // Obtener notificaciones por canal
  async getNotificationsByChannel(channel: string) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/channel/${channel}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones por canal');
    }

    return response.json();
  },

  // Enviar notificación por email
  async sendEmailNotification(userId: number, emailData: { subject: string; body: string }) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...emailData }),
    });

    if (!response.ok) {
      throw new Error('Error al enviar notificación por email');
    }

    return response.json();
  },

  // Enviar notificación push
  async sendPushNotification(userId: number, pushData: { title: string; body: string; data?: any }) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/push`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...pushData }),
    });

    if (!response.ok) {
      throw new Error('Error al enviar notificación push');
    }

    return response.json();
  },

  // Obtener notificaciones por estado
  async getNotificationsByStatus(status: string) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/status/${status}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones por estado');
    }

    return response.json();
  },

  // Cambiar estado de notificación
  async changeNotificationStatus(id: number, status: string) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Error al cambiar estado de notificación');
    }

    return response.json();
  },

  // Obtener notificaciones por prioridad y tipo
  async getNotificationsByPriorityAndType(priority: string, type: string) {
    const response = await fetch(`${API_BASE_URL}/notificaciones/filter`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priority, type }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener notificaciones filtradas');
    }

    return response.json();
  }
};
