import { Review, ReviewFormData, ReviewListResponse, ReviewSearchParams, ReviewAssignment } from '../types/review';
import { tokenUtils } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ReviewService {
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
      console.error('Review API request failed:', error);
      throw error;
    }
  }

  async getReviews(params: ReviewSearchParams = {}): Promise<ReviewListResponse> {
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
    const endpoint = `/api/reviews${queryString ? `?${queryString}` : ''}`;
    
    return await this.makeRequest(endpoint);
  }

  async getMyReviews(params: ReviewSearchParams = {}): Promise<ReviewListResponse> {
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
    const endpoint = `/api/reviews/my${queryString ? `?${queryString}` : ''}`;
    
    return await this.makeRequest(endpoint);
  }

  async getReview(id: string): Promise<Review> {
    return await this.makeRequest(`/api/reviews/${id}`);
  }

  async createReview(reviewData: ReviewFormData, publicationId: string): Promise<Review> {
    return await this.makeRequest(`/api/reviews`, {
      method: 'POST',
      body: JSON.stringify({ ...reviewData, publicacionId }),
    });
  }

  async updateReview(id: string, reviewData: Partial<ReviewFormData>): Promise<Review> {
    return await this.makeRequest(`/api/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async submitReview(id: string, reviewData: ReviewFormData): Promise<Review> {
    return await this.makeRequest(`/api/reviews/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async startReview(id: string): Promise<Review> {
    return await this.makeRequest(`/api/reviews/${id}/start`, {
      method: 'POST',
    });
  }

  async assignReview(assignment: ReviewAssignment): Promise<Review> {
    return await this.makeRequest(`/api/reviews/assign`, {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
  }

  async getReviewsByPublication(publicationId: string): Promise<Review[]> {
    return await this.makeRequest(`/api/reviews/publication/${publicationId}`);
  }

  async deleteReview(id: string): Promise<void> {
    await this.makeRequest(`/api/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  async getReviewStatistics(): Promise<any> {
    return await this.makeRequest('/api/reviews/statistics');
  }

  async getMyReviewStatistics(): Promise<any> {
    return await this.makeRequest('/api/reviews/my/statistics');
  }
}

export const reviewService = new ReviewService();
