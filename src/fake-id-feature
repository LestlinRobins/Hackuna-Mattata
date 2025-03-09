const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://azxiqnicyveuixgudrtc.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6eGlxbmljeXZldWl4Z3VkcnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNDg4OTQsImV4cCI6MjA1NjkyNDg5NH0.65zD9IERIrzn-hK4uhg_JC0Jv1GhR2bZR6yQRWuQ6Rg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
