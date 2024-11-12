// File: src/utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
export { supabase };

// Supabase Table Setup Instructions:
/*
1. Create a 'messages' table with the following columns:
   - id (text, primary key)
   - user_id (text, not null)
   - content (text, not null)
   - reply_to (text, references messages.id, nullable)
   - created_at (timestamp with time zone, default: now())

2. Create a 'users' table with:
   - id (text, primary key)
   - name (text, not null)
   - avatar_url (text, nullable)
   - created_at (timestamp with time zone, default: now())

3. Create Row Level Security (RLS) policies for proper access control:
   
   For the messages table:
   - Enable RLS
   - Create a policy for SELECT:
     Name: Allow read access to all
     Using expression: true
   
   - Create a policy for INSERT:
     Name: Allow authenticated users to insert
     Using expression: auth.role() = 'authenticated'
   
   - Create a policy for DELETE:
     Name: Allow users to delete their own messages
     Using expression: auth.uid() = user_id
*/
