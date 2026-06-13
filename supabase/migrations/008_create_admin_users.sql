-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(255) UNIQUE NOT NULL,
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Insert default admin users (you'll need to update passwords with bcrypt hashes)
-- Password: Use bcrypt to hash your passwords before inserting
-- Example: bcrypt.hash('YourPassword123!', 10)

-- Admin 1
INSERT INTO admin_users (email, name, password_hash, role)
VALUES (
  'admin@drallseasontravel.com',
  'Main Admin',
  '$2a$10$YourBcryptHashHere1',
  'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- Admin 2
INSERT INTO admin_users (email, name, password_hash, role)
VALUES (
  'admin2@drallseasontravel.com',
  'Admin User 2',
  '$2a$10$YourBcryptHashHere2',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Admin 3
INSERT INTO admin_users (email, name, password_hash, role)
VALUES (
  'admin3@drallseasontravel.com',
  'Admin User 3',
  '$2a$10$YourBcryptHashHere3',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- No policies needed as admin tables are only accessed via API routes with service role key
