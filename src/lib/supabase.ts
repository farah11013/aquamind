import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://isknpstdzdbkhrweuqfp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza25wc3RkemRia2hyd2V1cWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMTU5MDYsImV4cCI6MjA4Mzg5MTkwNn0.97MBDZNDLwv9yYJE9oybo7kdEiueqzsIrUfzVgmDUes';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
