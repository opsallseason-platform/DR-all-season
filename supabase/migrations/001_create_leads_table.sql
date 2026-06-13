-- Create leads table for contact form submissions and after-hours booking notifications
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'contact_form', -- 'contact_form' or 'booking'
  booking_id UUID REFERENCES bookings(id),
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'converted', 'closed'
  is_after_hours BOOLEAN NOT NULL DEFAULT false,
  follow_up_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying leads by status and follow-up date
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_follow_up_date ON leads(follow_up_date);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role has full access to leads" ON leads
  FOR ALL USING (true) WITH CHECK (true);
