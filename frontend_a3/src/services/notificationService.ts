import { Notification, NotificationType, NotificationCategory, NotificationPriority, ROLE_NOTIFICATION_TYPES } from '../types/notification';
import { mockDataService } from './mockDataService';
import { hasRole } from '../types/auth';

class NotificationService {
  async getMyNotifications(): Promise<any[]> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const myNotifications = mockDataService.getMyNotifications(user.email);
      
      // Filter notifications based on user role
      const roleBasedNotifications = this.filterNotificationsByRole(myNotifications, user.roles);
      
      console.log('My notifications:', roleBasedNotifications.length);
      return roleBasedNotifications;
    } catch (error) {
      console.error('Error getting my notifications:', error);
      throw new Error('Error al obtener mis notificaciones');
    }
  }

  // Filter notifications based on user roles
  private filterNotificationsByRole(notifications: any[], userRoles: string[]): any[] {
    if (!userRoles || userRoles.length === 0) {
      return notifications;
    }

    // Get allowed notification types for user roles
    const allowedTypes = new Set<string>();
    userRoles.forEach(role => {
      const roleNotifications = ROLE_NOTIFICATION_TYPES[role as keyof typeof ROLE_NOTIFICATION_TYPES];
      if (roleNotifications) {
        roleNotifications.forEach(type => allowedTypes.add(type));
      }
    });

    // Filter notifications by allowed types
    return notifications.filter(notification => {
      // Admin can see all notifications
      if (userRoles.includes('ROLE_ADMIN')) {
        return true;
      }
      
      // Check if notification type is allowed for user roles
      return allowedTypes.has(notification.tipo);
    });
  }

  async markAsRead(id: number): Promise<any> {
    try {
      const updatedNotification = mockDataService.updateNotification(id, { 
        leida: true,
        fechaLectura: new Date().toISOString(),
        estado: 'READ'
      });
      
      if (!updatedNotification) {
        throw new Error('Notificación no encontrada');
      }
      
      console.log('Notification marked as read');
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Error al marcar como leída');
    }
  }

  async markAsUnread(id: number): Promise<any> {
    try {
      const updatedNotification = mockDataService.updateNotification(id, { 
        leida: false,
        fechaLectura: null,
        estado: 'UNREAD'
      });
      
      if (!updatedNotification) {
        throw new Error('Notificación no encontrada');
      }
      
      console.log('Notification marked as unread');
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as unread:', error);
      throw new Error('Error al marcar como no leída');
    }
  }

  async getUnreadCount(): Promise<any> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const notifications = mockDataService.getMyNotifications(user.email);
      const roleBasedNotifications = this.filterNotificationsByRole(notifications, user.roles);
      
      const unreadCount = roleBasedNotifications.filter((n: any) => !n.leida).length;
      
      return { count: unreadCount };
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw new Error('Error al obtener conteo de notificaciones');
    }
  }

  async createNotification(notification: Partial<Notification>): Promise<any> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      
      const newNotification = mockDataService.addNotification({
        ...notification,
        usuario: {
          id: user.id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email
        },
        fechaCreacion: new Date().toISOString(),
        leida: false,
        urgente: notification.prioridad === 'URGENT' || notification.prioridad === 'HIGH',
        estado: 'UNREAD'
      });
      
      console.log('Notification created and saved to mock service');
      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Error al crear notificación');
    }
  }

  // Create role-based notification
  async createRoleBasedNotification(
    tipo: NotificationType,
    categoria: NotificationCategory,
    titulo: string,
    mensaje: string,
    destinatarioEmail: string,
    prioridad: NotificationPriority = NotificationPriority.MEDIUM,
    metadata?: Record<string, any>
  ): Promise<any> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      
      const newNotification = mockDataService.addNotification({
        tipo,
        categoria,
        titulo,
        mensaje,
        prioridad,
        metadata,
        usuario: {
          id: user.id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: destinatarioEmail
        },
        fechaCreacion: new Date().toISOString(),
        leida: false,
        urgente: prioridad === 'URGENT' || prioridad === 'HIGH',
        estado: 'UNREAD'
      });
      
      console.log('Role-based notification created');
      return newNotification;
    } catch (error) {
      console.error('Error creating role-based notification:', error);
      throw new Error('Error al crear notificación basada en rol');
    }
  }

  // Create system notification for all users with specific roles
  async createSystemNotification(
    tipo: NotificationType,
    categoria: NotificationCategory,
    titulo: string,
    mensaje: string,
    targetRoles: string[],
    prioridad: NotificationPriority = NotificationPriority.MEDIUM,
    metadata?: Record<string, any>
  ): Promise<any[]> {
    try {
      const allUsers = mockDataService.getUsers();
      const targetUsers = allUsers.filter((user: any) => 
        user.roles.some((role: string) => targetRoles.includes(role))
      );

      const notifications = [];
      for (const user of targetUsers) {
        const notification = await this.createRoleBasedNotification(
          tipo,
          categoria,
          titulo,
          mensaje,
          user.email,
          prioridad,
          metadata
        );
        notifications.push(notification);
      }

      console.log(`System notification created for ${notifications.length} users`);
      return notifications;
    } catch (error) {
      console.error('Error creating system notification:', error);
      throw new Error('Error al crear notificación del sistema');
    }
  }

  async updateNotification(id: number, notification: Partial<Notification>): Promise<any> {
    try {
      const updatedNotification = mockDataService.updateNotification(id, notification);
      
      if (!updatedNotification) {
        throw new Error('Notificación no encontrada');
      }
      
      return updatedNotification;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw new Error('Error al actualizar notificación');
    }
  }

  async deleteNotification(id: number): Promise<void> {
    try {
      mockDataService.deleteNotification(id);
      console.log('Notification deleted from mock service');
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error('Error al eliminar notificación');
    }
  }

  async getNotificationById(id: number): Promise<any> {
    try {
      const notifications = mockDataService.getNotifications();
      const notification = notifications.find((n: any) => n.id === id);
      
      if (!notification) {
        throw new Error('Notificación no encontrada');
      }
      
      return notification;
    } catch (error) {
      console.error('Error getting notification:', error);
      throw new Error('Error al obtener notificación');
    }
  }

  async markAllAsRead(): Promise<any> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const notifications = mockDataService.getMyNotifications(user.email);
      const roleBasedNotifications = this.filterNotificationsByRole(notifications, user.roles);
      
      roleBasedNotifications.forEach((notification: any) => {
        if (!notification.leida) {
          mockDataService.updateNotification(notification.id, { 
            leida: true,
            fechaLectura: new Date().toISOString(),
            estado: 'READ'
          });
        }
      });
      
      console.log('All notifications marked as read');
      return { success: true };
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw new Error('Error al marcar todas como leídas');
    }
  }

  async getNotificationsByType(type: string): Promise<any[]> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const notifications = mockDataService.getMyNotifications(user.email);
      const roleBasedNotifications = this.filterNotificationsByRole(notifications, user.roles);
      
      const filteredNotifications = roleBasedNotifications.filter((n: any) => n.tipo === type);
      
      return filteredNotifications;
    } catch (error) {
      console.error('Error getting notifications by type:', error);
      throw new Error('Error al obtener notificaciones por tipo');
    }
  }

  async getNotificationsByCategory(category: string): Promise<any[]> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const notifications = mockDataService.getMyNotifications(user.email);
      const roleBasedNotifications = this.filterNotificationsByRole(notifications, user.roles);
      
      const filteredNotifications = roleBasedNotifications.filter((n: any) => n.categoria === category);
      
      return filteredNotifications;
    } catch (error) {
      console.error('Error getting notifications by category:', error);
      throw new Error('Error al obtener notificaciones por categoría');
    }
  }

  async getNotificationsByPriority(priority: string): Promise<any[]> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const notifications = mockDataService.getMyNotifications(user.email);
      const roleBasedNotifications = this.filterNotificationsByRole(notifications, user.roles);
      
      const filteredNotifications = roleBasedNotifications.filter((n: any) => n.prioridad === priority);
      
      return filteredNotifications;
    } catch (error) {
      console.error('Error getting notifications by priority:', error);
      throw new Error('Error al obtener notificaciones por prioridad');
    }
  }

  async getReadNotifications(): Promise<any[]> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const notifications = mockDataService.getMyNotifications(user.email);
      const roleBasedNotifications = this.filterNotificationsByRole(notifications, user.roles);
      
      const readNotifications = roleBasedNotifications.filter((n: any) => n.leida);
      
      return readNotifications;
    } catch (error) {
      console.error('Error getting read notifications:', error);
      throw new Error('Error al obtener notificaciones leídas');
    }
  }

  async getUnreadNotifications(): Promise<any[]> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const notifications = mockDataService.getMyNotifications(user.email);
      const roleBasedNotifications = this.filterNotificationsByRole(notifications, user.roles);
      
      const unreadNotifications = roleBasedNotifications.filter((n: any) => !n.leida);
      
      return unreadNotifications;
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      throw new Error('Error al obtener notificaciones no leídas');
    }
  }

  async getUrgentNotifications(): Promise<any[]> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const notifications = mockDataService.getMyNotifications(user.email);
      const roleBasedNotifications = this.filterNotificationsByRole(notifications, user.roles);
      
      const urgentNotifications = roleBasedNotifications.filter((n: any) => n.urgente);
      
      return urgentNotifications;
    } catch (error) {
      console.error('Error getting urgent notifications:', error);
      throw new Error('Error al obtener notificaciones urgentes');
    }
  }

  async markAsUrgent(id: number): Promise<any> {
    try {
      const updatedNotification = mockDataService.updateNotification(id, { urgente: true });
      
      if (!updatedNotification) {
        throw new Error('Notificación no encontrada');
      }
      
      console.log('Notification marked as urgent');
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as urgent:', error);
      throw new Error('Error al marcar como urgente');
    }
  }

  async getNotificationStats(): Promise<any> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const notifications = mockDataService.getMyNotifications(user.email);
      const roleBasedNotifications = this.filterNotificationsByRole(notifications, user.roles);
      
      const stats = {
        total: roleBasedNotifications.length,
        unread: roleBasedNotifications.filter((n: any) => !n.leida).length,
        urgent: roleBasedNotifications.filter((n: any) => n.urgente).length,
        byType: roleBasedNotifications.reduce((acc: any, n: any) => {
          acc[n.tipo] = (acc[n.tipo] || 0) + 1;
          return acc;
        }, {}),
        byCategory: roleBasedNotifications.reduce((acc: any, n: any) => {
          acc[n.categoria] = (acc[n.categoria] || 0) + 1;
          return acc;
        }, {}),
        byPriority: roleBasedNotifications.reduce((acc: any, n: any) => {
          acc[n.prioridad] = (acc[n.prioridad] || 0) + 1;
          return acc;
        }, {})
      };
      
      return stats;
    } catch (error) {
      console.error('Error getting notification stats:', error);
      throw new Error('Error al obtener estadísticas de notificaciones');
    }
  }

  async getRecentNotifications(limit: number = 10): Promise<any[]> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const notifications = mockDataService.getMyNotifications(user.email);
      const roleBasedNotifications = this.filterNotificationsByRole(notifications, user.roles);
      
      const recentNotifications = roleBasedNotifications
        .sort((a: any, b: any) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
        .slice(0, limit);
      
      return recentNotifications;
    } catch (error) {
      console.error('Error getting recent notifications:', error);
      throw new Error('Error al obtener notificaciones recientes');
    }
  }

  // Método para limpiar datos mock
  async clearMockData(): Promise<void> {
    mockDataService.clearAllData();
  }

  // Método para resetear a datos por defecto
  async resetToDefaults(): Promise<void> {
    mockDataService.resetToDefaults();
  }

  // Método para exportar datos
  async exportData(): Promise<any> {
    return mockDataService.exportData();
  }

  // Método para importar datos
  async importData(data: any): Promise<void> {
    mockDataService.importData(data);
  }

  // Obtener configuración de notificaciones
  async getNotificationSettings(): Promise<any> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      
      // Configuración por defecto
      const defaultSettings = {
        emailNotifications: true,
        pushNotifications: true,
        inAppNotifications: true,
        notificationTypes: {
          PUBLICACION: true,
          REVISION: true,
          SISTEMA: true
        },
        frequency: 'IMMEDIATE', // IMMEDIATE, DAILY, WEEKLY
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00'
        }
      };
      
      // Intentar obtener configuración guardada del usuario
      const savedSettings = localStorage.getItem(`notification_settings_${user.email}`);
      if (savedSettings) {
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      }
      
      return defaultSettings;
    } catch (error) {
      console.error('Error getting notification settings:', error);
      throw new Error('Error al obtener configuración de notificaciones');
    }
  }

  // Actualizar configuración de notificaciones
  async updateNotificationSettings(settings: any): Promise<any> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      
      if (!user.email) {
        throw new Error('Usuario no autenticado');
      }
      
      // Guardar configuración en localStorage
      localStorage.setItem(`notification_settings_${user.email}`, JSON.stringify(settings));
      
      console.log('Notification settings updated');
      return { success: true, settings };
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw new Error('Error al actualizar configuración de notificaciones');
    }
  }

  // Exportar notificaciones
  async exportNotifications(format: 'pdf' | 'csv' | 'json', filters?: any): Promise<void> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const notifications = mockDataService.getMyNotifications(user.email);
      const roleBasedNotifications = this.filterNotificationsByRole(notifications, user.roles);
      
      let data: string;
      let filename: string;
      
      switch (format) {
        case 'json':
          data = JSON.stringify(roleBasedNotifications, null, 2);
          filename = `notifications_${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'csv':
          const csvHeaders = ['ID', 'Título', 'Mensaje', 'Tipo', 'Categoría', 'Prioridad', 'Leída', 'Fecha'];
          const csvRows = roleBasedNotifications.map((n: any) => [
            n.id,
            n.titulo,
            n.mensaje,
            n.tipo,
            n.categoria,
            n.prioridad,
            n.leida ? 'Sí' : 'No',
            new Date(n.fechaCreacion).toLocaleDateString()
          ]);
          data = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
          filename = `notifications_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        default:
          throw new Error('Formato no soportado');
      }
      
      const blob = new Blob([data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Notifications exported');
    } catch (error) {
      console.error('Error exporting notifications:', error);
      throw new Error('Error al exportar notificaciones');
    }
  }

  // Limpiar notificaciones antiguas
  async clearOldNotifications(daysOld: number = 30): Promise<any> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const notifications = mockDataService.getMyNotifications(user.email);
      const roleBasedNotifications = this.filterNotificationsByRole(notifications, user.roles);
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const oldNotifications = roleBasedNotifications.filter((n: any) => {
        const notificationDate = new Date(n.fechaCreacion);
        return notificationDate <= cutoffDate;
      });
      
      oldNotifications.forEach((notification: any) => {
        mockDataService.deleteNotification(notification.id);
      });
      
      console.log('Old notifications cleared');
      return { success: true, deletedCount: oldNotifications.length };
    } catch (error) {
      console.error('Error clearing old notifications:', error);
      throw new Error('Error al limpiar notificaciones antiguas');
    }
  }

  // Método para iniciar revisión desde notificación
  async iniciarRevision(notificationId: number): Promise<any> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      
      // Obtener la notificación
      const notification = await this.getNotificationById(notificationId);
      
      if (!notification) {
        throw new Error('Notificación no encontrada');
      }

      // Verificar que la notificación sea de tipo revisión
      if (!notification.tipo.includes('REVIEW')) {
        throw new Error('Esta notificación no es de tipo revisión');
      }

      // Extraer información de la publicación desde metadata
      const publicationId = notification.metadata?.publicationId;
      if (!publicationId) {
        throw new Error('No se encontró información de la publicación');
      }

      // Crear nueva revisión
      const reviewData = {
        publicacion: {
          id: publicationId,
          titulo: notification.metadata?.publicationTitle || 'Sin título',
          autores: notification.metadata?.publicationAuthors || []
        },
        revisor: {
          id: user.id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email
        },
        estado: 'EN_PROGRESO',
        fechaAsignacion: new Date().toISOString(),
        fechaInicio: new Date().toISOString(),
        comentarios: [],
        calificacion: null,
        recomendacion: null
      };

      // Agregar revisión usando el servicio mock
      const newReview = mockDataService.addReview(reviewData);

      // Actualizar la notificación como leída
      await this.markAsRead(notificationId);

      // Crear notificación de confirmación
      await this.createRoleBasedNotification(
        'REVIEW_STARTED',
        'REVIEW',
        'Revisión Iniciada',
        `Has iniciado la revisión de "${notification.metadata?.publicationTitle || 'la publicación'}"`,
        user.email,
        'MEDIUM',
        {
          reviewId: newReview.id,
          publicationId: publicationId
        }
      );

      console.log('Review started successfully');
      return { success: true, review: newReview };
    } catch (error) {
      console.error('Error starting review:', error);
      throw new Error('Error al iniciar la revisión');
    }
  }

  // Método para completar revisión desde notificación
  async completarRevision(notificationId: number, reviewData: {
    calificacion: number;
    recomendacion: 'ACEPTAR' | 'RECHAZAR' | 'CAMBIOS_MINOR' | 'CAMBIOS_MAJOR';
    comentarios: string;
  }): Promise<any> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      
      // Obtener la notificación
      const notification = await this.getNotificationById(notificationId);
      
      if (!notification) {
        throw new Error('Notificación no encontrada');
      }

      // Verificar que la notificación sea de tipo revisión
      if (!notification.tipo.includes('REVIEW')) {
        throw new Error('Esta notificación no es de tipo revisión');
      }

      // Obtener la revisión existente
      const reviewId = notification.metadata?.reviewId;
      if (!reviewId) {
        throw new Error('No se encontró información de la revisión');
      }

      // Actualizar la revisión
      const updatedReview = mockDataService.updateReview(reviewId, {
        ...reviewData,
        estado: 'COMPLETADA',
        fechaCompletado: new Date().toISOString(),
        fechaFin: new Date().toISOString()
      });

      if (!updatedReview) {
        throw new Error('Revisión no encontrada');
      }

      // Actualizar la notificación como leída
      await this.markAsRead(notificationId);

      // Crear notificación de confirmación
      await this.createRoleBasedNotification(
        'REVIEW_COMPLETED',
        'REVIEW',
        'Revisión Completada',
        `Has completado la revisión de "${notification.metadata?.publicationTitle || 'la publicación'}" con recomendación: ${reviewData.recomendacion}`,
        user.email,
        'MEDIUM',
        {
          reviewId: reviewId,
          publicationId: notification.metadata?.publicationId,
          recomendacion: reviewData.recomendacion
        }
      );

      // Notificar al editor sobre la revisión completada
      const editors = mockDataService.getUsers().filter((u: any) => 
        u.roles.includes('ROLE_EDITOR') || u.roles.includes('ROLE_ADMIN')
      );

      for (const editor of editors) {
        await this.createRoleBasedNotification(
          'REVIEW_COMPLETED',
          'REVIEW',
          'Revisión Completada',
          `El revisor ${user.nombres} ${user.apellidos} ha completado la revisión de "${notification.metadata?.publicationTitle || 'la publicación'}"`,
          editor.email,
          'HIGH',
          {
            reviewId: reviewId,
            publicationId: notification.metadata?.publicationId,
            revisorId: user.id,
            recomendacion: reviewData.recomendacion
          }
        );
      }

      console.log('Review completed successfully');
      return { success: true, review: updatedReview };
    } catch (error) {
      console.error('Error completing review:', error);
      throw new Error('Error al completar la revisión');
    }
  }
}

export const notificationService = new NotificationService();
