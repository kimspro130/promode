-- Create Orders Table for PROMODE E-commerce
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
  payment_method TEXT,
  payment_reference TEXT,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  customer_notes TEXT,
  admin_notes TEXT,
  tracking_number TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL, -- Store product name at time of order
  product_image TEXT NOT NULL, -- Store product image at time of order
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  size TEXT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_status_history table for tracking status changes
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON public.order_status_history(order_id);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Create RLS policies for order_items
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create RLS policies for order_status_history
CREATE POLICY "Users can view own order status history" ON public.order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_status_history.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  order_num TEXT;
  counter INTEGER;
BEGIN
  -- Get current date in YYYYMMDD format
  order_num := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-';
  
  -- Get count of orders today + 1
  SELECT COUNT(*) + 1 INTO counter
  FROM public.orders
  WHERE DATE(created_at) = CURRENT_DATE;
  
  -- Pad with zeros to make it 4 digits
  order_num := order_num || LPAD(counter::TEXT, 4, '0');
  
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically set order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set order number
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Create function to update order total when items change
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.orders
  SET 
    subtotal = (
      SELECT COALESCE(SUM(total_price), 0)
      FROM public.order_items
      WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
    ),
    total_amount = subtotal + tax_amount + shipping_amount - discount_amount,
    updated_at = NOW()
  WHERE id = COALESCE(NEW.order_id, OLD.order_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update order total
CREATE TRIGGER trigger_update_order_total_insert
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_order_total();

CREATE TRIGGER trigger_update_order_total_update
  AFTER UPDATE ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_order_total();

CREATE TRIGGER trigger_update_order_total_delete
  AFTER DELETE ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_order_total();

-- Create function to log status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_status_history (order_id, status, notes, changed_by)
    VALUES (NEW.id, NEW.status, 'Status changed from ' || OLD.status || ' to ' || NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to log status changes
CREATE TRIGGER trigger_log_order_status_change
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_status_change();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON public.orders
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample order statuses for reference
COMMENT ON COLUMN public.orders.status IS 'Order status: pending, confirmed, processing, shipped, delivered, cancelled, refunded';
COMMENT ON COLUMN public.orders.payment_status IS 'Payment status: pending, paid, failed, refunded, partially_refunded';

-- Create view for order summary
CREATE OR REPLACE VIEW public.order_summary AS
SELECT 
  o.id,
  o.order_number,
  o.user_id,
  o.total_amount,
  o.status,
  o.payment_status,
  o.created_at,
  COUNT(oi.id) as item_count,
  SUM(oi.quantity) as total_quantity
FROM public.orders o
LEFT JOIN public.order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, o.user_id, o.total_amount, o.status, o.payment_status, o.created_at;

-- Grant permissions for the view
ALTER VIEW public.order_summary OWNER TO postgres;

-- Create RLS policy for the view
CREATE POLICY "Users can view own order summary" ON public.order_summary
  FOR SELECT USING (auth.uid() = user_id);
