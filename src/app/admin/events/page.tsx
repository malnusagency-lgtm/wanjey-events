'use client'

import { useState, useEffect } from 'react'
import { CalendarDays, Save, Eye, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

type EventData = {
  id?: string
  title: string
  subtitle: string
  event_date: string
  save_the_date_text: string
  cta_text: string
}

const defaultEvent: EventData = {
  title: 'BIG VOICES FEST',
  subtitle: 'Season 2: Millennial Edition',
  event_date: '6TH JUNE',
  save_the_date_text: 'SAVE THE DATE',
  cta_text: 'Join the Movement',
}

export default function EventsPage() {
  const [form, setForm] = useState<EventData>(defaultEvent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) setForm(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = await res.json()
        setForm(data)
        toast.success('Event updated! Changes are live on your website.')
      } else {
        toast.error('Failed to save. Please try again.')
      }
    } catch {
      toast.error('Network error. Check your connection.')
    } finally {
      setSaving(false)
    }
  }

  const update = (field: keyof EventData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#8C1B11]" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Event Editor</h1>
          <p className="text-zinc-400 mt-1">Live-edit the upcoming event section on your homepage.</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors border border-zinc-700 px-4 py-2 rounded-lg"
        >
          <Eye size={16} /> Preview Site
        </Link>
      </div>

      {/* Live Preview Card */}
      <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Live Preview
        </div>
        <div className="relative h-48 bg-black flex flex-col items-center justify-center text-center p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          <div className="relative z-10">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Upcoming Event</p>
            <h2 className="font-serif text-3xl font-black text-white tracking-tighter">{form.title}</h2>
            <p className="text-white/70 text-sm font-bold uppercase tracking-widest mt-1">{form.subtitle}</p>
            <div className="mt-3 flex items-center gap-3 justify-center">
              <div className="h-px w-8 bg-white/30" />
              <span className="text-white font-serif text-2xl font-black">{form.event_date}</span>
              <div className="h-px w-8 bg-white/30" />
            </div>
            <p className="text-white/50 text-xs tracking-[0.3em] mt-1">{form.save_the_date_text}</p>
            <div className="mt-3 px-4 py-1.5 bg-[#8C1B11]/80 rounded-full text-white text-xs font-bold tracking-widest">
              {form.cta_text}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="p-2 bg-[#8C1B11]/10 rounded-lg">
            <CalendarDays size={20} className="text-[#8C1B11]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Event Details</h2>
            <p className="text-sm text-zinc-400">Changes go live instantly when you save.</p>
          </div>
        </div>

        <div className="p-6 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Event Title</label>
            <input
              value={form.title}
              onChange={update('title')}
              placeholder="e.g. BIG VOICES FEST"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#8C1B11] transition-colors text-lg font-bold"
            />
            <p className="text-xs text-zinc-500">This is the large headline on your homepage.</p>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Subtitle / Edition</label>
            <input
              value={form.subtitle}
              onChange={update('subtitle')}
              placeholder="e.g. Season 2: Millennial Edition"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#8C1B11] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Event Date</label>
            <input
              value={form.event_date}
              onChange={update('event_date')}
              placeholder="e.g. 6TH JUNE"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#8C1B11] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Date Label</label>
            <input
              value={form.save_the_date_text}
              onChange={update('save_the_date_text')}
              placeholder="e.g. SAVE THE DATE"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#8C1B11] transition-colors"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-zinc-300">Button Text</label>
            <input
              value={form.cta_text}
              onChange={update('cta_text')}
              placeholder="e.g. Join the Movement"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#8C1B11] transition-colors"
            />
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#8C1B11] hover:bg-[#a12015] disabled:opacity-60 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save & Publish Changes'}
          </button>
        </div>
    </div>
  )
}
