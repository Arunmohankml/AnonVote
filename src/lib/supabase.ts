import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://tvcmsmswmaeqtjyjxjqz.supabase.co";
const DEFAULT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Y21zbXN3bWFlcXRqeWp4anF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMTgzOTksImV4cCI6MjEwNDg5NDM5OX0.rGMwhNoSUpuj6YkFSIg7JCc5HvC2-_fKIS3DwwD148g";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
