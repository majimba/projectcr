-- Optional: Fix Supabase Security Advisor Warnings
-- These are best-practice improvements, not critical issues

-- Fix 1: Add search_path to notification functions
-- This makes the functions more secure by explicitly setting the schema

ALTER FUNCTION public.create_task_assignment_notification 
SET search_path = public, pg_temp;

ALTER FUNCTION public.create_task_completion_notification 
SET search_path = public, pg_temp;

ALTER FUNCTION public.cleanup_old_notifications 
SET search_path = public, pg_temp;

ALTER FUNCTION public.handle_new_user 
SET search_path = public, pg_temp;

ALTER FUNCTION public.handle_updated_at 
SET search_path = public, pg_temp;

-- Verify the changes
SELECT 
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments,
    p.prosecdef as security_definer,
    p.proconfig as search_path_set
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN (
    'create_task_assignment_notification',
    'create_task_completion_notification',
    'cleanup_old_notifications',
    'handle_new_user',
    'handle_updated_at'
);

-- Note: Leaked Password Protection and MFA settings must be configured
-- in Supabase Dashboard → Authentication → Settings
-- These cannot be fixed via SQL

