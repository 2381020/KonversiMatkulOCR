/*
  # Add missing INSERT policy for profiles table

  The profiles table needs an INSERT policy to allow new users to create their profile
  when they sign up.
*/

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
