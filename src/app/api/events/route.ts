import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

function getSupabaseClient(cookieStore: any) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  )
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = getSupabaseClient(cookieStore)
    const { data, error } = await supabase
      .from('upcoming_event')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      // Return explicit no_event flag so the UI can show the booking CTA
      return NextResponse.json({ no_event: true })
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ no_event: true })
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = getSupabaseClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { data, error } = await supabase
      .from('upcoming_event')
      .upsert({
        id: body.id,
        title: body.title,
        subtitle: body.subtitle,
        event_date: body.event_date,
        date_iso: body.date_iso || null,
        location: body.location || null,
        save_the_date_text: body.save_the_date_text,
        cta_text: body.cta_text,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Event update error:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}
