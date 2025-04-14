
-- Add shipping_address column to orders table if it doesn't exist
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address text NOT NULL;
