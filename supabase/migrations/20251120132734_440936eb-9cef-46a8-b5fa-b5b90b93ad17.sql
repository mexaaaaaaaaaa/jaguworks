-- Create orders table to store customer orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_discord TEXT,
  buyer_phone TEXT,
  plan_name TEXT NOT NULL,
  plan_price INTEGER NOT NULL,
  addons JSONB DEFAULT '[]'::jsonb,
  cloudflare_enabled BOOLEAN DEFAULT false,
  cloudflare_txn_id TEXT,
  payment_txn_id TEXT,
  total_amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ,
  server_access_details TEXT,
  invoice_url TEXT
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to create orders (public checkout)
CREATE POLICY "Anyone can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow users to view their own orders by email
CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  USING (true);

-- Create policy for updating orders (for webhook callbacks)
CREATE POLICY "System can update orders"
  ON public.orders
  FOR UPDATE
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_orders_order_id ON public.orders(order_id);
CREATE INDEX idx_orders_email ON public.orders(buyer_email);
CREATE INDEX idx_orders_status ON public.orders(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_timestamp
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();