-- Public "report incorrect listing info" submissions
CREATE TABLE IF NOT EXISTS public.listing_correction_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings (id) ON DELETE SET NULL,
  listing_slug TEXT NOT NULL,
  listing_title TEXT,
  issue_type TEXT NOT NULL
    CHECK (issue_type IN (
      'alamat',
      'kontak',
      'website_sosial',
      'kategori',
      'nama_deskripsi',
      'tutup_tidak_aktif',
      'lainnya'
    )),
  message TEXT NOT NULL,
  reporter_name TEXT,
  reporter_email TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT listing_correction_message_len CHECK (char_length(message) BETWEEN 10 AND 5000),
  CONSTRAINT listing_correction_slug_len CHECK (char_length(listing_slug) BETWEEN 1 AND 200),
  CONSTRAINT listing_correction_name_len CHECK (
    reporter_name IS NULL OR char_length(reporter_name) BETWEEN 2 AND 120
  ),
  CONSTRAINT listing_correction_email_len CHECK (
    reporter_email IS NULL OR char_length(reporter_email) BETWEEN 5 AND 254
  )
);

CREATE INDEX IF NOT EXISTS idx_listing_correction_created_at
  ON public.listing_correction_reports (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_listing_correction_listing
  ON public.listing_correction_reports (listing_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_listing_correction_status
  ON public.listing_correction_reports (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_listing_correction_ip_created
  ON public.listing_correction_reports (ip_hash, created_at DESC)
  WHERE ip_hash IS NOT NULL;

COMMENT ON TABLE public.listing_correction_reports IS
  'Public suggestions to correct inaccurate listing information';

ALTER TABLE public.listing_correction_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read correction reports"
  ON public.listing_correction_reports;
CREATE POLICY "Authenticated can read correction reports"
  ON public.listing_correction_reports
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can update correction reports"
  ON public.listing_correction_reports;
CREATE POLICY "Authenticated can update correction reports"
  ON public.listing_correction_reports
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- No direct INSERT for anon — submissions go through SECURITY DEFINER RPC
CREATE OR REPLACE FUNCTION public.submit_listing_correction_report(
  p_listing_slug TEXT,
  p_issue_type TEXT,
  p_message TEXT,
  p_reporter_name TEXT DEFAULT NULL,
  p_reporter_email TEXT DEFAULT NULL,
  p_ip_hash TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_slug TEXT := lower(trim(p_listing_slug));
  v_issue TEXT := trim(p_issue_type);
  v_message TEXT := trim(p_message);
  v_name TEXT := NULLIF(trim(COALESCE(p_reporter_name, '')), '');
  v_email TEXT := NULLIF(lower(trim(COALESCE(p_reporter_email, ''))), '');
  v_listing_id UUID;
  v_listing_title TEXT;
  v_recent INT;
BEGIN
  IF v_slug IS NULL OR char_length(v_slug) < 1 OR char_length(v_slug) > 200 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_listing');
  END IF;

  IF v_issue NOT IN (
    'alamat',
    'kontak',
    'website_sosial',
    'kategori',
    'nama_deskripsi',
    'tutup_tidak_aktif',
    'lainnya'
  ) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_issue_type');
  END IF;

  IF v_message IS NULL OR char_length(v_message) < 10 OR char_length(v_message) > 5000 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_message');
  END IF;

  IF v_name IS NOT NULL AND (char_length(v_name) < 2 OR char_length(v_name) > 120) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_name');
  END IF;

  IF v_email IS NOT NULL AND (
    char_length(v_email) < 5
    OR char_length(v_email) > 254
    OR v_email !~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'
  ) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_email');
  END IF;

  SELECT id, title INTO v_listing_id, v_listing_title
  FROM public.listings
  WHERE slug = v_slug
    AND status = 'published'
  LIMIT 1;

  IF v_listing_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'listing_not_found');
  END IF;

  -- Rate limit: max 3 reports / 15 min per IP (or email if provided)
  SELECT COUNT(*)::INT INTO v_recent
  FROM public.listing_correction_reports
  WHERE created_at > now() - interval '15 minutes'
    AND (
      (p_ip_hash IS NOT NULL AND ip_hash = p_ip_hash)
      OR (v_email IS NOT NULL AND lower(reporter_email) = v_email)
    );

  IF v_recent >= 3 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'rate_limited');
  END IF;

  INSERT INTO public.listing_correction_reports (
    listing_id,
    listing_slug,
    listing_title,
    issue_type,
    message,
    reporter_name,
    reporter_email,
    ip_hash,
    user_agent
  )
  VALUES (
    v_listing_id,
    v_slug,
    v_listing_title,
    v_issue,
    v_message,
    v_name,
    v_email,
    NULLIF(trim(COALESCE(p_ip_hash, '')), ''),
    NULLIF(left(trim(COALESCE(p_user_agent, '')), 300), '')
  );

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.submit_listing_correction_report(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.submit_listing_correction_report(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO anon, authenticated;
