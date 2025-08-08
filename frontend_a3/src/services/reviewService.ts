import { Review } from '../types/review';

const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('auth_token');

export const reviewService = {
  // Obtener mis revisiones
  async getMyReviews(params: {
    page?: number;
    size?: number;
    estado?: string;
    prioridad?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.estado) searchParams.append('estado', params.estado);
    if (params.prioridad) searchParams.append('prioridad', params.prioridad);

    const response = await fetch(`${API_BASE_URL}/reviews/mis-reviews?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Servidor no disponible. Verifique que el servidor mock esté corriendo en el puerto 8080.');
      }
      
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener mis revisiones');
      } catch (parseError) {
        throw new Error(`Error al obtener mis revisiones: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  },

  // Crear nueva revisión
  async createReview(review: Partial<Review>) {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });
      
      if (!response.ok) {
      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Servidor no disponible. Verifique que el servidor mock esté corriendo en el puerto 8080.');
      }
      
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear revisión');
      } catch (parseError) {
        throw new Error(`Error al crear revisión: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  },

  // Actualizar revisión
  async updateReview(id: number, review: Partial<Review>) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar revisión');
    }

    return response.json();
  },

  // Eliminar revisión
  async deleteReview(id: number) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar revisión');
    }

    return response.json();
  },

  // Obtener revisión por ID
  async getReviewById(id: number) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener revisión');
    }

    return response.json();
  },

  // Obtener revisiones por publicación
  async getReviewsByPublication(publicationId: number) {
    const response = await fetch(`${API_BASE_URL}/reviews/publication/${publicationId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener revisiones de la publicación');
    }

    return response.json();
  },

  // Obtener revisiones por estado
  async getReviewsByStatus(status: string) {
    const response = await fetch(`${API_BASE_URL}/reviews/status/${status}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener revisiones por estado');
    }

    return response.json();
  },

  // Obtener revisiones por prioridad
  async getReviewsByPriority(priority: string) {
    const response = await fetch(`${API_BASE_URL}/reviews/priority/${priority}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener revisiones por prioridad');
    }

    return response.json();
  },

  // Cambiar estado de revisión
  async changeReviewStatus(id: number, status: string) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al cambiar estado de revisión');
    }

    return response.json();
  },

  // Cambiar prioridad de revisión
  async changeReviewPriority(id: number, priority: string) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/priority`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priority }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al cambiar prioridad de revisión');
    }

    return response.json();
  },

  // Agregar comentario a revisión
  async addReviewComment(id: number, comment: { content: string; type: string }) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });

    if (!response.ok) {
      throw new Error('Error al agregar comentario');
    }

    return response.json();
  },

  // Obtener comentarios de revisión
  async getReviewComments(id: number) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/comments`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener comentarios de revisión');
    }

    return response.json();
  },

  // Eliminar comentario de revisión
  async deleteReviewComment(reviewId: number, commentId: number) {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar comentario');
    }

    return response.json();
  },

  // Subir archivo de revisión
  async uploadReviewFile(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/reviews/${id}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir archivo de revisión');
    }

    return response.json();
  },

  // Descargar archivo de revisión
  async downloadReviewFile(id: number, filename: string) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/download/${filename}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al descargar archivo de revisión');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Obtener estadísticas de revisiones
  async getReviewStats() {
    const response = await fetch(`${API_BASE_URL}/reviews/stats`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas de revisiones');
    }

    return response.json();
  },

  // Obtener revisiones pendientes
  async getPendingReviews() {
    const response = await fetch(`${API_BASE_URL}/reviews/pending`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener revisiones pendientes');
    }

    return response.json();
  },

  // Obtener revisiones completadas
  async getCompletedReviews() {
    const response = await fetch(`${API_BASE_URL}/reviews/completed`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener revisiones completadas');
    }

    return response.json();
  },

  // Obtener revisiones en proceso
  async getInProgressReviews() {
    const response = await fetch(`${API_BASE_URL}/reviews/in-progress`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener revisiones en proceso');
    }

    return response.json();
  },

  // Obtener revisiones por fecha
  async getReviewsByDate(startDate: string, endDate: string) {
    const response = await fetch(`${API_BASE_URL}/reviews/date-range`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startDate, endDate }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener revisiones por fecha');
    }

    return response.json();
  },

  // Obtener revisiones por revisor
  async getReviewsByReviewer(reviewerId: number) {
    const response = await fetch(`${API_BASE_URL}/reviews/reviewer/${reviewerId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener revisiones por revisor');
    }

    return response.json();
  },

  // Obtener revisión por publicación y revisor
  async getReviewByPublicationAndReviewer(publicationId: number, reviewerId: number) {
    const response = await fetch(`${API_BASE_URL}/reviews/publication/${publicationId}/reviewer/${reviewerId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener revisión');
    }

    return response.json();
  },

  // Asignar revisión
  async assignReview(publicationId: number, reviewerId: number, priority: string = 'MEDIA') {
    const response = await fetch(`${API_BASE_URL}/reviews/assign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicationId, reviewerId, priority }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al asignar revisión');
    }

    return response.json();
  },

  // Reasignar revisión
  async reassignReview(reviewId: number, newReviewerId: number) {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/reassign`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newReviewerId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al reasignar revisión');
    }

    return response.json();
  },

  // Aceptar revisión
  async acceptReview(id: number) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/accept`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al aceptar revisión');
    }

    return response.json();
  },

  // Rechazar revisión
  async rejectReview(id: number, reason: string) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al rechazar revisión');
    }

    return response.json();
  },

  // Solicitar cambios en revisión
  async requestChanges(id: number, changes: string[]) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/request-changes`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ changes }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al solicitar cambios');
    }

    return response.json();
  },

  // Obtener historial de revisión
  async getReviewHistory(id: number) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/history`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener historial de revisión');
    }

    return response.json();
  },

  // Obtener plantillas de revisión
  async getReviewTemplates() {
    const response = await fetch(`${API_BASE_URL}/reviews/templates`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener plantillas de revisión');
    }

    return response.json();
  },

  // Crear revisión desde plantilla
  async createReviewFromTemplate(templateId: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/reviews/template/${templateId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al crear revisión desde plantilla');
    }

    return response.json();
  },

  // Exportar revisiones
  async exportReviews(format: 'pdf' | 'csv' | 'json', filters?: any) {
    const response = await fetch(`${API_BASE_URL}/reviews/export`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ format, filters }),
    });

    if (!response.ok) {
      throw new Error('Error al exportar revisiones');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviews.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Obtener revisores disponibles
  async getAvailableReviewers() {
    const response = await fetch(`${API_BASE_URL}/reviews/available-reviewers`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener revisores disponibles');
    }

    return response.json();
  },

  // Obtener carga de trabajo de revisor
  async getReviewerWorkload(reviewerId: number) {
    const response = await fetch(`${API_BASE_URL}/reviews/reviewer/${reviewerId}/workload`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener carga de trabajo');
    }

    return response.json();
  },

  // Obtener métricas de revisión
  async getReviewMetrics(reviewerId?: number) {
    const url = reviewerId 
      ? `${API_BASE_URL}/reviews/metrics/reviewer/${reviewerId}`
      : `${API_BASE_URL}/reviews/metrics`;
      
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener métricas de revisión');
    }

    return response.json();
  },

  // Obtener revisiones urgentes
  async getUrgentReviews() {
    const response = await fetch(`${API_BASE_URL}/reviews/urgent`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener revisiones urgentes');
    }

    return response.json();
  },

  // Marcar revisión como urgente
  async markReviewAsUrgent(id: number) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/urgent`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al marcar revisión como urgente');
    }

    return response.json();
  },

  // Obtener revisiones vencidas
  async getOverdueReviews() {
    const response = await fetch(`${API_BASE_URL}/reviews/overdue`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener revisiones vencidas');
    }

    return response.json();
  },

  // Extender plazo de revisión
  async extendReviewDeadline(id: number, newDeadline: string) {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/extend-deadline`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newDeadline }),
    });

    if (!response.ok) {
      throw new Error('Error al extender plazo de revisión');
    }

    return response.json();
  }
};
