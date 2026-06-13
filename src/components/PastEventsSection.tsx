'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import { ArrowLeft, ArrowRight, Trophy, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MagneticButton from './MagneticButton'
import { parseImageUrl } from '@/lib/utils'
import MediaModal from './MediaModal'

type PastEvent = {
  id: string
  title: string
  category: string
  description: string
  image_url: string
  highlight_stat: string
  event_month_year: string
  display_order: number
  cta_link?: string
  cta_text?: string
}

export default function PastEventsSection() {
  const [events, setEvents] = useState<PastEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Media Modal state for past events section media
  const [mediaItems, setMediaItems] = useState<any[]>([])
  const [bgVideos, setBgVideos] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bgIndex, setBgIndex] = useState(0)

  // Fetch past events media
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const r = await fetch('/api/media?folder=past')
        if (r.ok) {
          const data = await r.json()
          const items = data.media?.map((item: any) => ({ type: item.type, src: item.url })) ?? []
          setMediaItems(items)
          setBgVideos(items.filter((i: any) => i.type === 'video'))
        }
      } catch {}
    }
    fetchMedia()
  }, [])

  // Fetch past events
  useEffect(() => {
    fetch('/api/past-events')
      .then(r => r.json())
      .then(data => {
        if (data?.events) {
          const sorted = [...data.events].sort((a, b) => a.display_order - b.display_order)
          setEvents(sorted)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Auto-slide effect
  useEffect(() => {
    if (events.length <= 1 || hovered) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % events.length)
    }, 6000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [events.length, hovered])

  const uploadedImages = mediaItems.filter(i => i.type === 'image').map(i => i.src)
  const bgSources = uploadedImages.length > 0 
    ? uploadedImages 
    : events.map(ev => ev.image_url)

  // Background slideshow interval
  useEffect(() => {
    if (bgSources.length <= 1) return
    const t = setInterval(() => {
      setBgIndex(prev => (prev + 1) % bgSources.length)
    }, 5000)
    return () => clearInterval(t)
  }, [bgSources.length])

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? events.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % events.length)
  }

  const renderTitle = (title: string) => {
    const words = title.trim().split(/\s+/)
    if (words.length <= 1) return title
    const last = words.pop()
    return <>{words.join(' ')} <em className="italic font-light text-accent">{last}</em></>
  }

  if (loading) {
    return (
      <section className="relative h-[75vh] md:h-[95vh] w-full bg-[#130B07] flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </section>
    )
  }

  if (events.length === 0) return null

  const activeEvent = events[currentIndex]

  return (
    <section
      className="relative h-[75vh] md:h-[95vh] w-full overflow-hidden bg-[#130B07]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Dynamic Background Images ── */}
      <div className="absolute inset-0 z-0">
        {bgSources.map((src, idx) => {
          const currentBgIndex = bgIndex % (bgSources.length || 1)
          const prevBgIndex = bgSources.length > 0 
            ? (currentBgIndex === 0 ? bgSources.length - 1 : currentBgIndex - 1)
            : 0
          const isActive = idx === currentBgIndex
          const isPrev = idx === prevBgIndex
          
          // Cinematic pan/zoom directions based on index
          const translateClasses = [
            'translate-x-1 translate-y-0.5',
            '-translate-x-1 -translate-y-0.5',
            'translate-x-0.5 -translate-y-1',
            '-translate-x-0.5 translate-y-1',
            'translate-x-1 -translate-y-1',
          ]
          const trans = translateClasses[idx % translateClasses.length]
          
          return (
            <div
              key={src}
              className={`absolute inset-0 transition-all duration-[6000ms] ease-in-out transform ${
                isActive 
                  ? `opacity-100 z-20 scale-105 ${trans}` 
                  : isPrev 
                    ? 'opacity-100 z-10 scale-100' 
                    : 'opacity-0 z-0 scale-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={parseImageUrl(src)}
                alt="Past Event Background"
                className="h-full w-full object-cover contrast-[1.02]"
              />
            </div>
          )
        })}
        {/* Gold & Chocolate Gradient Overlay */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#130B07]/90 via-[#CAA365]/35 to-[#130B07]/60" />
        {/* Gold Radial Vignette */}
        <div className="absolute inset-0 z-20"
          style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 50%, transparent 40%, rgba(202, 163, 101, 0.35) 100%)' }} />
      </div>

      {/* ── Content Overlay ── */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeEvent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center max-w-5xl"
          >
            {/* Label */}
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-accent/80 mb-4 md:mb-6">
              ✦ Past Event Highlight ✦
            </p>

            {/* Category and Stat badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                {activeEvent.category}
              </span>
              {activeEvent.highlight_stat && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-accent backdrop-blur-sm">
                  <Trophy className="h-3 w-3" />
                  {activeEvent.highlight_stat}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="font-serif text-4xl font-black leading-none text-white sm:text-7xl md:text-9xl tracking-tighter drop-shadow-2xl uppercase">
              {renderTitle(activeEvent.title)}
            </h2>

            {/* Date Block */}
            <div className="mt-6 md:mt-8 flex flex-col items-center">
              <div className="h-px w-20 mb-4"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(43 45% 55%), transparent)' }} />
              <span className="font-serif text-4xl font-black text-white sm:text-6xl md:text-[5.5rem] tracking-tighter drop-shadow-2xl uppercase leading-none">
                {activeEvent.event_month_year}
              </span>
              <p className="mt-4 font-sans text-sm md:text-base font-medium text-white/70 max-w-xl mx-auto leading-relaxed drop-shadow-md text-balance">
                {activeEvent.description}
              </p>
              <div className="h-px w-20 mt-4"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(43 45% 55%), transparent)' }} />
            </div>

            {/* Explore Gallery / Section Media Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              {activeEvent.cta_link ? (
                <>
                  <Link 
                    href={activeEvent.cta_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MagneticButton intensity={30}>
                      <Button
                        size="lg"
                        className="bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] px-8 h-14 text-sm sm:px-12 sm:h-16 font-black uppercase tracking-[0.2em] shadow-[0_0_60px_-5px_rgba(202,163,101,0.5)] transition-all duration-500 group rounded-full border border-white/10"
                      >
                        {activeEvent.cta_text || (activeEvent.cta_link.includes('drive.google.com') ? 'View on Drive' : 'Open Link')}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                      </Button>
                    </MagneticButton>
                  </Link>

                  <MagneticButton intensity={20}>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      size="lg"
                      className="bg-white/10 text-white hover:bg-[#FFD6C5] hover:text-[#2D1A10] px-8 h-14 text-sm sm:px-12 sm:h-16 font-black uppercase tracking-[0.2em] transition-all duration-500 rounded-full border border-white/10 backdrop-blur-sm"
                    >
                      View More Media
                    </Button>
                  </MagneticButton>
                </>
              ) : (
                <MagneticButton intensity={40}>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] px-8 h-14 text-sm sm:px-16 sm:h-20 sm:text-xl font-black uppercase tracking-[0.3em] shadow-[0_0_60px_-5px_rgba(202,163,101,0.6)] transition-all duration-500 group rounded-full border border-white/10"
                  >
                    {activeEvent.cta_text || 'Explore Gallery'}
                    <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Button>
                </MagneticButton>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Carousel Navigation Controls ── */}
        {events.length > 1 && (
          <div className="absolute inset-x-4 md:inset-x-8 bottom-6 z-40 flex items-center justify-between pointer-events-none">
            {/* Slide counter indicator */}
            <span className="text-xs font-bold tracking-[0.25em] text-white/50 uppercase bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 select-none pointer-events-auto">
              {String(currentIndex + 1).padStart(2, '0')} / {String(events.length).padStart(2, '0')}
            </span>

            {/* Prev/Next buttons */}
            <div className="flex items-center gap-3 pointer-events-auto">
              <button
                onClick={handlePrev}
                className="p-3.5 rounded-full border border-white/10 bg-black/35 hover:bg-[#8C1B11] text-white/80 hover:text-white shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
                aria-label="Previous event"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-3.5 rounded-full border border-white/10 bg-black/35 hover:bg-[#8C1B11] text-white/80 hover:text-white shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
                aria-label="Next event"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <MediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={[...mediaItems]}
        bgVideos={bgVideos}
      />
    </section>
  )
}
