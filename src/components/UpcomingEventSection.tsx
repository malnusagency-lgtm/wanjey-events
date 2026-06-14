'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import MagneticButton from './MagneticButton'
import { ArrowRight, MapPin, Clock } from 'lucide-react'
import AnimatedSection from './AnimatedSection'
import MediaModal from './MediaModal'
import BookingCTA3D from './BookingCTA3D'
import Link from 'next/link'
import { parseImageUrl } from '@/lib/utils'

type MediaItem = { id?: string; src: string; type: 'video' | 'image' }

type EventData = {
  title: string
  subtitle: string
  event_date: string
  save_the_date_text: string
  cta_text: string
  date_iso?: string
  location?: string
  no_event?: boolean
  booking_link?: string
}

function useCountdown(dateIso?: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0, expired: false })

  useEffect(() => {
    if (!dateIso) return
    const target = new Date(dateIso).getTime()
    const tick = () => {
      const diff = target - Date.now()
      if (diff <= 0) { setTimeLeft(t => ({ ...t, expired: true })); return }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
        expired: false,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [dateIso])

  return timeLeft
}

const UpcomingEventSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bgIndex, setBgIndex] = useState(0)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [bgVideos, setBgVideos] = useState<MediaItem[]>([])
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)

  // Gallery slideshow state for fallback
  const [galleryImages, setGalleryImages] = useState<string[]>([
    '/assets/gallery/event-30.jpg',
    '/assets/gallery/event-12.jpg',
    '/assets/gallery/event-31.jpg',
    '/assets/gallery/event-50.jpg',
    '/assets/gallery/event-64.jpg'
  ])
  const [galleryIndex, setGalleryIndex] = useState(0)

  const countdown = useCountdown(eventData?.date_iso)

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        let r = await fetch('/api/media?folder=upcoming')
        let items: MediaItem[] = []
        if (r.ok) {
          const data = await r.json()
          items = data.media?.map((item: any) => ({ type: item.type, src: item.url })) ?? []
        }
        
        // Fallback to legacy bigvoices folder if upcoming is empty
        if (items.length === 0) {
          const fallback = await fetch('/api/media?folder=bigvoices')
          if (fallback.ok) {
            const fallbackData = await fallback.json()
            items = fallbackData.media?.map((item: any) => ({ type: item.type, src: item.url })) ?? []
          }
        }

        setMediaItems(items)
        setBgVideos(items.filter((i: any) => i.type === 'video'))
      } catch {}
    }

    const fetchEvent = async () => {
      try {
        const r = await fetch('/api/events')
        if (r.ok) {
          const data = await r.json()
          if (data?.no_event || data?.is_active === false) {
            setEventData(null)
          } else {
            setEventData(data)
          }
        }
      } catch {}
      setLoading(false)
    }

    const fetchGallery = async () => {
      try {
        const r = await fetch('/api/media?folder=gallery')
        if (r.ok) {
          const data = await r.json()
          if (data?.media && data.media.length > 0) {
            setGalleryImages(data.media.map((item: any) => item.url))
          }
        }
      } catch {}
    }

    fetchMedia()
    fetchEvent()
    fetchGallery()
  }, [])

  useEffect(() => {
    if (bgVideos.length === 0) return
    const t = setInterval(() => setBgIndex(p => (p + 1) % bgVideos.length), 5000)
    return () => clearInterval(t)
  }, [bgVideos.length])

  // Gallery slideshow interval
  useEffect(() => {
    if (eventData) return
    if (galleryImages.length === 0) return
    const t = setInterval(() => setGalleryIndex(p => (p + 1) % galleryImages.length), 5000)
    return () => clearInterval(t)
  }, [galleryImages.length, eventData])

  const renderTitle = (title: string) => {
    const words = title.trim().split(/\s+/)
    if (words.length <= 1) return title
    const last = words.pop()
    return <>{words.join(' ')} <em className="italic font-light text-white">{last}</em></>
  }

  // Show nothing while loading to avoid flash
  if (loading) {
    return (
      <section className="relative h-[75vh] md:h-[95vh] w-full bg-[#130B07] flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </section>
    )
  }

  // No active event scheduled -> render minimal services listing with gallery slideshow
  if (!eventData) {
    return (
      <section className="relative min-h-[640px] h-[85vh] md:h-[95vh] w-full overflow-hidden bg-[#130B07]">
        {/* Gallery Slideshow Background */}
        <div className="absolute inset-0 z-0">
          {galleryImages.map((src, idx) => {
            const prevGalleryIndex = (galleryIndex === 0 ? galleryImages.length - 1 : galleryIndex - 1)
            const isActive = idx === galleryIndex
            const isPrev = idx === prevGalleryIndex
            return (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity transition-transform duration-[6000ms] ease-in-out will-change-[opacity,transform] transform-gpu ${
                  isActive 
                    ? 'opacity-100 z-20 scale-105 translate-x-1' 
                    : isPrev 
                      ? 'opacity-100 z-10 scale-100' 
                      : 'opacity-0 z-0 scale-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={parseImageUrl(src)}
                  alt="Gallery Background"
                  className="h-full w-full object-cover contrast-[1.02]"
                />
              </div>
            )
          })}
          {/* Clear, subtle vignette overlay for maximum image clarity and color vibrancy */}
          <div className="absolute inset-0 z-20 bg-black/25" />
        </div>

        {/* Minimal Services List Overlay */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-6 text-center max-w-4xl mx-auto">
          {/* Label */}
          <AnimatedSection delay={0.1}>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-accent/80 mb-3 sm:mb-4">
              ✦ Wanjey Events & Marketing ✦
            </p>
          </AnimatedSection>

          {/* Minimal Title */}
          <AnimatedSection delay={0.25}>
            <h2 className="font-serif text-2xl sm:text-5xl md:text-6xl font-black leading-tight text-white tracking-tighter uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              Crafting Premium Experiences
            </h2>
          </AnimatedSection>

          {/* Minimal Services Grid */}
          <AnimatedSection delay={0.4} className="mt-6 sm:mt-8 w-full max-w-2xl px-2">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-left">
              {[
                { title: "Corporate Events", desc: "Product launches, conferences & dinners." },
                { title: "Brand Activations", desc: "Experiential marketing & campaigns." },
                { title: "Digital Marketing", desc: "Social strategy & content production." },
                { title: "Event Amplification", desc: "Live coverage & influencer integration." }
              ].map((service, idx) => (
                <div key={idx} className="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10 bg-black/45 backdrop-blur-md hover:border-accent/40 transition-all duration-300 flex flex-col justify-center">
                  <h3 className="font-serif font-bold text-white text-[11px] sm:text-sm md:text-base uppercase tracking-wider">{service.title}</h3>
                  <p className="hidden sm:block text-white/60 text-xs mt-1 leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* CTAs */}
          <AnimatedSection delay={0.6} className="w-full max-w-md">
            <div className="mt-8 sm:mt-10 flex flex-row gap-3 sm:gap-4 justify-center items-center px-2">
              <Link href="/contact" className="flex-1">
                <MagneticButton intensity={20}>
                  <Button
                    size="lg"
                    className="w-full bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] px-3 sm:px-10 h-11 sm:h-14 text-[10px] sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] rounded-full border border-white/10 shadow-[0_0_50px_-5px_rgba(202,163,101,0.5)] transition-all duration-500"
                  >
                    Consult
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </MagneticButton>
              </Link>
              
              <Link href="/packages" className="flex-1">
                <MagneticButton intensity={15}>
                  <Button
                    size="lg"
                    className="w-full bg-white/10 text-white hover:bg-[#FFD6C5] hover:text-[#2D1A10] px-3 sm:px-10 h-11 sm:h-14 text-[10px] sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] rounded-full border border-white/10 backdrop-blur-sm transition-all duration-500"
                  >
                    Packages
                  </Button>
                </MagneticButton>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    )
  }

  const showCountdown = !!eventData.date_iso && !countdown.expired

  return (
    <>
      <section className="relative h-[75vh] md:h-[95vh] w-full overflow-hidden bg-[#130B07]">

        {/* ── Dynamic Background Videos ── */}
        <div className="absolute inset-0 z-0">
          {bgVideos.map((item, idx) => {
            const prevBgIndex = (bgIndex === 0 ? bgVideos.length - 1 : bgIndex - 1)
            const isActive = idx === bgIndex
            const isPrev = idx === prevBgIndex
            return (
              <div
                key={item.src}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out will-change-[opacity] ${
                  isActive 
                    ? 'opacity-100 z-20' 
                    : isPrev 
                      ? 'opacity-100 z-10' 
                      : 'opacity-0 z-0'
                }`}
              >
                <video
                  src={item.src}
                  autoPlay muted loop playsInline
                  preload={idx <= 1 ? 'auto' : 'none'}
                  className="h-full w-full object-cover contrast-[1.02]"
                />
              </div>
            )
          })}
          {/* Clear, subtle vignette overlay for maximum video clarity and color vibrancy */}
          <div className="absolute inset-0 z-20 bg-black/25" />
        </div>

        {/* ── Content Overlay ── */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-6 text-center">

          {/* UPCOMING label */}
          <AnimatedSection delay={0.1}>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-accent/80 mb-4 md:mb-6">
              ✦ Upcoming Event ✦
            </p>
          </AnimatedSection>

          {/* Event title */}
          <AnimatedSection delay={0.25}>
            <h2 className="font-serif text-4xl font-black leading-none text-white sm:text-7xl md:text-9xl tracking-tighter drop-shadow-2xl uppercase">
              {renderTitle(eventData.title)}
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <p className="mt-3 font-sans text-base font-black uppercase tracking-[0.2em] text-white/70 sm:text-xl drop-shadow-md text-balance">
              {eventData.subtitle}
            </p>
          </AnimatedSection>

          {/* Date block */}
          <AnimatedSection delay={0.5}>
            <div className="mt-6 md:mt-8 flex flex-col items-center">
              <div className="h-px w-20 mb-4"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(43 45% 55%), transparent)' }} />
              <span className="font-serif text-5xl font-black text-white sm:text-8xl md:text-[7rem] tracking-tighter drop-shadow-2xl uppercase leading-none">
                {eventData.event_date}
              </span>
              <span className="mt-2 text-xs font-bold uppercase tracking-[0.6em] text-white/60 sm:text-sm">
                {eventData.save_the_date_text}
              </span>
              <div className="h-px w-20 mt-4"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(43 45% 55%), transparent)' }} />
            </div>
          </AnimatedSection>

          {/* Location badge */}
          {eventData.location && (
            <AnimatedSection delay={0.55}>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
                <MapPin className="h-3 w-3 text-accent" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/70">{eventData.location}</span>
              </div>
            </AnimatedSection>
          )}

          {/* ── Countdown Timer ── */}
          {showCountdown && (
            <AnimatedSection delay={0.6}>
              <div className="mt-6 md:mt-8 flex items-center gap-3 md:gap-5">
                {[
                  { val: countdown.days, label: 'Days' },
                  { val: countdown.hours, label: 'Hrs' },
                  { val: countdown.mins, label: 'Min' },
                  { val: countdown.secs, label: 'Sec' },
                ].map(({ val, label }, i) => (
                  <div key={label} className="flex items-center gap-3 md:gap-5">
                    <div className="flex flex-col items-center">
                      <div
                        className="flex h-14 w-14 md:h-20 md:w-20 items-center justify-center rounded-xl font-serif font-black text-2xl md:text-4xl text-white"
                        style={{
                          background: 'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
                          border: '1px solid rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(20px)',
                        }}
                      >
                        {String(val).padStart(2, '0')}
                      </div>
                      <span className="mt-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{label}</span>
                    </div>
                    {i < 3 && <span className="font-serif text-2xl font-black text-accent/60 -mt-5">:</span>}
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* CTA Button */}
          <AnimatedSection delay={0.7}>
            <div className="mt-8 sm:mt-10">
              {eventData.booking_link ? (
                <Link href={eventData.booking_link} target="_blank" rel="noopener noreferrer">
                  <MagneticButton intensity={40}>
                    <Button
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] px-8 h-14 text-sm sm:px-16 sm:h-20 sm:text-xl font-black uppercase tracking-[0.3em] shadow-[0_0_60px_-5px_rgba(202,163,101,0.6)] transition-all duration-500 group rounded-full border border-white/10"
                    >
                      {eventData.cta_text || (eventData.booking_link?.includes('drive.google.com') ? 'View on Drive' : 'Get Tickets')}
                      <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </Button>
                  </MagneticButton>
                </Link>
              ) : (
                <MagneticButton intensity={40}>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] px-8 h-14 text-sm sm:px-16 sm:h-20 sm:text-xl font-black uppercase tracking-[0.3em] shadow-[0_0_60px_-5px_rgba(202,163,101,0.6)] transition-all duration-500 group rounded-full border border-white/10"
                  >
                    {eventData.cta_text || 'Join the Movement'}
                    <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Button>
                </MagneticButton>
              )}
            </div>
          </AnimatedSection>        </div>
      </section>

      <MediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={[...mediaItems]}
        bgVideos={bgVideos}
        title={eventData.title}
        subtitle={eventData.subtitle}
      />
    </>
  )
}

export default UpcomingEventSection
