-- ============================================
-- StayOra — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Apartments table
CREATE TABLE IF NOT EXISTS apartments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  price_per_night NUMERIC(10, 2) NOT NULL,
  max_guests INTEGER NOT NULL DEFAULT 2,
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  square_meters INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_apartments_city ON apartments(city);
CREATE INDEX idx_apartments_featured ON apartments(featured);
CREATE INDEX idx_apartments_slug ON apartments(slug);

-- Apartment images table
CREATE TABLE IF NOT EXISTS apartment_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_apartment_images_apartment ON apartment_images(apartment_id);

-- Reservation requests table
CREATE TABLE IF NOT EXISTS reservation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id UUID REFERENCES apartments(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT DEFAULT '',
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reservation_requests_email ON reservation_requests(guest_email);
CREATE INDEX idx_reservation_requests_created ON reservation_requests(created_at DESC);

-- ============================================
-- Storage bucket for apartment images
-- Run this after creating the tables
-- ============================================
-- Go to Supabase Dashboard > Storage > New bucket
-- Name: apartment-images
-- Public: yes
-- ============================================

-- ============================================
-- Row Level Security (public read, no auth needed)
-- ============================================
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartment_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_requests ENABLE ROW LEVEL SECURITY;

-- Public read access for apartments
CREATE POLICY "Public read apartments"
  ON apartments FOR SELECT
  USING (true);

-- Public read access for apartment images
CREATE POLICY "Public read apartment images"
  ON apartment_images FOR SELECT
  USING (true);

-- Anyone can insert reservation requests
CREATE POLICY "Public insert reservation requests"
  ON reservation_requests FOR INSERT
  WITH CHECK (true);

-- Public read access for apartment-images storage
-- (Set via Supabase Dashboard: Storage > apartment-images > Policies)
