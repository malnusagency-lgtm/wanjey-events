import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// Hardcoded seed events — shown when the DB table doesn't exist yet
// Uses existing gallery images for immediate visual impact
export const SEED_PAST_EVENTS = [
  {
    id: 'seed-1',
    title: 'Big Voices Festival',
    category: 'Festival',
    description: 'A landmark music and lifestyle festival celebrating authentic African voices and millennial culture. Hundreds gathered for an unforgettable night of talent and energy.',
    image_url: '/assets/gallery/event-30.jpg',
    highlight_stat: '500+ Attendees',
    event_month_year: 'June 2023',
    display_order: 0,
  },
  {
    id: 'seed-2',
    title: 'The Don Effect',
    category: 'Brand Activation',
    description: 'An immersive brand experience that redefined how audiences engage with corporate storytelling. A seamless fusion of entertainment and brand strategy.',
    image_url: '/assets/gallery/event-12.jpg',
    highlight_stat: 'Sold Out',
    event_month_year: 'October 2023',
    display_order: 1,
  },
  {
    id: 'seed-3',
    title: 'Sunday Hangout',
    category: 'Lifestyle Event',
    description: 'An exclusive curated Sunday experience bringing together Nairobi\'s creatives, entrepreneurs, and tastemakers in a beautifully styled outdoor setting.',
    image_url: '/assets/gallery/event-31.jpg',
    highlight_stat: '200+ Guests',
    event_month_year: 'March 2024',
    display_order: 2,
  },
  {
    id: 'seed-4',
    title: 'Desagu Goat Eating',
    category: 'Corporate Dinner',
    description: 'A high-energy cultural dining experience that brought communities together in celebration of local cuisine, talent, and shared joy.',
    image_url: '/assets/gallery/event-50.jpg',
    highlight_stat: 'Viral Moment',
    event_month_year: 'August 2023',
    display_order: 3,
  },
]

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
      .from('past_events')
      .select('*')
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      return NextResponse.json({ events: SEED_PAST_EVENTS, seeded: true })
    }
    return NextResponse.json({ events: data, seeded: false })
  } catch {
    return NextResponse.json({ events: SEED_PAST_EVENTS, seeded: true })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = getSupabaseClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { data, error } = await supabase
      .from('past_events')
      .insert({
        title: body.title,
        category: body.category,
        description: body.description,
        image_url: body.image_url,
        highlight_stat: body.highlight_stat,
        event_month_year: body.event_month_year,
        display_order: body.display_order ?? 0,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Past event create error:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
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
      .from('past_events')
      .update({
        title: body.title,
        category: body.category,
        description: body.description,
        image_url: body.image_url,
        highlight_stat: body.highlight_stat,
        event_month_year: body.event_month_year,
        display_order: body.display_order,
      })
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Past event update error:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = getSupabaseClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const { error } = await supabase.from('past_events').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Past event delete error:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
