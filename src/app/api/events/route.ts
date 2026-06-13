import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('upcoming_event')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      return new Response(JSON.stringify({ no_event: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=15, stale-while-revalidate=45',
        },
      });
    }
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=15, stale-while-revalidate=45',
      },
    });
  } catch {
    return new Response(JSON.stringify({ no_event: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=15, stale-while-revalidate=45',
      },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
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
        booking_link: body.booking_link || null,
        is_active: body.is_active !== undefined ? body.is_active : true,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Event update error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update event', details: error }, { status: 500 })
  }
}
