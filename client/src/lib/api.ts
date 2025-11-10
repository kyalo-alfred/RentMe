/**
 * API utility functions for RentMe
 */

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
