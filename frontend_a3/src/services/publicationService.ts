import { Publication, CreatePublicationRequest, UpdatePublicationRequest } from '../types/publication';
import { mockDataService } from './mockDataService';
import { adminService } from './adminService';
import { notificationService } from './notificationService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('auth_token');

class PublicationService {
  async getPublications(): Promise<any[]> {
    try {
      console.log('Getting publications from mock service...');
      const publications = mockDataService.getPublications();
      console.log('Available publications:', publications.length);
      return publications;
    } catch (error) {
      console.error('Error getting publications:', error);
      throw new Error('Error al obtener publicaciones');
    }
  }

  async getPublication(id: number): Promise<any> {
    try {
      const publications = mockDataService.getPublications();
      const publication = publications.find((p: any) => p.id === id);
      
      if (!publication) {
        throw new Error('Publicación no encontrada');
      }
      
      return publication;
    } catch (error) {
      console.error('Error getting publication:', error);
      throw new Error('Error al obtener publicación');
    }
  }

  async createPublication(publicationData: CreatePublicationRequest): Promise<any> {
    try {
      // Obtener usuario actual
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      
      // Crear nueva publicación usando el servicio mock
      const newPublication = mockDataService.addPublication({
        ...publicationData,
        autor: {
          id: user.id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email
        },
        estado: 'PENDIENTE_REVISION' // Estado inicial para revisión
      });
      
      console.log('Publication created and saved to mock service');
      
      // Automáticamente asignar la publicación a revisores disponibles
      await this.autoAssignToReviewers(newPublication);
      
      return newPublication;
    } catch (error) {
      console.error('Error creating publication:', error);
      throw new Error('Error al crear publicación');
    }
  }

  // Método para asignar automáticamente a revisores
  async autoAssignToReviewers(publication: any): Promise<void> {
    try {
      // Obtener revisores disponibles
      const availableReviewers = await adminService.getAvailableReviewers();
      
      if (availableReviewers.length === 0) {
        console.log('No hay revisores disponibles para asignar');
        // Crear notificación para el administrador
        await notificationService.createRoleBasedNotification(
          'REVIEWER_SHORTAGE' as any,
          'SYSTEM' as any,
          'Falta de Revisores',
          `No hay revisores disponibles para la publicación "${publication.titulo}". Se requiere asignación manual.`,
          'admin@test.com',
          'HIGH' as any,
          {
            publicationId: publication.id,
            publicationTitle: publication.titulo
          }
        );
        return;
      }

      // Algoritmo inteligente de asignación basado en:
      // 1. Carga de trabajo actual del revisor
      // 2. Especialidad/experiencia en la categoría
      // 3. Historial de calidad de revisiones
      const selectedReviewer = this.selectBestReviewer(availableReviewers, publication);
      
      // Asignar la revisión
      const reviewAssignment = await adminService.assignReview(publication.id, selectedReviewer.id);
      
      // Crear notificación para el revisor asignado
      await notificationService.createRoleBasedNotification(
        'REVIEW_ASSIGNED' as any,
        'REVIEW' as any,
        'Nueva Revisión Asignada',
        `Se te ha asignado la revisión de "${publication.titulo}". Fecha límite: ${this.calculateDeadline()}`,
        selectedReviewer.email,
        'MEDIUM' as any,
        {
          reviewId: reviewAssignment.id,
          publicationId: publication.id,
          publicationTitle: publication.titulo,
          deadline: this.calculateDeadline()
        }
      );

      // Crear notificación para el autor
      if (publication.autor && publication.autor.email) {
        await notificationService.createRoleBasedNotification(
          'PUBLICATION_SUBMITTED' as any,
          'PUBLICATION' as any,
          'Publicación Enviada para Revisión',
          `Tu publicación "${publication.titulo}" ha sido enviada para revisión. Recibirás notificaciones sobre el progreso.`,
          publication.autor.email,
          'LOW' as any,
          {
            publicationId: publication.id,
            publicationTitle: publication.titulo
          }
        );
      }
      
      console.log(`Publicación ${publication.titulo} asignada automáticamente a ${selectedReviewer.nombres} ${selectedReviewer.apellidos}`);
    } catch (error) {
      console.error('Error auto-assigning to reviewers:', error);
      // No lanzar error para no interrumpir la creación de la publicación
    }
  }

  // Método para seleccionar el mejor revisor disponible
  private selectBestReviewer(reviewers: any[], publication: any): any {
    // Calcular puntuación para cada revisor
    const reviewersWithScore = reviewers.map(reviewer => {
      let score = 0;
      
      // Factor 1: Carga de trabajo (menos carga = mayor puntuación)
      const currentWorkload = this.calculateReviewerWorkload(reviewer);
      score += Math.max(0, 10 - currentWorkload);
      
      // Factor 2: Experiencia en la categoría
      if (publication.categoria && reviewer.especialidades) {
        const categoryMatch = reviewer.especialidades.some((esp: string) => 
          esp.toLowerCase().includes(publication.categoria.toLowerCase())
        );
        score += categoryMatch ? 5 : 0;
      }
      
      // Factor 3: Calificación promedio del revisor
      score += (reviewer.calificacion || 5) * 2;
      
      // Factor 4: Tiempo promedio de revisión (menor tiempo = mayor puntuación)
      const avgTime = reviewer.tiempoPromedio || 7;
      score += Math.max(0, 10 - avgTime);
      
      return { ...reviewer, score };
    });
    
    // Ordenar por puntuación y seleccionar el mejor
    reviewersWithScore.sort((a, b) => b.score - a.score);
    return reviewersWithScore[0];
  }

  // Método para calcular la carga de trabajo de un revisor
  private calculateReviewerWorkload(reviewer: any): number {
    // En un sistema real, esto consultaría la base de datos
    // Por ahora, simulamos basándonos en revisiones activas
    const activeReviews = mockDataService.getReviews().filter((r: any) => 
      r.revisor && r.revisor.email === reviewer.email && 
      ['ASIGNADA', 'EN_PROGRESO'].includes(r.estado)
    );
    
    return activeReviews.length;
  }

  // Método para calcular fecha límite de revisión
  private calculateDeadline(): string {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 14); // 14 días por defecto
    return deadline.toISOString();
  }

  async updatePublication(id: number, publicationData: UpdatePublicationRequest): Promise<any> {
    try {
      const updatedPublication = mockDataService.updatePublication(id, publicationData);
      
      if (!updatedPublication) {
        throw new Error('Publicación no encontrada');
      }
      
      return updatedPublication;
    } catch (error) {
      console.error('Error updating publication:', error);
      throw new Error('Error al actualizar publicación');
    }
  }

  async deletePublication(id: number): Promise<void> {
    try {
      mockDataService.deletePublication(id);
      console.log('Publication deleted from mock service');
    } catch (error) {
      console.error('Error deleting publication:', error);
      throw new Error('Error al eliminar publicación');
    }
  }

  async getMyPublications(): Promise<any[]> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const myPublications = mockDataService.getMyPublications(user.email);
      
      console.log('My publications:', myPublications.length);
      return myPublications;
    } catch (error) {
      console.error('Error getting my publications:', error);
      throw new Error('Error al obtener mis publicaciones');
    }
  }

  async searchPublications(query: string): Promise<any[]> {
    try {
      const filteredPublications = mockDataService.searchPublications(query);
      return filteredPublications;
    } catch (error) {
      console.error('Error searching publications:', error);
      throw new Error('Error al buscar publicaciones');
    }
  }

  async getPublicationsByCategory(category: string): Promise<any[]> {
    try {
      const filteredPublications = mockDataService.getPublicationsByCategory(category);
      return filteredPublications;
    } catch (error) {
      console.error('Error getting publications by category:', error);
      throw new Error('Error al obtener publicaciones por categoría');
    }
  }

  async getPublicationsByStatus(status: string): Promise<any[]> {
    try {
      const filteredPublications = mockDataService.getPublicationsByStatus(status);
      return filteredPublications;
    } catch (error) {
      console.error('Error getting publications by status:', error);
      throw new Error('Error al obtener publicaciones por estado');
    }
  }

  // Método para obtener estadísticas de publicaciones
  async getPublicationStats(): Promise<any> {
    try {
      const stats = mockDataService.getPublicationStats();
      return stats;
    } catch (error) {
      console.error('Error getting publication stats:', error);
      throw new Error('Error al obtener estadísticas de publicaciones');
    }
  }

  // Método para simular flujo de trabajo de publicación
  async simulatePublicationWorkflow(publicationId: number): Promise<void> {
    try {
      mockDataService.simulatePublicationWorkflow(publicationId);
    } catch (error) {
      console.error('Error simulating publication workflow:', error);
      throw new Error('Error al simular flujo de trabajo');
    }
  }

  // Método para obtener categorías
  async getCategories(): Promise<any[]> {
    try {
      return mockDataService.getCategories();
    } catch (error) {
      console.error('Error getting categories:', error);
      throw new Error('Error al obtener categorías');
    }
  }

  // Método para obtener tags
  async getTags(): Promise<string[]> {
    try {
      return mockDataService.getTags();
    } catch (error) {
      console.error('Error getting tags:', error);
      throw new Error('Error al obtener tags');
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
}

export const publicationService = new PublicationService();
