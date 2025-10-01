import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Fetch team members directly from team_members table
    const { data: teamMembers, error } = await supabase
      .from('team_members')
      .select(`
        id,
        name,
        email,
        role,
        assigned_tasks,
        bio,
        phone,
        is_active,
        joined_at
      `)
      .eq('is_active', true)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      return NextResponse.json(
        { error: 'Failed to fetch team members' },
        { status: 500 }
      );
    }

    // Transform the data to match expected format
    const transformedTeamMembers = teamMembers?.map(member => ({
      id: member.id,
      name: member.name || 'Unknown',
      email: member.email || '',
      role: member.role,
      tasks: member.assigned_tasks || '',
      avatar_url: null, // No avatar for now
      bio: member.bio || '',
      phone: member.phone || '',
      is_active: member.is_active,
      joined_at: member.joined_at
    })) || [];

    return NextResponse.json(transformedTeamMembers);
  } catch (error) {
    console.error('Error in team members API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
