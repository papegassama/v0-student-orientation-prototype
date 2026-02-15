-- Fix RLS policies for user_profiles table
-- The current policies reference user_id but the column is actually id

-- Drop existing policies on user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- Create corrected RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Verify orientation_responses policies are correct
DROP POLICY IF EXISTS "Users can view their own responses" ON orientation_responses;
DROP POLICY IF EXISTS "Users can insert their own responses" ON orientation_responses;

CREATE POLICY "Users can view their own responses" ON orientation_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses" ON orientation_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Verify quiz_results policies are correct
DROP POLICY IF EXISTS "Users can view their own results" ON quiz_results;
DROP POLICY IF EXISTS "Users can insert their own results" ON quiz_results;

CREATE POLICY "Users can view their own results" ON quiz_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own results" ON quiz_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);
