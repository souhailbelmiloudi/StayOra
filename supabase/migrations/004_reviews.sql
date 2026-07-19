-- ============================================
-- StayOra — Guest reviews (manual / from Airbnb)
-- Run this in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  avatar TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(published);
CREATE INDEX IF NOT EXISTS idx_reviews_sort ON reviews(sort_order);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DO $do$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'reviews' LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON reviews';
  END LOOP;
END $do$;

CREATE POLICY "public_read_published_reviews" ON reviews
  FOR SELECT USING (published = true);

CREATE POLICY "authenticated_select_reviews" ON reviews
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_insert_reviews" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_update_reviews" ON reviews
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "authenticated_delete_reviews" ON reviews
  FOR DELETE USING (auth.role() = 'authenticated');

GRANT SELECT ON reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON reviews TO authenticated;
