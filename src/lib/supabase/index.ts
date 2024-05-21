import { createClient } from "@supabase/supabase-js";

const supakey = process.env.NEXT_PUBLIC_SUPAKEY ?? process.env.SUPAKEY ?? "";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  `https://${process.env.NEXT_PUBLIC_SUPABASE_ID ?? process.env.SUPABASE_ID}.supabase.co`,
  supakey,
);

export default supabase;
