'use client'

import { useState, useEffect } from 'react'
import {
  CalendarDays, Save, Eye, Loader2, Plus, Trash2,
  Edit3, X, ChevronUp, ChevronDown, ImageIcon, AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

type PastEvent = {
  id: string
  title: string
  category: string
  description: string
  image_url: string
  highlight_stat: string
  event_month_year: string
  display_order: number
}

type UpcomingEventForm = {
  id?: string
  title: string
  subtitle: string
  event_date: string
  date_iso: string
  location: string
  save_the_date_text: string
  cta_text: string
}

const defaultUpcoming: UpcomingEventForm = {
  title: 'BIG VOICES FEST',
  subtitle: 'Season 2: Millennial Edition',
  event_date: '6TH JUNE',
  date_iso: '',
  location: '',
  save_the_date_text: 'SAVE THE DATE',
  cta_text: 'Join the Movement',
}

const CATEGORIES = ['Festival', 'Brand Activation', 'Corporate Dinner', 'Lifestyle Event', 'Concert', 'Product Launch', 'Other']

const inputCls = "w-full px-4 py-3 bg-white border border-accent/25 rounded-lg text-[#2D1A10] placeholder-zinc-400 focus:outline-none focus:border-[#8C1B11] focus:ring-1 focus:ring-[#8C1B11]/20 transition-colors text-sm font-semibold"

function PastEventForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: Partial<PastEvent>
  onSave: (data: Omit<PastEvent, 'id' | 'display_order'>) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    category: initial?.category ?? 'Festival',
    description: initial?.description ?? '',
    image_url: initial?.image_url ?? '',
    highlight_stat: initial?.highlight_stat ?? '',
    event_month_year: initial?.event_month_year ?? '',
  })

  const field = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Event Title *</label>
          <input value={form.title} onChange={field('title')} placeholder="e.g. Big Voices Festival"
            className={inputCls} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Category</label>
          <select value={form.category} onChange={field('category')}
            className={inputCls}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Month & Year</label>
          <input value={form.event_month_year} onChange={field('event_month_year')} placeholder="e.g. June 2023"
            className={inputCls} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Highlight Stat</label>
          <input value={form.highlight_stat} onChange={field('highlight_stat')} placeholder="e.g. 500+ Attendees, Sold Out, Viral Moment"
            className={inputCls} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
            <ImageIcon size={12} className="text-accent" /> Event Photo URL
          </label>
          <input value={form.image_url} onChange={field('image_url')} placeholder="https://... or /assets/gallery/event-30.jpg"
            className={inputCls + ' font-mono'} />
          {form.image_url && (
            <div className="relative h-28 rounded-lg overflow-hidden border border-accent/15 mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Short Description</label>
          <textarea value={form.description} onChange={field('description')} rows={3}
            placeholder="A brief description of the event and what made it special..."
            className={inputCls + ' resize-none font-normal'} />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button onClick={() => onSave(form)} disabled={saving || !form.title}
          className="flex items-center gap-2 bg-[#8C1B11] hover:bg-[#a12015] disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-bold transition-colors text-sm shadow-md">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving…' : 'Save Event'}
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-6 py-2.5 rounded-lg font-bold transition-colors text-sm border border-zinc-200">
          <X size={15} /> Cancel
        </button>
      </div>
    </div>
  )
}

export default function EventsPage() {
  // Upcoming event state
  const [upcomingForm, setUpcomingForm] = useState<UpcomingEventForm>(defaultUpcoming)
  const [loadingUpcoming, setLoadingUpcoming] = useState(true)
  const [savingUpcoming, setSavingUpcoming] = useState(false)

  // Past events state
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([])
  const [loadingPast, setLoadingPast] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [savingPast, setSavingPast] = useState(false)
  const [isTableMissing, setIsTableMissing] = useState(false)

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  // Load upcoming event
  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => { if (data && !data.no_event && !data.error) setUpcomingForm(data) })
      .catch(console.error)
      .finally(() => setLoadingUpcoming(false))
  }, [])

  // Load past events
  useEffect(() => {
    fetch('/api/past-events')
      .then(r => r.json())
      .then(data => {
        if (data?.events) setPastEvents(data.events)
        if (data?.table_missing) setIsTableMissing(true)
      })
      .catch(console.error)
      .finally(() => setLoadingPast(false))
  }, [])

  const updateUpcoming = (field: keyof UpcomingEventForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setUpcomingForm(p => ({ ...p, [field]: e.target.value }))

  const saveUpcoming = async () => {
    setSavingUpcoming(true)
    try {
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(upcomingForm),
      })
      if (res.ok) {
        const data = await res.json()
        setUpcomingForm(data)
        toast.success('Upcoming event updated! Live on your site.')
      } else {
        const errData = await res.json().catch(() => ({}))
        toast.error(errData.error || 'Failed to save. Please try again.')
      }
    } catch { toast.error('Network error.') }
    finally { setSavingUpcoming(false) }
  }

  const addPastEvent = async (data: Omit<PastEvent, 'id' | 'display_order'>) => {
    setSavingPast(true)
    try {
      const res = await fetch('/api/past-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, display_order: pastEvents.length }),
      })
      if (res.ok) {
        const newEvent = await res.json()
        setPastEvents(p => [...p, newEvent])
        setShowAddForm(false)
        setIsTableMissing(false)
        toast.success('Past event added!')
      } else {
        const errData = await res.json().catch(() => ({}))
        toast.error(errData.error || 'Failed to add event.')
      }
    } catch { toast.error('Network error.') }
    finally { setSavingPast(false) }
  }

  const updatePastEvent = async (id: string, data: Omit<PastEvent, 'id' | 'display_order'>) => {
    setSavingPast(true)
    const ev = pastEvents.find(e => e.id === id)
    try {
      const res = await fetch('/api/past-events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data, display_order: ev?.display_order ?? 0 }),
      })
      if (res.ok) {
        const updated = await res.json()
        setPastEvents(p => p.map(e => e.id === id ? updated : e))
        setEditingId(null)
        toast.success('Event updated!')
      } else {
        const errData = await res.json().catch(() => ({}))
        toast.error(errData.error || 'Failed to update.')
      }
    } catch { toast.error('Network error.') }
    finally { setSavingPast(false) }
  }

  const deletePastEvent = async (id: string) => {
    if (!confirm('Delete this past event?')) return
    try {
      const res = await fetch(`/api/past-events?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPastEvents(p => p.filter(e => e.id !== id))
        toast.success('Event deleted.')
      } else {
        const errData = await res.json().catch(() => ({}))
        toast.error(errData.error || 'Failed to delete.')
      }
    } catch { toast.error('Network error.') }
  }

  const moveEvent = (id: string, dir: 'up' | 'down') => {
    const idx = pastEvents.findIndex(e => e.id === id)
    if (dir === 'up' && idx === 0) return
    if (dir === 'down' && idx === pastEvents.length - 1) return
    const newList = [...pastEvents]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    ;[newList[idx], newList[swap]] = [newList[swap], newList[idx]]
    setPastEvents(newList)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#2D1A10]">Event Editor</h1>
          <p className="text-zinc-500 mt-1 text-sm">Manage upcoming and past events shown on your homepage.</p>
        </div>
        <Link href="/" target="_blank"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-[#8C1B11] transition-colors border border-accent/25 hover:bg-accent/5 px-4 py-2 rounded-lg font-semibold bg-white/40 shadow-sm">
          <Eye size={16} /> Preview
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/60 rounded-xl border border-accent/25 w-fit shadow-sm">
        {(['upcoming', 'past'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === tab ? 'bg-[#8C1B11] text-white shadow-md' : 'text-zinc-500 hover:text-[#2D1A10]'}`}>
            {tab === 'upcoming' ? '📅 Upcoming Event' : '🏆 Past Events'}
          </button>
        ))}
      </div>

      {/* ── UPCOMING EVENT TAB ── */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          {loadingUpcoming ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="animate-spin text-[#8C1B11]" />
            </div>
          ) : (
            <>
              {/* Live Preview */}
              <div className="bg-white/60 rounded-xl border border-accent/25 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-accent/15 text-xs font-bold text-zinc-400 uppercase tracking-wider bg-white/30">Live Preview</div>
                <div className="relative h-44 bg-black flex flex-col items-center justify-center text-center p-6">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
                  <div className="relative z-10">
                    <p className="text-white/40 text-[9px] uppercase tracking-[0.4em] mb-1">✦ Upcoming Event ✦</p>
                    <h2 className="font-serif text-3xl font-black text-white tracking-tighter">{upcomingForm.title}</h2>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-1">{upcomingForm.subtitle}</p>
                    <div className="mt-3 flex items-center gap-3 justify-center">
                      <div className="h-px w-8 bg-white/35" />
                      <span className="text-white font-serif text-2xl font-black">{upcomingForm.event_date}</span>
                      <div className="h-px w-8 bg-white/35" />
                    </div>
                    {upcomingForm.location && <p className="text-white/50 text-[9px] mt-1">📍 {upcomingForm.location}</p>}
                    <div className="mt-3 px-4 py-1 bg-[#8C1B11]/80 rounded-full text-white text-[9px] font-black tracking-widest inline-block shadow-md">
                      {upcomingForm.cta_text}
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit form */}
              <div className="bg-white/60 border border-accent/25 rounded-xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-accent/15 flex items-center gap-3 bg-white/30">
                  <div className="p-2 bg-[#8C1B11]/10 rounded-lg text-[#8C1B11]"><CalendarDays size={18} /></div>
                  <div>
                    <h2 className="font-bold text-[#2D1A10] font-serif">Upcoming Event Details</h2>
                    <p className="text-xs text-zinc-500">Changes go live instantly when saved.</p>
                  </div>
                </div>
                <div className="p-5 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Event Title</label>
                    <input value={upcomingForm.title} onChange={updateUpcoming('title')} className={inputCls + ' text-lg font-bold'} placeholder="BIG VOICES FEST" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Subtitle</label>
                    <input value={upcomingForm.subtitle} onChange={updateUpcoming('subtitle')} className={inputCls} placeholder="Season 2: Millennial Edition" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Display Date</label>
                    <input value={upcomingForm.event_date} onChange={updateUpcoming('event_date')} className={inputCls} placeholder="6TH JUNE" />
                    <p className="text-[10px] text-zinc-400">The large date shown on screen</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Date Label</label>
                    <input value={upcomingForm.save_the_date_text} onChange={updateUpcoming('save_the_date_text')} className={inputCls} placeholder="SAVE THE DATE" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Actual Date (for countdown) <span className="text-zinc-400 normal-case font-normal">optional</span>
                    </label>
                    <input type="datetime-local" value={upcomingForm.date_iso} onChange={updateUpcoming('date_iso')} className={inputCls} />
                    <p className="text-[10px] text-zinc-400">Shows a live countdown timer when set</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Location <span className="text-zinc-400 normal-case font-normal">optional</span>
                    </label>
                    <input value={upcomingForm.location} onChange={updateUpcoming('location')} className={inputCls} placeholder="e.g. Nairobi, Kenya" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Button Text</label>
                    <input value={upcomingForm.cta_text} onChange={updateUpcoming('cta_text')} className={inputCls} placeholder="Join the Movement" />
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <button onClick={saveUpcoming} disabled={savingUpcoming}
                    className="flex items-center gap-2 bg-[#8C1B11] hover:bg-[#a12015] disabled:opacity-60 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg text-sm">
                    {savingUpcoming ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {savingUpcoming ? 'Saving…' : 'Save & Publish'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── PAST EVENTS TAB ── */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {/* DB notice if table is missing */}
          {isTableMissing && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/35 bg-amber-500/5 p-4 text-sm text-amber-900 shadow-sm">
              <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-amber-800">Database Table Missing</p>
                <p className="text-amber-700/80 mt-1 text-xs leading-relaxed font-semibold">
                  The `past_events` table does not exist in your database. Run the script in{' '}
                  <code className="bg-zinc-100 px-1.5 py-0.5 rounded font-mono text-[11px] text-[#2D1A10]">scripts/create-past-events-table.sql</code> or execute this query in your{' '}
                  <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline text-amber-900 hover:text-amber-950 font-bold">Supabase SQL Editor</a> to create it:
                </p>
                <code className="mt-2 block rounded-lg bg-amber-950/5 border border-amber-500/20 px-3 py-2 text-[10px] text-amber-900 leading-relaxed font-mono whitespace-pre overflow-x-auto">{`CREATE TABLE past_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  category text DEFAULT 'Event',
  description text,
  image_url text,
  highlight_stat text,
  event_month_year text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE past_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON past_events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON past_events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON past_events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON past_events FOR DELETE USING (auth.role() = 'authenticated');`}</code>
              </div>
            </div>
          )}


          {/* Add button */}
          {!showAddForm && (
            <button onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 border border-dashed border-accent/30 hover:border-[#8C1B11] bg-white/40 hover:bg-[#8C1B11]/5 text-[#2D1A10]/70 hover:text-[#8C1B11] px-5 py-3 rounded-xl font-bold transition-all duration-200 text-sm w-full justify-center group shadow-sm">
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" /> Add Past Event
            </button>
          )}

          {/* Add form */}
          {showAddForm && (
            <div className="bg-white/60 border border-accent/25 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-[#2D1A10] mb-4 flex items-center gap-2 font-serif"><Plus size={16} className="text-[#8C1B11]" /> New Past Event</h3>
              <PastEventForm onSave={addPastEvent} onCancel={() => setShowAddForm(false)} saving={savingPast} />
            </div>
          )}

          {/* Past events list */}
          {loadingPast ? (
            <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-[#8C1B11]" /></div>
          ) : pastEvents.length === 0 ? (
            <div className="text-center text-zinc-500 py-16">No past events yet. Add your first one above.</div>
          ) : (
            <div className="space-y-3">
              {pastEvents.map((ev, idx) => (
                <div key={ev.id} className="bg-white/60 border border-accent/20 hover:border-accent/35 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
                  {editingId === ev.id ? (
                    <div className="p-5">
                      <h3 className="font-bold text-[#2D1A10] mb-4 flex items-center gap-2 font-serif"><Edit3 size={15} className="text-[#8C1B11]" /> Edit: {ev.title}</h3>
                      <PastEventForm initial={ev} onSave={(data) => updatePastEvent(ev.id, data)} onCancel={() => setEditingId(null)} saving={savingPast} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 p-4">
                      {/* Order controls */}
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveEvent(ev.id, 'up')} disabled={idx === 0}
                          className="p-1 text-zinc-400 hover:text-[#8C1B11] disabled:opacity-20 transition-colors">
                          <ChevronUp size={14} />
                        </button>
                        <button onClick={() => moveEvent(ev.id, 'down')} disabled={idx === pastEvents.length - 1}
                          className="p-1 text-zinc-400 hover:text-[#8C1B11] disabled:opacity-20 transition-colors">
                          <ChevronDown size={14} />
                        </button>
                      </div>
                      {/* Image thumbnail */}
                      {ev.image_url && (
                        <div className="h-14 w-20 rounded-lg overflow-hidden bg-zinc-100 border border-accent/15 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-[#2D1A10] text-sm truncate">{ev.title}</span>
                          <span className="text-[10px] text-accent font-bold uppercase tracking-wider shrink-0 bg-accent/10 px-2 py-0.5 rounded-full">{ev.category}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
                          <span>{ev.event_month_year}</span>
                          {ev.highlight_stat && <span className="text-[#8C1B11] font-semibold">🏆 {ev.highlight_stat}</span>}
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => setEditingId(ev.id)}
                          className="p-2 text-zinc-500 hover:text-[#8C1B11] hover:bg-[#8C1B11]/5 rounded-lg transition-colors">
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => deletePastEvent(ev.id)}
                          className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
