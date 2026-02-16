-- Migration: Add payload column for API references
ALTER TABLE public.challenges 
ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- Comment on column
COMMENT ON COLUMN public.challenges.payload IS 'Stores API references (e.g. {type: "quran", surah: 1, ayah: 1})';
