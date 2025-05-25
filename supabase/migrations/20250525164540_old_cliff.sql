/*
  # Authentication and Admin Setup

  1. Updates
    - Add admin flag to profiles table
    - Add email verification settings
    - Set up authentication triggers
    - Create admin policies

  2. Security
    - Enable RLS
    - Add admin-specific policies
    - Set up secure profile handling
*/

-- Update profiles table with admin flag if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, is_admin)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    CASE 
      WHEN new.email = 'admin@finderkeeper.com' THEN true
      ELSE false
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add admin-specific policies
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    is_admin = true
    OR
    id = auth.uid()
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    is_admin = true
    OR
    id = auth.uid()
  );

-- Create initial admin user function
CREATE OR REPLACE FUNCTION create_initial_admin()
RETURNS void AS $$
BEGIN
  -- Check if admin exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@finderkeeper.com'
  ) THEN
    -- Insert admin into auth.users
    INSERT INTO auth.users (
      email,
      raw_user_meta_data,
      created_at
    ) VALUES (
      'admin@finderkeeper.com',
      '{"name": "Admin User"}',
      now()
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;