-- Migration: Link team_members with profiles
-- This allows team members to be automatically linked when they sign up

-- Update team_members to link with existing profiles based on email
UPDATE team_members tm
SET profile_id = p.id
FROM profiles p
WHERE tm.email = p.email
  AND tm.profile_id IS NULL;

-- Create a function to automatically link team_member when a user signs up
CREATE OR REPLACE FUNCTION public.link_team_member_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if there's a team_member with this email waiting to be linked
  UPDATE team_members
  SET profile_id = NEW.id
  WHERE email = NEW.email
    AND profile_id IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically link team member when profile is created
DROP TRIGGER IF EXISTS on_profile_created_link_team_member ON public.profiles;
CREATE TRIGGER on_profile_created_link_team_member
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.link_team_member_on_signup();

-- Also update when profile email changes
CREATE OR REPLACE FUNCTION public.link_team_member_on_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  -- If email changed, check if there's a team_member waiting to be linked
  IF NEW.email <> OLD.email OR OLD.email IS NULL THEN
    UPDATE team_members
    SET profile_id = NEW.id
    WHERE email = NEW.email
      AND (profile_id IS NULL OR profile_id = NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for profile updates
DROP TRIGGER IF EXISTS on_profile_updated_link_team_member ON public.profiles;
CREATE TRIGGER on_profile_updated_link_team_member
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.link_team_member_on_profile_update();

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_team_members_profile_id ON team_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);

