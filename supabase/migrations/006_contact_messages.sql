-- Contact form inbox (secure RPC submit, admin read)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'read', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT contact_messages_name_len CHECK (char_length(name) BETWEEN 2 AND 120),
  CONSTRAINT contact_messages_email_len CHECK (char_length(email) BETWEEN 5 AND 254),
  CONSTRAINT contact_messages_message_len CHECK (char_length(message) BETWEEN 10 AND 5000)
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON public.contact_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_email_created
  ON public.contact_messages (lower(email), created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_ip_created
  ON public.contact_messages (ip_hash, created_at DESC)
  WHERE ip_hash IS NOT NULL;

COMMENT ON TABLE public.contact_messages IS 'Inbound contact form messages from public site';

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated can read contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can update contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- No direct INSERT for anon — submissions go through SECURITY DEFINER RPC
CREATE OR REPLACE FUNCTION public.submit_contact_message(
  p_name TEXT,
  p_email TEXT,
  p_message TEXT,
  p_ip_hash TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name TEXT := trim(p_name);
  v_email TEXT := lower(trim(p_email));
  v_message TEXT := trim(p_message);
  v_recent INT;
BEGIN
  IF v_name IS NULL OR char_length(v_name) < 2 OR char_length(v_name) > 120 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_name');
  END IF;

  IF v_email IS NULL
     OR char_length(v_email) < 5
     OR char_length(v_email) > 254
     OR v_email !~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_email');
  END IF;

  IF v_message IS NULL OR char_length(v_message) < 10 OR char_length(v_message) > 5000 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_message');
  END IF;

  -- Rate limit: max 3 submissions / 15 min per email or IP hash
  SELECT COUNT(*)::INT INTO v_recent
  FROM public.contact_messages
  WHERE created_at > now() - interval '15 minutes'
    AND (
      lower(email) = v_email
      OR (p_ip_hash IS NOT NULL AND ip_hash = p_ip_hash)
    );

  IF v_recent >= 3 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'rate_limited');
  END IF;

  INSERT INTO public.contact_messages (name, email, message, ip_hash, user_agent)
  VALUES (
    v_name,
    v_email,
    v_message,
    NULLIF(trim(COALESCE(p_ip_hash, '')), ''),
    NULLIF(left(trim(COALESCE(p_user_agent, '')), 300), '')
  );

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.submit_contact_message(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_contact_message(TEXT, TEXT, TEXT, TEXT, TEXT)
  TO anon, authenticated;
