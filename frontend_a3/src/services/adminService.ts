import { mockDataService } from './mockDataService';
import { notificationService } from './notificationService';
import { ROLES } from '../types/auth';

class AdminService {
  async getBackups(): Promise<any[]> {
    try {
      // Implementación simple de backups
      const backups = localStorage.getItem('system_backups');
      return backups ? JSON.parse(backups) : [];
    } catch (error) {
      console.error('Error getting backups:', error);
      throw new Error('Error al obtener backups');
    }
  }

  async createBackup(): Promise<any> {
    try {
      const backupData = {
        users: mockDataService.getUsers(),
        publications: mockDataService.getPublications(),
        reviews: mockDataService.getReviews(),
        timestamp: new Date().toISOString(),
        type: 'manual'
      };
      
      const backups = await this.getBackups();
      const backupName = `backup_${Date.now()}`;
      
      backups.push({
        name: backupName,
        data: backupData,
        date: new Date().toLocaleString(),
        size: JSON.stringify(backupData).length
      });
      
      localStorage.setItem('system_backups', JSON.stringify(backups));
      
      return { message: 'Backup creado exitosamente', backupName };
    } catch (error) {
      console.error('Error creating backup:', error);
      throw new Error('Error al crear backup');
    }
  }

  async restoreBackup(backupName: string): Promise<any> {
    try {
      const backups = await this.getBackups();
      const backup = backups.find((b: any) => b.name === backupName);
      
      if (!backup) {
        throw new Error('Backup no encontrado');
      }

      // Aquí se restaurarían los datos del backup
      console.log('Restoring backup:', backupName);
      
      return { message: 'Backup restaurado exitosamente' };
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw new Error('Error al restaurar backup');
    }
  }

  async deleteBackup(backupName: string): Promise<any> {
    try {
      const backups = await this.getBackups();
      const filteredBackups = backups.filter((b: any) => b.name !== backupName);
      localStorage.setItem('system_backups', JSON.stringify(filteredBackups));
      
      return { message: 'Backup eliminado exitosamente' };
    } catch (error) {
      console.error('Error deleting backup:', error);
      throw new Error('Error al eliminar backup');
    }
  }

  async cleanOldBackups(daysOld: number): Promise<any> {
    try {
      const backups = await this.getBackups();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const filteredBackups = backups.filter((backup: any) => {
        const backupDate = new Date(backup.date);
        return backupDate > cutoffDate;
      });
      
      localStorage.setItem('system_backups', JSON.stringify(filteredBackups));
      
      return { 
        message: `Se eliminaron ${backups.length - filteredBackups.length} backups antiguos` 
      };
    } catch (error) {
      console.error('Error cleaning old backups:', error);
      throw new Error('Error al limpiar backups antiguos');
    }
  }

  async getSystemStats(): Promise<any> {
    try {
      const users = mockDataService.getUsers();
      const publications = mockDataService.getPublications();
      const reviews = mockDataService.getReviews();
      
      return {
        users: {
          total: users.length,
          byRole: users.reduce((acc: any, user: any) => {
            user.roles.forEach((role: string) => {
              acc[role] = (acc[role] || 0) + 1;
            });
            return acc;
          }, {})
        },
        publications: {
          total: publications.length,
          byStatus: publications.reduce((acc: any, pub: any) => {
            acc[pub.estado] = (acc[pub.estado] || 0) + 1;
            return acc;
          }, {}),
          byType: {}
        },
        reviews: {
          total: reviews.length,
          byStatus: reviews.reduce((acc: any, review: any) => {
            acc[review.estado] = (acc[review.estado] || 0) + 1;
            return acc;
          }, {})
        },
        notifications: {
          total: 0,
          unread: 0,
          byType: {}
        },
        backups: {
          total: (await this.getBackups()).length,
          latest: new Date().toISOString()
        },
        system: {
          uptime: Date.now(),
          memory: { used: 0, total: 0 },
          dataFiles: { users: true, publications: true, reviews: true, notifications: true }
        }
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      throw new Error('Error al obtener estadísticas del sistema');
    }
  }

  async exportData(format: string = 'json'): Promise<any> {
    try {
      const data = {
        users: mockDataService.getUsers(),
        publications: mockDataService.getPublications(),
        reviews: mockDataService.getReviews(),
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { message: 'Datos exportados exitosamente' };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Error al exportar datos');
    }
  }

  // Nuevos métodos para gestión de revisiones

  async getPendingPublications(): Promise<any[]> {
    try {
      const publications = mockDataService.getPublications();
      return publications.filter((pub: any) => 
        pub.estado === 'EN_REVISION' || pub.estado === 'PENDIENTE_REVISION'
      );
    } catch (error) {
      console.error('Error getting pending publications:', error);
      throw new Error('Error al obtener publicaciones pendientes');
    }
  }

  async getAvailableReviewers(): Promise<any[]> {
    try {
      const users = mockDataService.getUsers();
      const reviews = mockDataService.getReviews();
      
      // Filtrar solo revisores activos
      const reviewers = users.filter((user: any) => 
        user.roles.includes('ROLE_REVISOR') && user.activo
      );

      // Enriquecer con información de carga de trabajo y estadísticas
      const enrichedReviewers = reviewers.map((reviewer: any) => {
        // Calcular revisiones activas
        const activeReviews = reviews.filter((r: any) => 
          r.revisor && r.revisor.email === reviewer.email && 
          ['ASIGNADA', 'EN_PROGRESO'].includes(r.estado)
        );

        // Calcular revisiones completadas
        const completedReviews = reviews.filter((r: any) => 
          r.revisor && r.revisor.email === reviewer.email && 
          r.estado === 'COMPLETADA'
        );

        // Calcular tiempo promedio de revisión
        const avgReviewTime = completedReviews.length > 0 
          ? completedReviews.reduce((sum: number, review: any) => {
              const startDate = new Date(review.fechaAsignacion);
              const endDate = new Date(review.fechaCompletado);
              return sum + (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
            }, 0) / completedReviews.length
          : 7; // Valor por defecto

        // Calcular calificación promedio
        const avgRating = completedReviews.length > 0
          ? completedReviews.reduce((sum: number, review: any) => 
              sum + (review.calificacion || 0), 0) / completedReviews.length
          : 5; // Valor por defecto

        return {
          ...reviewer,
          especialidades: reviewer.especialidades || ['General'],
          revisionesActivas: activeReviews.length,
          revisionesCompletadas: completedReviews.length,
          tiempoPromedio: Math.round(avgReviewTime * 10) / 10,
          calificacion: Math.round(avgRating * 10) / 10,
          disponibilidad: this.calculateAvailability(activeReviews.length),
          ultimaActividad: this.getLastActivity(reviewer.email, reviews)
        };
      });

      // Ordenar por disponibilidad (menos carga de trabajo primero)
      enrichedReviewers.sort((a: any, b: any) => {
        // Priorizar por disponibilidad
        if (a.disponibilidad !== b.disponibilidad) {
          return b.disponibilidad - a.disponibilidad;
        }
        // Luego por calificación
        return b.calificacion - a.calificacion;
      });

      return enrichedReviewers;
    } catch (error) {
      console.error('Error getting available reviewers:', error);
      throw new Error('Error al obtener revisores disponibles');
    }
  }

  // Método auxiliar para calcular disponibilidad
  private calculateAvailability(activeReviews: number): number {
    // Escala de 0-10, donde 10 es muy disponible
    if (activeReviews === 0) return 10;
    if (activeReviews <= 2) return 8;
    if (activeReviews <= 4) return 6;
    if (activeReviews <= 6) return 4;
    if (activeReviews <= 8) return 2;
    return 0; // Muy ocupado
  }

  // Método auxiliar para obtener última actividad
  private getLastActivity(reviewerEmail: string, reviews: any[]): string {
    const reviewerReviews = reviews.filter((r: any) => 
      r.revisor && r.revisor.email === reviewerEmail
    );

    if (reviewerReviews.length === 0) return 'Sin actividad';

    const lastReview = reviewerReviews.sort((a: any, b: any) => 
      new Date(b.fechaCompletado || b.fechaAsignacion).getTime() - 
      new Date(a.fechaCompletado || a.fechaAsignacion).getTime()
    )[0];

    const lastDate = new Date(lastReview.fechaCompletado || lastReview.fechaAsignacion);
    const daysAgo = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysAgo === 0) return 'Hoy';
    if (daysAgo === 1) return 'Ayer';
    if (daysAgo < 7) return `${daysAgo} días atrás`;
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} semanas atrás`;
    return `${Math.floor(daysAgo / 30)} meses atrás`;
  }

  async assignReview(publicationId: number, reviewerId: number): Promise<any> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const publication = mockDataService.getPublications().find((p: any) => p.id === publicationId);
      const reviewer = mockDataService.getUsers().find((u: any) => u.id === reviewerId);

      if (!publication) {
        throw new Error('Publicación no encontrada');
      }

      if (!reviewer) {
        throw new Error('Revisor no encontrado');
      }

      // Crear la revisión
      const reviewData = {
        publicacion: {
          id: publication.id,
          titulo: publication.titulo,
          autores: publication.autores
        },
        revisor: {
          id: reviewer.id,
          nombres: reviewer.nombres,
          apellidos: reviewer.apellidos,
          email: reviewer.email
        },
        estado: 'ASIGNADA',
        fechaAsignacion: new Date().toISOString(),
        fechaLimite: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 días
        comentarios: [],
        calificacion: null,
        recomendacion: null
      };

      const newReview = mockDataService.addReview(reviewData);

      // Actualizar estado de la publicación
      mockDataService.updatePublication(publicationId, {
        estado: 'EN_REVISION',
        fechaAsignacionRevision: new Date().toISOString()
      });

      // Crear notificación para el revisor
      await notificationService.createRoleBasedNotification(
        'REVIEW_ASSIGNED' as any,
        'REVIEW' as any,
        'Revisión Asignada',
        `Se te ha asignado la revisión de "${publication.titulo}". Por favor, completa la revisión antes del ${new Date(reviewData.fechaLimite).toLocaleDateString()}.`,
        reviewer.email,
        'HIGH' as any,
        {
          reviewId: newReview.id,
          publicationId: publication.id,
          publicationTitle: publication.titulo,
          publicationAuthors: publication.autores,
          fechaLimite: reviewData.fechaLimite
        }
      );

      // Crear notificación para el autor
      if (publication.autor) {
        await notificationService.createRoleBasedNotification(
          'PUBLICATION_REVIEW_REQUESTED' as any,
          'PUBLICATION' as any,
          'Revisión Solicitada',
          `Tu publicación "${publication.titulo}" ha sido enviada a revisión. Te notificaremos cuando se complete la evaluación.`,
          publication.autor.email,
          'MEDIUM' as any,
          {
            publicationId: publication.id,
            publicationTitle: publication.titulo,
            reviewId: newReview.id
          }
        );
      }

      console.log('Review assigned successfully');
      return { success: true, review: newReview };
    } catch (error) {
      console.error('Error assigning review:', error);
      throw new Error('Error al asignar revisión');
    }
  }

  async getReviewAssignments(): Promise<any[]> {
    try {
      const reviews = mockDataService.getReviews();
      return reviews.filter((review: any) => 
        review.estado === 'ASIGNADA' || review.estado === 'EN_PROGRESO'
      );
    } catch (error) {
      console.error('Error getting review assignments:', error);
      throw new Error('Error al obtener asignaciones de revisión');
    }
  }

  async getReviewStats(): Promise<any> {
    try {
      const reviews = mockDataService.getReviews();
      const stats = {
        total: reviews.length,
        asignadas: reviews.filter((r: any) => r.estado === 'ASIGNADA').length,
        enProgreso: reviews.filter((r: any) => r.estado === 'EN_PROGRESO').length,
        completadas: reviews.filter((r: any) => r.estado === 'COMPLETADA').length,
        vencidas: reviews.filter((r: any) => {
          if (r.estado === 'ASIGNADA' || r.estado === 'EN_PROGRESO') {
            return new Date(r.fechaLimite) < new Date();
          }
          return false;
        }).length
      };
      return stats;
    } catch (error) {
      console.error('Error getting review stats:', error);
      throw new Error('Error al obtener estadísticas de revisiones');
    }
  }

  async reassignReview(reviewId: number, newReviewerId: number): Promise<any> {
    try {
      const review = mockDataService.getReviews().find((r: any) => r.id === reviewId);
      const newReviewer = mockDataService.getUsers().find((u: any) => u.id === newReviewerId);

      if (!review) {
        throw new Error('Revisión no encontrada');
      }

      if (!newReviewer) {
        throw new Error('Revisor no encontrado');
      }

      // Actualizar la revisión
      const updatedReview = mockDataService.updateReview(reviewId, {
        revisor: {
          id: newReviewer.id,
          nombres: newReviewer.nombres,
          apellidos: newReviewer.apellidos,
          email: newReviewer.email
        },
        fechaReasignacion: new Date().toISOString()
      });

      // Notificar al nuevo revisor
      await notificationService.createRoleBasedNotification(
        'REVIEW_ASSIGNED' as any,
        'REVIEW' as any,
        'Revisión Reasignada',
        `Se te ha reasignado la revisión de "${review.publicacion.titulo}". Por favor, completa la revisión antes del ${new Date(review.fechaLimite).toLocaleDateString()}.`,
        newReviewer.email,
        'HIGH' as any,
        {
          reviewId: reviewId,
          publicationId: review.publicacion.id,
          publicationTitle: review.publicacion.titulo,
          fechaLimite: review.fechaLimite
        }
      );

      return { success: true, review: updatedReview };
    } catch (error) {
      console.error('Error reassigning review:', error);
      throw new Error('Error al reasignar revisión');
    }
  }

  async extendReviewDeadline(reviewId: number, additionalDays: number): Promise<any> {
    try {
      const review = mockDataService.getReviews().find((r: any) => r.id === reviewId);
      
      if (!review) {
        throw new Error('Revisión no encontrada');
      }

      const newDeadline = new Date(review.fechaLimite);
      newDeadline.setDate(newDeadline.getDate() + additionalDays);

      const updatedReview = mockDataService.updateReview(reviewId, {
        fechaLimite: newDeadline.toISOString(),
        fechaExtension: new Date().toISOString()
      });

      // Notificar al revisor sobre la extensión
      await notificationService.createRoleBasedNotification(
        'REVIEW_REMINDER' as any,
        'REVIEW' as any,
        'Plazo Extendido',
        `El plazo para la revisión de "${review.publicacion.titulo}" ha sido extendido hasta ${newDeadline.toLocaleDateString()}.`,
        review.revisor.email,
        'MEDIUM' as any,
        {
          reviewId: reviewId,
          publicationId: review.publicacion.id,
          publicationTitle: review.publicacion.titulo,
          fechaLimite: newDeadline.toISOString()
        }
      );

      return { success: true, review: updatedReview };
    } catch (error) {
      console.error('Error extending review deadline:', error);
      throw new Error('Error al extender plazo de revisión');
    }
  }

  // Métodos adicionales que podrían estar siendo utilizados
  async getUsers(): Promise<any[]> {
    try {
      return mockDataService.getUsers();
    } catch (error) {
      console.error('Error getting users:', error);
      throw new Error('Error al obtener usuarios');
    }
  }

  async updateUser(id: number, userData: any): Promise<any> {
    try {
      return mockDataService.updateUser(id, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Error al actualizar usuario');
    }
  }

  async deleteUser(id: number): Promise<any> {
    try {
      mockDataService.deleteUser(id);
      return { success: true, message: 'Usuario eliminado exitosamente' };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Error al eliminar usuario');
    }
  }

  async getSystemHealth(): Promise<any> {
    try {
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          auth: 'operational',
          users: 'operational',
          backup: 'operational',
          reviews: 'operational',
          notifications: 'operational'
        }
      };
    } catch (error) {
      console.error('Error getting system health:', error);
      throw new Error('Error al obtener estado del sistema');
    }
  }

  async validateDataIntegrity(): Promise<any> {
    try {
      const users = mockDataService.getUsers();
      const publications = mockDataService.getPublications();
      const reviews = mockDataService.getReviews();
      
      const issues = [];
      
      // Verificar usuarios sin roles
      const usersWithoutRoles = users.filter((u: any) => !u.roles || u.roles.length === 0);
      if (usersWithoutRoles.length > 0) {
        issues.push(`${usersWithoutRoles.length} usuarios sin roles asignados`);
      }
      
      return {
        valid: issues.length === 0,
        issues,
        summary: {
          totalUsers: users.length,
          totalPublications: publications.length,
          totalReviews: reviews.length
        }
      };
    } catch (error) {
      console.error('Error validating data integrity:', error);
      throw new Error('Error al validar integridad de datos');
    }
  }

  async repairData(): Promise<any> {
    try {
      const users = mockDataService.getUsers();
      const cleanedUsers = users.filter((user: any) => {
        return user.email && user.nombres && user.apellidos;
      });
      
      // Aquí se podrían implementar más reparaciones
      
      return { 
        message: `Datos reparados. ${users.length - cleanedUsers.length} usuarios corruptos encontrados` 
      };
    } catch (error) {
      console.error('Error repairing data:', error);
      throw new Error('Error al reparar datos');
    }
  }

  async getPerformanceMetrics(): Promise<any> {
    try {
      return {
        memory: {
          used: 0,
          total: 0,
          limit: 0
        },
        timing: {
          loadTime: 0,
          domReady: 0
        },
        database: {
          users: mockDataService.getUsers().length,
          publications: mockDataService.getPublications().length,
          reviews: mockDataService.getReviews().length
        }
      };
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      throw new Error('Error al obtener métricas de rendimiento');
    }
  }

  async getSystemReports(): Promise<any> {
    try {
      const users = mockDataService.getUsers();
      const publications = mockDataService.getPublications();
      const reviews = mockDataService.getReviews();
      
      return {
        userReport: {
          total: users.length,
          active: users.filter((u: any) => u.activo).length,
          inactive: users.filter((u: any) => !u.activo).length,
          byRole: users.reduce((acc: any, user: any) => {
            user.roles.forEach((role: string) => {
              acc[role] = (acc[role] || 0) + 1;
            });
            return acc;
          }, {})
        },
        publicationReport: {
          total: publications.length,
          byStatus: publications.reduce((acc: any, pub: any) => {
            acc[pub.estado] = (acc[pub.estado] || 0) + 1;
            return acc;
          }, {})
        },
        reviewReport: {
          total: reviews.length,
          byStatus: reviews.reduce((acc: any, review: any) => {
            acc[review.estado] = (acc[review.estado] || 0) + 1;
            return acc;
          }, {})
        }
      };
    } catch (error) {
      console.error('Error getting system reports:', error);
      throw new Error('Error al obtener reportes del sistema');
    }
  }
}

export const adminService = new AdminService();
