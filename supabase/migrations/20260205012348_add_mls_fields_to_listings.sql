/*
  # Add Comprehensive MLS Fields to Listings
  
  1. New Columns Added to listings table
    - `mls_number` (text) - Official MLS listing number
    - `property_type` (text) - Single Family, Condo, Townhouse, etc.
    - `year_built` (integer) - Year property was constructed
    - `lot_size` (integer) - Lot size in square feet
    - `days_on_market` (integer) - Days since listing went active
    - `listing_date` (date) - Date property was listed
    - `parking_spaces` (integer) - Number of parking spaces
    - `garage_type` (text) - Attached, Detached, Carport, None, etc.
    - `hoa_fees` (integer) - Monthly HOA fees (null if none)
    - `heating_type` (text) - Forced Air, Radiant, Heat Pump, etc.
    - `cooling_type` (text) - Central AC, Mini-Split, None, etc.
    - `annual_taxes` (integer) - Annual property tax amount
    - `tax_year` (integer) - Year of tax assessment
    - `zoning` (text) - Zoning classification
    - `floors` (integer) - Number of floors/stories
    - `view_description` (text) - View features (city, water, mountain, etc.)
  
  2. Changes
    - All new fields are optional (nullable) to maintain backward compatibility
    - Fields have sensible defaults where appropriate
    - Enables rich, realistic MLS-style property data display
*/

-- Add comprehensive MLS fields to listings table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'mls_number'
  ) THEN
    ALTER TABLE listings ADD COLUMN mls_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'property_type'
  ) THEN
    ALTER TABLE listings ADD COLUMN property_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'year_built'
  ) THEN
    ALTER TABLE listings ADD COLUMN year_built integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'lot_size'
  ) THEN
    ALTER TABLE listings ADD COLUMN lot_size integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'days_on_market'
  ) THEN
    ALTER TABLE listings ADD COLUMN days_on_market integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'listing_date'
  ) THEN
    ALTER TABLE listings ADD COLUMN listing_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'parking_spaces'
  ) THEN
    ALTER TABLE listings ADD COLUMN parking_spaces integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'garage_type'
  ) THEN
    ALTER TABLE listings ADD COLUMN garage_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'hoa_fees'
  ) THEN
    ALTER TABLE listings ADD COLUMN hoa_fees integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'heating_type'
  ) THEN
    ALTER TABLE listings ADD COLUMN heating_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'cooling_type'
  ) THEN
    ALTER TABLE listings ADD COLUMN cooling_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'annual_taxes'
  ) THEN
    ALTER TABLE listings ADD COLUMN annual_taxes integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'tax_year'
  ) THEN
    ALTER TABLE listings ADD COLUMN tax_year integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'zoning'
  ) THEN
    ALTER TABLE listings ADD COLUMN zoning text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'floors'
  ) THEN
    ALTER TABLE listings ADD COLUMN floors integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'view_description'
  ) THEN
    ALTER TABLE listings ADD COLUMN view_description text;
  END IF;
END $$;