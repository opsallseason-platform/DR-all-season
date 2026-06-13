/**
 * SUPABASE DB CLIENT
 * Lightweight client for direct database queries (no cookie/auth dependency).
 * Used in server components, API routes, and data fetching functions.
 */

import { createClient } from '@supabase/supabase-js';

export const supabaseDb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url: any, options: any = {}) =>
        fetch(url, { ...options, cache: 'no-store' }),
    },
  }
);
