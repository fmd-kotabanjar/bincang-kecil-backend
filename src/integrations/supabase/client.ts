// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vzhalwhtymudgqtzmfdz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aGFsd2h0eW11ZGdxdHptZmR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTQyNTEsImV4cCI6MjA2NDI5MDI1MX0.4ShqbKCdQcfI6--tN-wMj0ATpfE3bsrKxkCSTqS6LTw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);