
-- Create a table to store contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) - making it readable by authenticated users only
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for form submissions)
CREATE POLICY "Anyone can submit contact form" 
  ON public.contact_submissions 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Create policy to allow authenticated users to view submissions (for admin access)
CREATE POLICY "Authenticated users can view submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  TO authenticated
  USING (true);
