'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import { ArrowRight, Trophy } from 'lucide-react'

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

function EventCard({
  event,
  size = 'normal',
  index,
}: {
  event: PastEvent
  size?: 'feature' | 'normal' | 'compact'
  index: number
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setTilt({
      x: ((e.clientY - rect.top) / rect.height - 0.5) * -10,
      y: ((e.clientX - rect.left) / rect.width - 0.5) * 10,
    })
  }

  const heightClass =
    size === 'feature' ? 'h-[460px] md:h-[580px]'
    : size === 'compact' ? 'h-[200px] md:h-[260px]'
    : 'h-[280px] md:h-[340px]'

  // Category pill color
  const catColor =
    event.category === 'Festival' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    : event.category === 'Brand Activation' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    : event.category === 'Corporate Dinner' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    : 'bg-accent/20 text-accent border-accent/30'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      style={{
        transform: hovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
          : 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
        transition: 'transform 0.25s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${heightClass} w-full rounded-2xl overflow-hidden cursor-pointer group`}
    >
      {/* Image */}
      <Image
        src={event.image_url}
        alt={event.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-all duration-500 group-hover:from-black/95 group-hover:via-black/50" />

      {/* Gold border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none"
        style={{
          boxShadow: hovered
            ? 'inset 0 0 0 1.5px hsl(43 45% 55% / 0.6), 0 0 40px -10px hsl(43 45% 55% / 0.4)'
            : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      />

      {/* Top row — Category + Stat */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${catColor}`}>
          {event.category}
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider"
          style={{
            background: 'linear-gradient(135deg, hsl(43 65% 52%), hsl(43 45% 42%))',
            color: '#1a1000',
          }}
        >
          <Trophy className="h-2.5 w-2.5" />
          {event.highlight_stat}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/70 mb-1.5">
          {event.event_month_year}
        </p>
        <h3
          className={`font-serif font-black text-white leading-tight tracking-tight transition-colors duration-300 group-hover:text-accent ${
            size === 'feature' ? 'text-3xl md:text-4xl' : size === 'compact' ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
          }`}
        >
          {event.title}
        </h3>
        {size !== 'compact' && (
          <p className="mt-2 text-xs md:text-sm text-white/50 leading-relaxed line-clamp-2 group-hover:text-white/70 transition-colors">
            {event.description}
          </p>
        )}
        {/* Hover reveal arrow */}
        <div className={`mt-3 flex items-center gap-1.5 text-accent/0 group-hover:text-accent transition-all duration-300 translate-y-2 group-hover:translate-y-0 ${size === 'compact' ? 'hidden' : ''}`}>
          <span className="text-xs font-bold uppercase tracking-widest">View Highlights</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </motion.div>
  )
}

export default function PastEventsSection() {
  const [events, setEvents] = useState<PastEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/past-events')
      .then(r => r.json())
      .then(data => {
        if (data?.events) setEvents(data.events)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="relative py-16 w-full" style={{ background: '#060606' }}>
        <div className="container flex items-center justify-center h-64">
          <div className="h-10 w-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      </section>
    )
  }

  if (events.length === 0) return null

  const [feature, ...rest] = events
  const secondary = rest.slice(0, 2)
  const extras = rest.slice(2)

  return (
    <section className="relative w-full overflow-hidden py-14 md:py-20" style={{ background: '#060606' }}>

      {/* Ambient orb */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 800, height: 400, background: 'radial-gradient(ellipse, hsl(43 45% 40% / 0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }}
      />

      <div className="container relative z-10">

        {/* Section header */}
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-accent/60 mb-4">
            ✦ Our Legacy ✦
          </p>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">
            Events We&apos;ve{' '}
            <em className="not-italic text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, hsl(43 65% 65%), hsl(43 45% 45%))' }}>
              Delivered
            </em>
          </h2>
          <p className="mt-5 text-sm md:text-base text-white/40 max-w-xl mx-auto leading-relaxed font-medium">
            Every event is a story of trust, precision, and unforgettable moments. Here&apos;s a glimpse of what we&apos;ve built.
          </p>
          <div className="mx-auto mt-8 h-px w-24"
            style={{ background: 'linear-gradient(90deg, transparent, hsl(43 45% 55%), transparent)' }} />
        </AnimatedSection>

        {/* ── Desktop Asymmetric Editorial Grid ── */}
        <div className="hidden md:grid grid-cols-5 gap-4 lg:gap-5">
          {/* Feature card — 2 columns, full height */}
          <div className="col-span-2 row-span-2">
            {feature && <EventCard event={feature} size="feature" index={0} />}
          </div>

          {/* Secondary cards — 3 columns, 2 rows */}
          {secondary.map((ev, i) => (
            <div key={ev.id} className="col-span-3">
              <EventCard event={ev} size="normal" index={i + 1} />
            </div>
          ))}

          {/* Extra cards in bottom row */}
          {extras.length > 0 && (
            <div className={`col-span-3 grid grid-cols-${Math.min(extras.length, 3)} gap-4 lg:gap-5`}>
              {extras.slice(0, 3).map((ev, i) => (
                <EventCard key={ev.id} event={ev} size="compact" index={secondary.length + i + 1} />
              ))}
            </div>
          )}
        </div>

        {/* ── Mobile Horizontal Scroll ── */}
        <div className="md:hidden -mx-4 px-4">
          <div
            className="flex gap-4 overflow-x-auto pb-4"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
          >
            {events.map((ev, i) => (
              <div
                key={ev.id}
                className="flex-shrink-0"
                style={{ width: '82vw', scrollSnapAlign: 'center' }}
              >
                <EventCard event={ev} size={i === 0 ? 'feature' : 'normal'} index={i} />
              </div>
            ))}
          </div>
          {/* Scroll hint */}
          <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-widest text-white/20">
            Swipe to explore →
          </p>
        </div>

        {/* Bottom CTA */}
        <AnimatedSection delay={0.3}>
          <div className="mt-12 md:mt-16 text-center">
            <Link href="/gallery">
              <button
                className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
              >
                View Full Gallery
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </AnimatedSection>

      </div>
    </section>
  )
}
