import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // First, try to fetch team members with profiles (for users who have signed up)
    const { data: teamMembersWithProfiles, error: profileError } = await supabase
      .from('team_members')
      .select(`
        id,
        profile_id,
        role,
        assigned_tasks,
        is_active,
        joined_at,
        name,
        email,
        bio,
        phone,
        profiles:profile_id (
          full_name,
          email,
          avatar_url,
          phone,
          bio
        )
      `)
      .eq('is_active', true)
      .order('joined_at', { ascending: true });

    if (profileError) {
      console.error('Error fetching team members:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch team members' },
        { status: 500 }
      );
    }

    // Transform the data to match expected format
    // Prioritize profile data over team_members data when profile exists
    const transformedTeamMembers = teamMembersWithProfiles?.map(member => {
      const profile = member.profiles as any;
      
      return {
        id: member.id,
        profile_id: member.profile_id,
        // Use profile data if available, otherwise fall back to team_members data
        name: profile?.full_name || member.name || 'Unknown',
        email: profile?.email || member.email || '',
        role: member.role,
        tasks: member.assigned_tasks || '',
        avatar_url: profile?.avatar_url || null,
        bio: profile?.bio || member.bio || '',
        phone: profile?.phone || member.phone || '',
        is_active: member.is_active,
        joined_at: member.joined_at,
        has_profile: !!profile // Flag to indicate if user has signed up
      };
    }) || [];

    return NextResponse.json(transformedTeamMembers);
  } catch (error) {
    console.error('Error in team members API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
