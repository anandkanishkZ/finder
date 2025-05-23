/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - Extended user profile data
      - Linked to auth.users
      - Stores reputation and verification data
    
    - `items`
      - Core table for lost and found items
      - Includes location, status, and verification data
    
    - `claims`
      - Records item claims and verification process
      - Links items with potential owners/finders
    
    - `messages`
      - Private messages between users
      - Related to specific items and claims
    
    - `notifications`
      - System notifications for users
      - Tracks various events and updates
    
    - `reports`
      - User reports for items/claims
      - Helps maintain platform integrity
    
    - `safety_points`
      - Verified meeting locations
      - Includes operating hours and security features

  2. Security
    - Enable RLS on all tables
    - Policies for user access control
    - Admin-specific policies
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  reputation_score integer DEFAULT 0,
  verified_finds integer DEFAULT 0,
  successful_returns integer DEFAULT 0,
  phone_number text,
  preferred_meeting_points text[],
  CONSTRAINT email_unique UNIQUE (email)
);

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
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create claims table
CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  claimer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false,
  attachments text[]
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  action_url text,
  priority text NOT NULL
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  reporter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  description text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  evidence text[]
);

-- Create safety points table
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

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_points ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Items policies
CREATE POLICY "Items are viewable by everyone" ON items
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own items" ON items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items" ON items
  FOR UPDATE USING (auth.uid() = user_id);

-- Claims policies
CREATE POLICY "Claims are viewable by involved users" ON claims
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM items WHERE id = item_id
      UNION
      SELECT claimer_id
    )
  );

CREATE POLICY "Users can create claims" ON claims
  FOR INSERT WITH CHECK (auth.uid() = claimer_id);

CREATE POLICY "Users can update own claims" ON claims
  FOR UPDATE USING (auth.uid() = claimer_id);

-- Messages policies
CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING (
    auth.uid() IN (sender_id, receiver_id)
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Reports policies
CREATE POLICY "Admins can view all reports" ON reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Safety points policies
CREATE POLICY "Safety points are viewable by everyone" ON safety_points
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage safety points" ON safety_points
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();