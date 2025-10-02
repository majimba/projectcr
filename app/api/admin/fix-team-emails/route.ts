import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// Admin endpoint to fix team member emails (one-time use)
export async function POST() {
  try {
    const supabase = await createClient()
    
    // Get current user and verify they're authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Email updates mapping
    const updates = [
      { name: 'Chawana Masaka', email: 'chawana.maseka@gmail.com' },
      { name: 'Maynard Muchangwe', email: 'maynarjfilms@gmail.com' },
      { name: 'Emmanuel Kapili', email: 'risendream@gmail.com' },
      { name: 'Munsanje Hachamba', email: 'pandazm76@gmail.com' },
      { name: 'Delphine Mwape', email: 'delphinemwape2@gmail.com' },
    ]

    const results = []
    let successCount = 0
    let errorCount = 0

    // Update each team member
    for (const { name, email } of updates) {
      const { data, error } = await supabase
        .from('team_members')
        .update({ email })
        .eq('name', name)
        .select()

      if (error) {
        console.error(`Error updating ${name}:`, error)
        errorCount++
        results.push({ name, email, status: 'error', error: error.message })
      } else if (data && data.length > 0) {
        successCount++
        results.push({ name, email, status: 'success' })
      } else {
        errorCount++
        results.push({ name, email, status: 'not_found' })
      }
    }

    // Fetch updated team members to verify
    const { data: teamMembers } = await supabase
      .from('team_members')
      .select('name, email')
      .order('joined_at', { ascending: true })

    return NextResponse.json({
      success: successCount > 0,
      message: `Updated ${successCount} team members${errorCount > 0 ? `, ${errorCount} errors` : ''}`,
      results,
      currentTeamMembers: teamMembers
    }, { status: 200 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

