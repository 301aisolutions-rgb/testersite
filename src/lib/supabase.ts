import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Listing {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image_url: string;
  status: string;
  featured: boolean;
  description: string | null;
  created_at: string;
  mls_number?: string | null;
  property_type?: string | null;
  year_built?: number | null;
  lot_size?: number | null;
  days_on_market?: number | null;
  listing_date?: string | null;
  parking_spaces?: number | null;
  garage_type?: string | null;
  hoa_fees?: number | null;
  heating_type?: string | null;
  cooling_type?: string | null;
  annual_taxes?: number | null;
  tax_year?: number | null;
  zoning?: string | null;
  floors?: number | null;
  view_description?: string | null;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  phone: string | null;
  email: string;
  image_url: string | null;
  created_at: string;
}
