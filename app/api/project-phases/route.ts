import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/project-phases - Fetch all project phases
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch project phases
    const { data: phases, error } = await supabase
      .from('project_phases')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching project phases:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(phases, { status: 200 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


