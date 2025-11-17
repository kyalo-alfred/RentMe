/**
 * API utility functions for RentMe
 */

import { Listing, ListingsResponse } from '@/types/listing';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Get access token from localStorage
 */
const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

/**
 * Get authorization headers
 */
const getAuthHeaders = (): HeadersInit => {
  const token = getAccessToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Logistics API functions
 */
export const logisticsAPI = {
  /**
   * Get all available couriers
   */
  getCouriers: async () => {
    const response = await fetch(`${API_BASE_URL}/logistics/couriers/available/`, {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch couriers');
    }

    return response.json();
  },

  /**
   * Create a courier assignment for a booking
   */
  assignCourier: async (bookingId: string, courierId: number, pickupAddress?: string, deliveryAddress?: string) => {
    const response = await fetch(`${API_BASE_URL}/logistics/assignments/`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        booking_id: bookingId,
        courier_id: courierId,
        pickup_address: pickupAddress || '',
        delivery_address: deliveryAddress || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to assign courier' }));
      throw new Error(error.detail || 'Failed to assign courier');
    }

    return response.json();
  },

  /**
   * Get courier assignment by booking ID
   */
  getAssignmentByBooking: async (bookingId: string) => {
    const response = await fetch(`${API_BASE_URL}/logistics/assignments/by_booking/?booking_id=${bookingId}`, {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch courier assignment');
    }

    return response.json();
  },
};

/**
 * Listings API functions
 */
export const listingsAPI = {
  /**
   * Get all listings with optional filters
   */
  getListings: async (params?: {
    category?: string;
    price_period?: string;
    is_active?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
  }): Promise<ListingsResponse> => {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.category) queryParams.append('category', params.category);
      if (params.price_period) queryParams.append('price_period', params.price_period);
      if (params.is_active !== undefined) queryParams.append('is_active', String(params.is_active));
      if (params.search) queryParams.append('search', params.search);
      if (params.ordering) queryParams.append('ordering', params.ordering);
      if (params.page) queryParams.append('page', String(params.page));
    }

    const url = `${API_BASE_URL}/listings/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }

    return response.json();
  },

  /**
   * Get a single listing by ID
   */
  getListing: async (id: number): Promise<Listing> => {
    const response = await fetch(`${API_BASE_URL}/listings/${id}/`, {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listing');
    }

    return response.json();
  },

  /**
   * Get current user's listings
   */
  getMyListings: async (): Promise<Listing[]> => {
    const response = await fetch(`${API_BASE_URL}/listings/mine/`, {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user listings');
    }

    return response.json();
  },

  /**
   * Create a new listing
   */
  createListing: async (data: FormData): Promise<Listing> => {
    const token = getAccessToken();
    const headers: HeadersInit = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/listings/`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: data,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to create listing' }));
      throw new Error(error.detail || 'Failed to create listing');
    }

    return response.json();
  },

  /**
   * Update a listing
   */
  updateListing: async (id: number, data: FormData): Promise<Listing> => {
    const token = getAccessToken();
    const headers: HeadersInit = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/listings/${id}/`, {
      method: 'PATCH',
      credentials: 'include',
      headers,
      body: data,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to update listing' }));
      throw new Error(error.detail || 'Failed to update listing');
    }

    return response.json();
  },

  /**
   * Delete a listing
   */
  deleteListing: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/listings/${id}/`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete listing');
    }
  },
};
