import { Review, CreateReviewRequest, UpdateReviewRequest } from '../types/review';
import { mockDataService } from './mockDataService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('auth_token');

class ReviewService {
  async getReviews(): Promise<any[]> {
    try {
      console.log('Getting reviews from mock service...');
      const reviews = mockDataService.getReviews();
      console.log('Available reviews:', reviews.length);
      return reviews;
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw new Error('Error al obtener revisiones');
    }
  }

  async getReview(id: number): Promise<any> {
    try {
      const reviews = mockDataService.getReviews();
      const review = reviews.find((r: any) => r.id === id);
      
      if (!review) {
        throw new Error('Revisión no encontrada');
      }
      
      return review;
    } catch (error) {
      console.error('Error getting review:', error);
      throw new Error('Error al obtener revisión');
    }
  }

  async createReview(reviewData: CreateReviewRequest): Promise<any> {
    try {
      // Obtener usuario actual
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      
      // Crear nueva revisión usando el servicio mock
      const newReview = mockDataService.addReview({
        ...reviewData,
        revisor: {
          id: user.id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email
        }
      });
      
      console.log('Review created and saved to mock service');
      return newReview;
    } catch (error) {
      console.error('Error creating review:', error);
      throw new Error('Error al crear revisión');
    }
  }

  async updateReview(id: number, reviewData: UpdateReviewRequest): Promise<any> {
    try {
      const updatedReview = mockDataService.updateReview(id, reviewData);
      
      if (!updatedReview) {
        throw new Error('Revisión no encontrada');
      }
      
      return updatedReview;
    } catch (error) {
      console.error('Error updating review:', error);
      throw new Error('Error al actualizar revisión');
    }
  }

  async deleteReview(id: number): Promise<void> {
    try {
      mockDataService.deleteReview(id);
      console.log('Review deleted from mock service');
    } catch (error) {
      console.error('Error deleting review:', error);
      throw new Error('Error al eliminar revisión');
    }
  }

  async getMyReviews(): Promise<any[]> {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const myReviews = mockDataService.getMyReviews(user.email);
      
      console.log('My reviews:', myReviews.length);
      return myReviews;
    } catch (error) {
      console.error('Error getting my reviews:', error);
      throw new Error('Error al obtener mis revisiones');
    }
  }

  async getReviewsByStatus(status: string): Promise<any[]> {
    try {
      const reviews = mockDataService.getReviews();
      const filteredReviews = reviews.filter((r: any) => 
        r.estado.toLowerCase() === status.toLowerCase()
      );
      
      return filteredReviews;
    } catch (error) {
      console.error('Error getting reviews by status:', error);
      throw new Error('Error al obtener revisiones por estado');
    }
  }

  async getReviewsByPublication(publicationId: number): Promise<any[]> {
    try {
      const reviews = mockDataService.getReviews();
      const filteredReviews = reviews.filter((r: any) => 
        r.publicacion.id === publicationId
      );
      
      return filteredReviews;
    } catch (error) {
      console.error('Error getting reviews by publication:', error);
      throw new Error('Error al obtener revisiones por publicación');
    }
  }

  // Método para obtener estadísticas de revisiones
  async getReviewStats(): Promise<any> {
    try {
      const stats = mockDataService.getReviewStats();
      return stats;
    } catch (error) {
      console.error('Error getting review stats:', error);
      throw new Error('Error al obtener estadísticas de revisiones');
    }
  }

  // Método para simular proceso de revisión
  async simulateReviewProcess(reviewId: number): Promise<void> {
    try {
      mockDataService.simulateReviewProcess(reviewId);
    } catch (error) {
      console.error('Error simulating review process:', error);
      throw new Error('Error al simular proceso de revisión');
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

export const reviewService = new ReviewService();
