-- Fix orders table RLS policies

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "System can update orders" ON public.orders;

-- Create proper SELECT policy - users can only view orders matching their email
CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT TO authenticated
USING (buyer_email = (auth.jwt() ->> 'email'));

-- Allow anonymous/public viewing of own orders by order_id (for payment return flow)
CREATE POLICY "Anyone can view order by id" ON public.orders
FOR SELECT
USING (true);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'));

-- Only admins can update orders
CREATE POLICY "Admins can update orders" ON public.orders
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'));

-- Drop and recreate the "Anyone can view order by id" with proper restriction
DROP POLICY IF EXISTS "Anyone can view order by id" ON public.orders;