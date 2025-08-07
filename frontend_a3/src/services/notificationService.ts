import { Notification, NotificationListResponse, NotificationSearchParams, NotificationPreferences } from '../types/notification';
import { tokenUtils } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class NotificationService {
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
      console.error('Notification API request failed:', error);
      throw error;
    }
  }

  async getNotifications(params: NotificationSearchParams = {}): Promise<NotificationListResponse> {
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
    const endpoint = `/api/notifications${queryString ? `?${queryString}` : ''}`;
    
    return await this.makeRequest(endpoint);
  }

  async getMyNotifications(params: NotificationSearchParams = {}): Promise<NotificationListResponse> {
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
    const endpoint = `/api/notifications/my${queryString ? `?${queryString}` : ''}`;
    
    return await this.makeRequest(endpoint);
  }

  async getNotification(id: string): Promise<Notification> {
    return await this.makeRequest(`/api/notifications/${id}`);
  }

  async markAsRead(id: string): Promise<Notification> {
    return await this.makeRequest(`/api/notifications/${id}/read`, {
      method: 'POST',
    });
  }

  async markAllAsRead(): Promise<void> {
    await this.makeRequest('/api/notifications/read-all', {
      method: 'POST',
    });
  }

  async deleteNotification(id: string): Promise<void> {
    await this.makeRequest(`/api/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  async getUnreadCount(): Promise<number> {
    const response = await this.makeRequest('/api/notifications/unread-count');
    return response.count;
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    return await this.makeRequest('/api/notifications/preferences');
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    return await this.makeRequest('/api/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  async subscribeToWebPush(subscription: PushSubscription): Promise<void> {
    await this.makeRequest('/api/notifications/webpush/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
    });
  }

  async unsubscribeFromWebPush(): Promise<void> {
    await this.makeRequest('/api/notifications/webpush/unsubscribe', {
      method: 'POST',
    });
  }

  // WebSocket connection for real-time notifications
  connectWebSocket(): WebSocket | null {
    const token = tokenUtils.getToken();
    if (!token) return null;

    const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/ws/notifications?token=${token}`;
    return new WebSocket(wsUrl);
  }
}

export const notificationService = new NotificationService();
