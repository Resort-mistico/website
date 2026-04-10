-- 1. Create tables
CREATE TABLE public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text,
  content text NOT NULL,
  status text DEFAULT 'draft',
  cover_image text,
  reactions integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Create Storage Bucket for Covers
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true) ON CONFLICT DO NOTHING;

-- 3. Set up Row Level Security (RLS) Rules
-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Posts: Anyone can read published posts
CREATE POLICY "Public can view published posts" ON public.posts
  FOR SELECT USING (status = 'published');

-- Posts: Authenticated users (Admin) can do everything
CREATE POLICY "Admin can do all on posts" ON public.posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Comments: Anyone can read approved comments
CREATE POLICY "Public can view approved comments" ON public.comments
  FOR SELECT USING (status = 'approved');

-- Comments: Anyone can insert a comment (pending by default)
CREATE POLICY "Public can insert comments" ON public.comments
  FOR INSERT WITH CHECK (true);

-- Comments: Authenticated users (Admin) can do everything
CREATE POLICY "Admin can do all on comments" ON public.comments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Storage Policies for 'covers' Bucket
-- Allow public to select images from covers
CREATE POLICY "Public Access" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'covers');

-- Allow authenticated admins to upload and delete from covers
CREATE POLICY "Admin Upload Access" 
  ON storage.objects FOR INSERT TO authenticated 
  WITH CHECK (bucket_id = 'covers');

CREATE POLICY "Admin Manage Access" 
  ON storage.objects FOR UPDATE TO authenticated 
  USING (bucket_id = 'covers');

CREATE POLICY "Admin Delete Access" 
  ON storage.objects FOR DELETE TO authenticated 
  USING (bucket_id = 'covers');

-- 5. SEO Additions
-- Execute a linha abaixo no "SQL Editor" do Supabase para adicionar suporte a Meta Descriptions:
-- ALTER TABLE public.posts ADD COLUMN excerpt text;
