/*
  # Create Real Estate Listings System

  1. New Tables
    - `listings`
      - `id` (uuid, primary key)
      - `title` (text) - Property title
      - `address` (text) - Street address
      - `city` (text) - City name
      - `state` (text) - State abbreviation
      - `price` (integer) - Property price
      - `bedrooms` (integer) - Number of bedrooms
      - `bathrooms` (numeric) - Number of bathrooms
      - `sqft` (integer) - Square footage
      - `image_url` (text) - Main property image URL
      - `status` (text) - active, pending, sold
      - `featured` (boolean) - Featured listing flag
      - `description` (text) - Property description
      - `created_at` (timestamptz) - Creation timestamp
    
    - `agents`
      - `id` (uuid, primary key)
      - `name` (text) - Agent name
      - `title` (text) - Agent title/role
      - `phone` (text) - Contact phone
      - `email` (text) - Contact email
      - `image_url` (text) - Agent photo URL
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on both tables
    - Add public read access policies (no auth required for viewing)
    - Listings and agents are publicly viewable
*/

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  address text NOT NULL,
  city text NOT NULL DEFAULT 'Seattle',
  state text NOT NULL DEFAULT 'WA',
  price integer NOT NULL,
  bedrooms integer NOT NULL,
  bathrooms numeric(3,1) NOT NULL,
  sqft integer NOT NULL,
  image_url text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  featured boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  phone text,
  email text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Public read access for listings
CREATE POLICY "Listings are publicly readable"
  ON listings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Public read access for agents
CREATE POLICY "Agents are publicly readable"
  ON agents FOR SELECT
  TO anon, authenticated
  USING (true);
