-- Optional translations; keep name + description as the required defaults
ALTER TABLE apartments
  ADD COLUMN IF NOT EXISTS name_es TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS name_fr TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS name_ar TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_es TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_fr TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_ar TEXT NOT NULL DEFAULT '';
