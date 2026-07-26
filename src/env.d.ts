/// <reference types="astro/client" />

import type { User } from '@supabase/supabase-js';

declare namespace Cloudflare {
  interface Env {
    PUBLIC_SUPABASE_URL: string;
    PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
  }
}

declare namespace App {
  interface Locals {
    user?: User;
  }
}
