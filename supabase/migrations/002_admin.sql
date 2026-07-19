-- ============================================
-- StayOra — Admin Migration (DEFINITIVE)
-- Run AFTER 001_initial.sql
-- OR just run 003_fix_rls.sql instead
-- ============================================

-- 1. Add columns first (before any policies reference them)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'apartments' AND column_name = 'status') THEN
    ALTER TABLE apartments ADD COLUMN status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'apartments' AND column_name = 'services') THEN
    ALTER TABLE apartments ADD COLUMN services TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'
);

INSERT INTO settings (key, value) VALUES
  ('business', '{"name": "StayOra", "description": "Apartamentos turísticos", "phone": "", "whatsapp": "", "email": "", "address": "", "instagram": "", "facebook": "", "tiktok": "", "google_maps_url": ""}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 2. Enable RLS on all tables
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartment_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 2b. Grant base table permissions to roles
GRANT SELECT, INSERT, UPDATE, DELETE ON apartments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON apartment_images TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON reservation_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON settings TO authenticated;
GRANT SELECT ON apartments TO anon;
GRANT SELECT ON apartment_images TO anon;
GRANT SELECT ON settings TO anon;
GRANT INSERT ON reservation_requests TO anon;

-- 3. Drop all existing policies then recreate

-- Apartments
DO $do$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'apartments' LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON apartments';
  END LOOP;
END $do$;

CREATE POLICY "public_read_published" ON apartments FOR SELECT USING (status = 'published');
CREATE POLICY "authenticated_select_all" ON apartments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_insert" ON apartments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_update" ON apartments FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_delete" ON apartments FOR DELETE USING (auth.role() = 'authenticated');

-- Apartment Images
DO $do$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'apartment_images' LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON apartment_images';
  END LOOP;
END $do$;

CREATE POLICY "public_read_images" ON apartment_images FOR SELECT USING (true);
CREATE POLICY "authenticated_insert_images" ON apartment_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_update_images" ON apartment_images FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_delete_images" ON apartment_images FOR DELETE USING (auth.role() = 'authenticated');

-- Reservation Requests
DO $do$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'reservation_requests' LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON reservation_requests';
  END LOOP;
END $do$;

CREATE POLICY "public_insert_reservations" ON reservation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "authenticated_select_reservations" ON reservation_requests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_update_reservations" ON reservation_requests FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_delete_reservations" ON reservation_requests FOR DELETE USING (auth.role() = 'authenticated');

-- Settings
DO $do$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'settings' LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON settings';
  END LOOP;
END $do$;

CREATE POLICY "public_read_settings" ON settings FOR SELECT USING (true);
CREATE POLICY "authenticated_select_settings" ON settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_insert_settings" ON settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_update_settings" ON settings FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_delete_settings" ON settings FOR DELETE USING (auth.role() = 'authenticated');
