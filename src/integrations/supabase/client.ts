// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://acqorirfbvbctvulcxho.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjcW9yaXJmYnZiY3R2dWxjeGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NzQ2MjAsImV4cCI6MjA2MzI1MDYyMH0._Q5n6qmfLjHLrzJNx4_d1wuPXNTNjDWF7iRUsfHcp5M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);