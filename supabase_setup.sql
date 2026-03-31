-- Run this SQL in the Supabase SQL Editor to set up your database tables.

-- 1. Create the Menu Items table
CREATE TABLE menu_items (
  id TEXT PRIMARY KEY, -- Using TEXT to match the provided seed IDs
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create the Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INTEGER NOT NULL,
  note TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. (Optional) Enable Row Level Security (RLS)
-- To keep it simple for the showcase, you can disable RLS or add policies.
-- For now, let's keep it open for the public anon key to read menu items and insert bookings.

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON menu_items FOR INSERT WITH CHECK (true);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Insert Access" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin All Access" ON bookings FOR ALL USING (auth.role() = 'authenticated');

-- 4. Create the Orders table for website checkout
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Note: Since we disabled RLS previously for the showcase, you won't need to add new RLS policies for orders unless you re-enable it.
-- If you re-enable RLS:
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public Insert Access" ON orders FOR INSERT WITH CHECK (true);

-- 5. Create Customers table for frictionless auto-auth (Phase 5)
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Alter orders table to include customer references
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;


-- 7. Create Restaurant Settings table (Phase 6)
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  restaurant_name TEXT DEFAULT 'Gourmet Haven',
  whatsapp_number TEXT DEFAULT '+8801700000000',
  address TEXT DEFAULT 'Gulshan-2, Dhaka, Bangladesh',
  currency TEXT DEFAULT 'BDT',
  timezone TEXT DEFAULT 'UTC+6',
  is_maintenance_mode BOOLEAN DEFAULT false,
  primary_color TEXT DEFAULT '#C5A572',
  secondary_color TEXT DEFAULT '#1A1A1A',
  logo_url TEXT,
  email_notifications BOOLEAN DEFAULT true,
  order_alerts BOOLEAN DEFAULT true,
  delivery_charge NUMERIC DEFAULT 0,
  min_order NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert initial settings if not exists
INSERT INTO restaurant_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
