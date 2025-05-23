/*
  # Initial Schema Setup

  1. Tables
    - Profiles: User profiles with reputation system
    - Items: Lost and found items
    - Claims: Item claims and verification
    - Messages: User communication
    - Notifications: System notifications
    - Reports: Content reporting
    - Safety Points: Safe meeting locations

  2. Security
    - RLS enabled on all tables
    - Appropriate access policies
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  reputation_score integer DEFAULT 0,
  verified_finds integer DEFAULT 0,
  successful_returns integer DEFAULT 0,
  phone_number text,
  preferred_meeting_points text[]
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Public profiles are viewable by everyone'
  ) THEN
    CREATE POLICY "Public profiles are viewable by everyone"
      ON profiles FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles FOR UPDATE
      TO public
      USING (auth.uid() = id);
  END IF;
END $$;

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  status text NOT NULL,
  date timestamptz NOT NULL,
  location text NOT NULL,
  lat double precision,
  lng double precision,
  image_url text,
  anonymous boolean DEFAULT false,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  contact_info text NOT NULL,
  created_at timestamptz DEFAULT now(),
  qr_code text,
  reward_amount numeric,
  reward_currency text,
  reward_description text,
  verification_code text,
  views integer DEFAULT 0,
  reports integer DEFAULT 0
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'items' 
    AND policyname = 'Items are viewable by everyone'
  ) THEN
    CREATE POLICY "Items are viewable by everyone"
      ON items FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'items' 
    AND policyname = 'Users can insert own items'
  ) THEN
    CREATE POLICY "Users can insert own items"
      ON items FOR INSERT
      TO public
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'items' 
    AND policyname = 'Users can update own items'
  ) THEN
    CREATE POLICY "Users can update own items"
      ON items FOR UPDATE
      TO public
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create claims table
CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items ON DELETE CASCADE,
  claimer_id uuid REFERENCES auth.users ON DELETE CASCADE,
  description text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  verification_proof text[],
  meeting_location text,
  meeting_lat double precision,
  meeting_lng double precision,
  meeting_date timestamptz,
  meeting_status text,
  reward_status text
);

ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'claims' 
    AND policyname = 'Claims are viewable by involved users'
  ) THEN
    CREATE POLICY "Claims are viewable by involved users"
      ON claims FOR SELECT
      TO public
      USING (
        auth.uid() IN (
          SELECT user_id FROM items WHERE id = item_id
          UNION
          SELECT claimer_id
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'claims' 
    AND policyname = 'Users can create claims'
  ) THEN
    CREATE POLICY "Users can create claims"
      ON claims FOR INSERT
      TO public
      WITH CHECK (auth.uid() = claimer_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'claims' 
    AND policyname = 'Users can update own claims'
  ) THEN
    CREATE POLICY "Users can update own claims"
      ON claims FOR UPDATE
      TO public
      USING (auth.uid() = claimer_id);
  END IF;
END $$;

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users ON DELETE CASCADE,
  receiver_id uuid REFERENCES auth.users ON DELETE CASCADE,
  item_id uuid REFERENCES items ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false,
  attachments text[]
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Users can view their messages'
  ) THEN
    CREATE POLICY "Users can view their messages"
      ON messages FOR SELECT
      TO public
      USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND policyname = 'Users can send messages'
  ) THEN
    CREATE POLICY "Users can send messages"
      ON messages FOR INSERT
      TO public
      WITH CHECK (auth.uid() = sender_id);
  END IF;
END $$;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  action_url text,
  priority text NOT NULL
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' 
    AND policyname = 'Users can view own notifications'
  ) THEN
    CREATE POLICY "Users can view own notifications"
      ON notifications FOR SELECT
      TO public
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' 
    AND policyname = 'System can create notifications'
  ) THEN
    CREATE POLICY "System can create notifications"
      ON notifications FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items ON DELETE CASCADE,
  reporter_id uuid REFERENCES auth.users ON DELETE CASCADE,
  reason text NOT NULL,
  description text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  evidence text[]
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reports' 
    AND policyname = 'Admins can view all reports'
  ) THEN
    CREATE POLICY "Admins can view all reports"
      ON reports FOR SELECT
      TO public
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid()
          AND is_admin = true
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reports' 
    AND policyname = 'Users can create reports'
  ) THEN
    CREATE POLICY "Users can create reports"
      ON reports FOR INSERT
      TO public
      WITH CHECK (auth.uid() = reporter_id);
  END IF;
END $$;

-- Create safety_points table
CREATE TABLE IF NOT EXISTS safety_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  type text NOT NULL,
  operating_hours jsonb NOT NULL,
  verification_process text NOT NULL,
  security_features text[]
);

ALTER TABLE safety_points ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'safety_points' 
    AND policyname = 'Safety points are viewable by everyone'
  ) THEN
    CREATE POLICY "Safety points are viewable by everyone"
      ON safety_points FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'safety_points' 
    AND policyname = 'Admins can manage safety points'
  ) THEN
    CREATE POLICY "Admins can manage safety points"
      ON safety_points FOR ALL
      TO public
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid()
          AND is_admin = true
        )
      );
  END IF;
END $$;

-- Create trigger function for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();