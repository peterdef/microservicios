import { Publication, PublicationType, Chapter } from '../types/publication';

const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('auth_token');

export const publicationService = {
  // Obtener todas las publicaciones con filtros
  async getPublications(params: {
    page?: number;
    size?: number;
    estado?: string;
    tipo?: string;
    titulo?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.estado) searchParams.append('estado', params.estado);
    if (params.tipo) searchParams.append('tipo', params.tipo);
    if (params.titulo) searchParams.append('titulo', params.titulo);

    const response = await fetch(`${API_BASE_URL}/publicaciones?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Servidor no disponible. Verifique que el servidor mock esté corriendo en el puerto 8080.');
      }
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener publicaciones');
      } catch (parseError) {
        throw new Error(`Error al obtener publicaciones: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  },

  // Obtener mis publicaciones
  async getMyPublications() {
    const response = await fetch(`${API_BASE_URL}/publicaciones/mis-publicaciones`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener mis publicaciones');
    }

    return response.json();
  },

  // Crear nueva publicación
  async createPublication(publication: Partial<Publication>) {
    const response = await fetch(`${API_BASE_URL}/publicaciones`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(publication),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear publicación');
    }

    return response.json();
  },

  // Actualizar publicación
  async updatePublication(id: number, publication: Partial<Publication>) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(publication),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar publicación');
    }

    return response.json();
  },

  // Eliminar publicación
  async deletePublication(id: number) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar publicación');
    }

    return response.json();
  },

  // Obtener publicación por ID
  async getPublicationById(id: number) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener publicación');
    }

    return response.json();
  },

  // Subir archivo de publicación
  async uploadPublicationFile(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir archivo');
    }

    return response.json();
  },

  // Cambiar estado de publicación
  async changePublicationStatus(id: number, status: string) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al cambiar estado');
    }

    return response.json();
  },

  // Obtener estadísticas de publicaciones
  async getPublicationStats() {
    const response = await fetch(`${API_BASE_URL}/publicaciones/stats`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas');
    }

    return response.json();
  },

  // Buscar publicaciones
  async searchPublications(query: string) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al buscar publicaciones');
    }

    return response.json();
  },

  // Obtener publicaciones por categoría
  async getPublicationsByCategory(category: string) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/category/${category}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener publicaciones por categoría');
    }

    return response.json();
  },

  // Obtener publicaciones populares
  async getPopularPublications() {
    const response = await fetch(`${API_BASE_URL}/publicaciones/popular`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener publicaciones populares');
    }

    return response.json();
  },

  // Obtener publicaciones recientes
  async getRecentPublications() {
    const response = await fetch(`${API_BASE_URL}/publicaciones/recent`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener publicaciones recientes');
    }

    return response.json();
  },

  // Marcar publicación como favorita
  async toggleFavorite(id: number) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}/favorite`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al marcar como favorita');
    }

    return response.json();
  },

  // Obtener publicaciones favoritas
  async getFavoritePublications() {
    const response = await fetch(`${API_BASE_URL}/publicaciones/favorites`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener publicaciones favoritas');
    }

    return response.json();
  },

  // Compartir publicación
  async sharePublication(id: number, shareData: { email?: string; message?: string }) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}/share`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shareData),
    });

    if (!response.ok) {
      throw new Error('Error al compartir publicación');
    }

    return response.json();
  },

  // Descargar publicación
  async downloadPublication(id: number) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}/download`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al descargar publicación');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `publication-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Obtener metadatos de publicación
  async getPublicationMetadata(id: number) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}/metadata`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener metadatos');
    }

    return response.json();
  },

  // Actualizar metadatos de publicación
  async updatePublicationMetadata(id: number, metadata: any) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}/metadata`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });
      
      if (!response.ok) {
      throw new Error('Error al actualizar metadatos');
    }

    return response.json();
  },

  // Obtener versiones de publicación
  async getPublicationVersions(id: number) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}/versions`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener versiones');
    }

    return response.json();
  },

  // Crear nueva versión de publicación
  async createPublicationVersion(id: number, versionData: any) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}/versions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(versionData),
    });

    if (!response.ok) {
      throw new Error('Error al crear nueva versión');
    }

    return response.json();
  },

  // Obtener comentarios de publicación
  async getPublicationComments(id: number) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}/comments`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener comentarios');
    }

    return response.json();
  },

  // Agregar comentario a publicación
  async addPublicationComment(id: number, comment: { content: string; parentId?: number }) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}/comments`, {
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

  // Eliminar comentario
  async deletePublicationComment(publicationId: number, commentId: number) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${publicationId}/comments/${commentId}`, {
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

  // Obtener citas de publicación
  async getPublicationCitations(id: number) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}/citations`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener citas');
    }

    return response.json();
  },

  // Agregar cita a publicación
  async addPublicationCitation(id: number, citation: { doi: string; title: string; authors: string[] }) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}/citations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(citation),
    });

    if (!response.ok) {
      throw new Error('Error al agregar cita');
    }

    return response.json();
  },

  // Obtener publicaciones relacionadas
  async getRelatedPublications(id: number) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/${id}/related`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener publicaciones relacionadas');
    }

    return response.json();
  },

  // Exportar publicaciones
  async exportPublications(format: 'pdf' | 'csv' | 'json', filters?: any) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/export`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ format, filters }),
    });

    if (!response.ok) {
      throw new Error('Error al exportar publicaciones');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `publications.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Importar publicaciones
  async importPublications(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/publicaciones/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al importar publicaciones');
    }

    return response.json();
  },

  // Validar publicación
  async validatePublication(publication: Partial<Publication>) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(publication),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error de validación');
    }

    return response.json();
  },

  // Obtener plantillas de publicación
  async getPublicationTemplates() {
    const response = await fetch(`${API_BASE_URL}/publicaciones/templates`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener plantillas');
    }

    return response.json();
  },

  // Crear publicación desde plantilla
  async createFromTemplate(templateId: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/publicaciones/template/${templateId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al crear desde plantilla');
    }

    return response.json();
  }
};
