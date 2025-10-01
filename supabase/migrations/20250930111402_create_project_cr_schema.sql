-- Project CR Dashboard Database Schema
-- Migration for Project CR Dashboard

-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deliverables table
CREATE TABLE IF NOT EXISTS deliverables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'to-do', 'in-progress', 'in-review', 'done')),
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assignee_name TEXT, -- Denormalized for easier queries
  project_area TEXT NOT NULL,
  due_date DATE,
  week_number INTEGER,
  document_link TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Create project phases table
CREATE TABLE IF NOT EXISTS project_phases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  start_date DATE,
  due_date DATE,
  status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  assigned_tasks TEXT,
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments/notes table for deliverables
CREATE TABLE IF NOT EXISTS deliverable_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deliverable_id UUID REFERENCES deliverables(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create history log table for tracking changes
CREATE TABLE IF NOT EXISTS deliverable_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deliverable_id UUID REFERENCES deliverables(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverable_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverable_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for deliverables
CREATE POLICY "Users can view all deliverables" ON deliverables
  FOR SELECT USING (true);

CREATE POLICY "Users can insert deliverables" ON deliverables
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update deliverables" ON deliverables
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete deliverables" ON deliverables
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for project phases
CREATE POLICY "Users can view project phases" ON project_phases
  FOR SELECT USING (true);

-- RLS Policies for team members
CREATE POLICY "Users can view team members" ON team_members
  FOR SELECT USING (true);

-- RLS Policies for comments
CREATE POLICY "Users can view all comments" ON deliverable_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert comments" ON deliverable_comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for history
CREATE POLICY "Users can view all history" ON deliverable_history
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deliverables_status ON deliverables(status);
CREATE INDEX IF NOT EXISTS idx_deliverables_assignee ON deliverables(assignee_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_project_area ON deliverables(project_area);
CREATE INDEX IF NOT EXISTS idx_deliverables_due_date ON deliverables(due_date);
CREATE INDEX IF NOT EXISTS idx_deliverable_comments_deliverable_id ON deliverable_comments(deliverable_id);
CREATE INDEX IF NOT EXISTS idx_deliverable_history_deliverable_id ON deliverable_history(deliverable_id);

-- Insert Project CR phases (4-week sprint structure)
INSERT INTO project_phases (name, description, icon, start_date, due_date, order_index) VALUES
('Week 1: Strategic Foundation', 'Define ICP, UVP, brand identity, and financial setup', '🏁', '2025-01-01', '2025-01-07', 1),
('Week 2: Digital Presence', 'Website, marketing automation, and project management systems', '📱', '2025-01-08', '2025-01-14', 2),
('Week 3: Internal Systems', 'HR framework, culture documentation, and payroll setup', '👥', '2025-01-15', '2025-01-21', 3),
('Week 4: Launch Readiness', 'Client materials, final testing, and go-live preparation', '🎯', '2025-01-22', '2025-01-31', 4);

-- Create function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_deliverables_updated_at
  BEFORE UPDATE ON deliverables
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
