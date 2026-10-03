-- Allow listings without a subcategory while keeping a category assignment.

ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories (id) ON DELETE RESTRICT;

UPDATE public.listings AS l
SET category_id = s.category_id
FROM public.subcategories AS s
WHERE l.subcategory_id = s.id
  AND l.category_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_listings_category_id
  ON public.listings (category_id);

ALTER TABLE public.listings
  ALTER COLUMN subcategory_id DROP NOT NULL;
