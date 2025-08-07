import { Publication, PublicationFormData, PublicationListResponse, PublicationSearchParams } from '../types/publication';
import { tokenUtils } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class PublicationService {
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = tokenUtils.getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Publication API request failed:', error);
      throw error;
    }
  }

  async getPublications(params: PublicationSearchParams = {}): Promise<PublicationListResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/api/publications${queryString ? `?${queryString}` : ''}`;
    
    return await this.makeRequest(endpoint);
  }

  async getPublication(id: string): Promise<Publication> {
    return await this.makeRequest(`/api/publications/${id}`);
  }

  async createPublication(publicationData: PublicationFormData): Promise<Publication> {
    return await this.makeRequest('/api/publications', {
      method: 'POST',
      body: JSON.stringify(publicationData),
    });
  }

  async updatePublication(id: string, publicationData: Partial<PublicationFormData>): Promise<Publication> {
    return await this.makeRequest(`/api/publications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(publicationData),
    });
  }

  async deletePublication(id: string): Promise<void> {
    await this.makeRequest(`/api/publications/${id}`, {
      method: 'DELETE',
    });
  }

  async submitForReview(id: string): Promise<Publication> {
    return await this.makeRequest(`/api/publications/${id}/submit`, {
      method: 'POST',
    });
  }

  async getMyPublications(params: PublicationSearchParams = {}): Promise<PublicationListResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/api/publications/my${queryString ? `?${queryString}` : ''}`;
    
    return await this.makeRequest(endpoint);
  }

  async uploadFile(publicationId: string, file: File): Promise<{ fileUrl: string }> {
    const token = tokenUtils.getToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/publications/${publicationId}/files`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async deleteFile(publicationId: string, fileId: string): Promise<void> {
    await this.makeRequest(`/api/publications/${publicationId}/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  async getPublicationFiles(publicationId: string): Promise<any[]> {
    return await this.makeRequest(`/api/publications/${publicationId}/files`);
  }
}

export const publicationService = new PublicationService();
