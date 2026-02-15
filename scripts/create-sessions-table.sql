-- Create sessions table for session management
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on token for fast lookups
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Add password_hash column to user_profiles if it doesn't exist
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION delete_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to periodically clean up expired sessions
DROP TRIGGER IF EXISTS cleanup_expired_sessions_trigger ON sessions;
CREATE TRIGGER cleanup_expired_sessions_trigger
AFTER INSERT ON sessions
EXECUTE FUNCTION delete_expired_sessions();
