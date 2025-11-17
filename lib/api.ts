// API utility for making fetch requests

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  }

  // Generic HTTP methods
  async get<T = any>(endpoint: string, config?: { params?: Record<string, any> }): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (config?.params) {
      const queryParams = new URLSearchParams();
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  async signUp(data: any) {
    return this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: any) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyOTP(data: any) {
    return this.request('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resendOTP(phone: string) {
    return this.request('/api/auth/verify-otp', {
      method: 'PUT',
      body: JSON.stringify({ phone }),
    });
  }

  // Routes endpoints
  async getRoutes() {
    return this.request('/api/routes');
  }

  async createRoute(data: any) {
    return this.request('/api/routes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Trips endpoints
  async getTrips<T = any>(params?: { date?: string; routeId?: string; status?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.date) queryParams.append('date', params.date);
    if (params?.routeId) queryParams.append('routeId', params.routeId);
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    return this.request<T>(`/api/trips${query ? `?${query}` : ''}`);
  }

  async createTrip(data: any) {
    return this.request('/api/trips', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTripStatus(data: any) {
    return this.request('/api/trips', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Bookings endpoints
  async getBookings(params?: { userId?: string; tripId?: string; status?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.tripId) queryParams.append('tripId', params.tripId);
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    return this.request(`/api/bookings${query ? `?${query}` : ''}`);
  }

  async createBooking(data: any) {
    return this.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelBooking(bookingId: string, reason: string) {
    return this.request('/api/bookings', {
      method: 'PATCH',
      body: JSON.stringify({ bookingId, cancellationReason: reason }),
    });
  }

  // Admin endpoints
  async getDashboardMetrics<T = any>() {
    return this.request<T>('/api/admin/dashboard');
  }

  async getRevenueAnalytics<T = any>(range: 'day' | 'week' | 'month' | 'year' = 'week') {
    return this.request<T>(`/api/admin/revenue?range=${range}`);
  }
}

export const api = new ApiClient();

// Custom hooks for data fetching
import { useState, useEffect } from 'react';

export function useApi<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const response = await fetcher();

      if (response.success) {
        setData(response.data || null);
      } else {
        setError(response.message || 'Failed to fetch data');
      }

      setLoading(false);
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    const response = await fetcher();

    if (response.success) {
      setData(response.data || null);
    } else {
      setError(response.message || 'Failed to fetch data');
    }

    setLoading(false);
  };

  return { data, loading, error, refetch };
}