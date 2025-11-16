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
const getAuthHeaders = (includeContentType: boolean = true): HeadersInit => {
  const token = getAccessToken();
  const headers: HeadersInit = {};

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

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
   * Get all listings
   */
  getListings: async (params?: {
    category?: string;
    available_from?: string;
    available_to?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.available_from) queryParams.append('available_from', params.available_from);
    if (params?.available_to) queryParams.append('available_to', params.available_to);
    if (params?.search) queryParams.append('search', params.search);

    const url = `${API_BASE_URL}/listings/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }

    return response.json();
  },

  /**
   * Get a single listing
   */
  getListing: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/listings/${id}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listing');
    }

    return response.json();
  },

  /**
   * Create a new listing
   */
  createListing: async (formData: FormData) => {
    const token = getAccessToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData, browser will set it with boundary

    const response = await fetch(`${API_BASE_URL}/listings/`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to create listing' }));
      throw new Error(JSON.stringify(error));
    }

    return response.json();
  },

  /**
   * Check availability for dates
   */
  checkAvailability: async (listingId: number, startDate: string, endDate: string) => {
    const response = await fetch(`${API_BASE_URL}/listings/${listingId}/check_availability/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ start_date: startDate, end_date: endDate }),
    });

    if (!response.ok) {
      throw new Error('Failed to check availability');
    }

    return response.json();
  },

  /**
   * Get user's listings
   */
  getMyListings: async () => {
    const response = await fetch(`${API_BASE_URL}/listings/my_listings/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch your listings');
    }

    return response.json();
  },
};

/**
 * Bookings API functions
 */
export const bookingsAPI = {
  /**
   * Create a booking
   */
  createBooking: async (listingId: number, startDate: string, endDate: string, notes?: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings/bookings/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        listing: listingId,
        start_date: startDate,
        end_date: endDate,
        notes: notes || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to create booking' }));
      throw new Error(JSON.stringify(error));
    }

    return response.json();
  },

  /**
   * Get user's bookings
   */
  getMyBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/bookings/my_bookings/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    return response.json();
  },

  /**
   * Cancel a booking
   */
  cancelBooking: async (bookingId: number) => {
    const response = await fetch(`${API_BASE_URL}/bookings/bookings/${bookingId}/cancel/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel booking');
    }

    return response.json();
  },
};

/**
 * Reviews API functions
 */
export const reviewsAPI = {
  /**
   * Get reviews for a listing
   */
  getListingReviews: async (listingId: number) => {
    const response = await fetch(`${API_BASE_URL}/reviews/reviews/?listing_id=${listingId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    return response.json();
  },

  /**
   * Get reviews for a user
   */
  getUserReviews: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/reviews/reviews/?reviewee_id=${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    return response.json();
  },

  /**
   * Create a review
   */
  createReview: async (data: {
    listing?: number;
    booking: number;
    reviewee?: number;
    review_type: 'item' | 'owner' | 'renter';
    rating: number;
    title?: string;
    comment: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/reviews/reviews/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to create review' }));
      throw new Error(JSON.stringify(error));
    }

    return response.json();
  },
};

/**
 * Payments API functions
 */
export const paymentsAPI = {
  /**
   * Create a payment
   */
  createPayment: async (bookingId: number, amount: string, currency: string = 'KES', paymentMethod: string = 'CARD', notes?: string) => {
    const response = await fetch(`${API_BASE_URL}/payments/payments/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        booking: bookingId,
        amount,
        currency,
        payment_method: paymentMethod,
        notes: notes || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to create payment' }));
      throw new Error(JSON.stringify(error));
    }

    return response.json();
  },

  /**
   * Process a payment
   */
  processPayment: async (paymentId: number, transactionId: string) => {
    const response = await fetch(`${API_BASE_URL}/payments/payments/${paymentId}/process/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        transaction_id: transactionId,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to process payment' }));
      throw new Error(JSON.stringify(error));
    }

    return response.json();
  },

  /**
   * Get user's payments
   */
  getMyPayments: async () => {
    const response = await fetch(`${API_BASE_URL}/payments/payments/my_payments/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }

    return response.json();
  },
};

