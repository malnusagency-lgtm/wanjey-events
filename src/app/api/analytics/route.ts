import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

// POST — Record an analytics event (page view, click, etc.)
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { event_type, path, section, visitor_id } = body
    if (!event_type || !path) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { error } = await supabase.from('analytics_events').insert({
      event_type,
      path,
      section: section ?? null,
      visitor_id: visitor_id ?? null,
    })

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    // Silently fail — analytics should never break the site
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

// GET — Return aggregated stats for the dashboard
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Last 30 days range
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch all events in the last 30 days
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false })

    if (error) throw error

    const allEvents = events ?? []

    // Total page views
    const pageViews = allEvents.filter(e => e.event_type === 'page_view').length

    // Unique visitors (by visitor_id)
    const uniqueVisitors = new Set(
      allEvents.filter(e => e.visitor_id).map(e => e.visitor_id)
    ).size

    // Page breakdown
    const pageCounts: Record<string, number> = {}
    allEvents
      .filter(e => e.event_type === 'page_view')
      .forEach(e => {
        pageCounts[e.path] = (pageCounts[e.path] ?? 0) + 1
      })
    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Section / click breakdown
    const sectionCounts: Record<string, number> = {}
    allEvents
      .filter(e => e.event_type === 'click' && e.section)
      .forEach(e => {
        sectionCounts[e.section] = (sectionCounts[e.section] ?? 0) + 1
      })
    const topSections = Object.entries(sectionCounts)
      .map(([section, count]) => ({ section, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Daily page views for chart (last 7 days)
    const daily: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      daily[d.toISOString().slice(0, 10)] = 0
    }
    allEvents
      .filter(e => e.event_type === 'page_view')
      .forEach(e => {
        const day = e.created_at.slice(0, 10)
        if (day in daily) daily[day]++
      })
    const dailyChart = Object.entries(daily).map(([date, count]) => ({ date, count }))

    return NextResponse.json({
      pageViews,
      uniqueVisitors,
      topPages,
      topSections,
      dailyChart,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
