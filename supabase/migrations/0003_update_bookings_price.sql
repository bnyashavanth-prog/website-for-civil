-- Make estimated_price optional in bookings table
ALTER TABLE public.bookings ALTER COLUMN estimated_price DROP NOT NULL;
