/**
 * Types for Listing data
 */

export interface Owner {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Listing {
  id: number;
  owner: Owner;
  title: string;
  description: string;
  category: string;
  condition: string;
  location: string;
  price: number;
  price_period: string;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListingsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Listing[];
}