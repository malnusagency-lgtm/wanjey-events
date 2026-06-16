'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from './AnimatedSection'
import { ArrowLeft, ArrowRight, Trophy, Calendar, X } from 'lucide-react'
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
  const [isDriveOpen, setIsDriveOpen] = useState(false)
  const [bgIndex, setBgIndex] = useState(0)
  const [iframeLoading, setIframeLoading] = useState(true)
  const [isPhotosLoading, setIsPhotosLoading] = useState(false)
  const [photosMediaItems, setPhotosMediaItems] = useState<any[]>([])
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false)

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

  // Background slideshow interval (only runs if we have custom uploaded folder images)
  useEffect(() => {
    if (uploadedImages.length <= 1) return
    const t = setInterval(() => {
      setBgIndex(prev => (prev + 1) % uploadedImages.length)
    }, 5000)
    return () => clearInterval(t)
  }, [uploadedImages.length])

  // Preload background images to prevent loading flashes (SSR safe)
  useEffect(() => {
    if (typeof window === 'undefined' || bgSources.length === 0) return
    bgSources.forEach(src => {
      const img = new window.Image()
      img.src = parseImageUrl(src)
    })
  }, [bgSources])

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

  // Google Drive Embed Parser
  const parseDriveEmbedUrl = (url: string | null | undefined): string | null => {
    if (!url) return null
    const cleanUrl = url.trim()
    
    // Check for any google domain links
    if (!cleanUrl.includes('google.')) return null

    // Extract ID from /d/ID or /folders/ID or id=ID
    const dMatch = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (dMatch && dMatch[1]) {
      const id = dMatch[1]
      // Document, Spreadsheets, Presentations, etc.
      if (cleanUrl.includes('/document/')) return `https://docs.google.com/document/d/${id}/preview`
      if (cleanUrl.includes('/spreadsheets/')) return `https://docs.google.com/spreadsheets/d/${id}/preview`
      if (cleanUrl.includes('/presentation/')) return `https://docs.google.com/presentation/d/${id}/preview`
      return `https://drive.google.com/file/d/${id}/preview`
    }

    const folderMatch = cleanUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/)
    if (folderMatch && folderMatch[1]) {
      return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#grid`
    }

    const idMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (idMatch && idMatch[1]) {
      const id = idMatch[1]
      if (cleanUrl.includes('folders') || cleanUrl.includes('embeddedfolderview')) {
        return `https://drive.google.com/embeddedfolderview?id=${id}#grid`
      }
      return `https://drive.google.com/file/d/${id}/preview`
    }

    return null
  }

  const isPhotosLink = (url: string | null | undefined): boolean => {
    if (!url) return false
    const cleanUrl = url.trim()
    return cleanUrl.includes('photos.app.goo.gl') || cleanUrl.includes('photos.google.com')
  }

  const handlePhotosClick = async (url: string) => {
    setIsPhotosLoading(true)
    try {
      const response = await fetch(`/api/media/google-photos?url=${encodeURIComponent(url)}`)
      if (response.ok) {
        const data = await response.json()
        if (data?.success && data.media && data.media.length > 0) {
          setPhotosMediaItems(data.media)
          setIsPhotosModalOpen(true)
        } else {
          window.open(url, '_blank')
        }
      } else {
        window.open(url, '_blank')
      }
    } catch {
      window.open(url, '_blank')
    }
    setIsPhotosLoading(false)
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
  const activeDriveEmbedUrl = parseDriveEmbedUrl(activeEvent?.cta_link)

  return (
    <section
      className="relative h-[75vh] md:h-[95vh] w-full overflow-hidden bg-[#130B07]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Dynamic Background Images ── */}
      <div className="absolute inset-0 z-0">
        {bgSources.map((src, idx) => {
          const currentBgIndex = uploadedImages.length > 0
            ? bgIndex % (uploadedImages.length || 1)
            : currentIndex
          const prevBgIndex = uploadedImages.length > 0
            ? (currentBgIndex === 0 ? uploadedImages.length - 1 : currentBgIndex - 1)
            : (currentIndex === 0 ? events.length - 1 : currentIndex - 1)
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
              key={src + '_' + idx}
              className={`absolute inset-0 transition duration-[2000ms] ease-in-out will-change-[opacity,transform] transform-gpu ${
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
                loading="eager"
                fetchPriority={isActive ? 'high' : 'low'}
                className="h-full w-full object-cover contrast-[1.02]"
              />
            </div>
          )
        })}
        {/* Clear, subtle vignette overlay for maximum image clarity and color vibrancy */}
        <div className="absolute inset-0 z-20 bg-black/25" />
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
            className="flex flex-col items-center max-w-5xl relative z-10"
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
            <h2 className="font-serif text-3xl font-black leading-none text-white sm:text-5xl md:text-7xl tracking-tighter drop-shadow-2xl uppercase">
              {renderTitle(activeEvent.title)}
            </h2>

            {/* Date Block */}
            <div className="mt-4 md:mt-6 flex flex-col items-center">
              <div className="h-px w-20 mb-3"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(43 45% 55%), transparent)' }} />
              <span className="font-serif text-3xl font-black text-white sm:text-5xl md:text-[4.5rem] tracking-tighter drop-shadow-2xl uppercase leading-none">
                {activeEvent.event_month_year}
              </span>
              <p className="mt-3 font-sans text-xs sm:text-sm md:text-base font-medium text-white/80 max-w-xl mx-auto leading-relaxed drop-shadow-md text-balance">
                {activeEvent.description}
              </p>
              <div className="h-px w-20 mt-3"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(43 45% 55%), transparent)' }} />
            </div>

            {/* Explore Gallery / Section Media Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Always show the local media modal button */}
              <MagneticButton intensity={30}>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] px-8 h-14 text-sm sm:px-12 sm:h-16 font-black uppercase tracking-[0.2em] shadow-[0_0_60px_-5px_rgba(202,163,101,0.5)] transition-all duration-500 group rounded-full border border-white/10"
                >
                  Explore More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Button>
              </MagneticButton>

              {/* If a video/google link is provided, show the redirect button */}
              {activeEvent.cta_link && (
                isPhotosLink(activeEvent.cta_link) ? (
                  <MagneticButton intensity={20}>
                    <Button
                      onClick={() => handlePhotosClick(activeEvent.cta_link!)}
                      disabled={isPhotosLoading}
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] px-8 h-14 text-sm sm:px-12 sm:h-16 font-black uppercase tracking-[0.2em] shadow-[0_0_60px_-5px_rgba(202,163,101,0.5)] transition-all duration-500 group rounded-full border border-white/10"
                    >
                      {isPhotosLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2D1A10] border-t-transparent" />
                          Scraping...
                        </span>
                      ) : (
                        activeEvent.cta_text || 'Watch Video'
                      )}
                      {!isPhotosLoading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />}
                    </Button>
                  </MagneticButton>
                ) : activeDriveEmbedUrl ? (
                  <MagneticButton intensity={20}>
                    <Button
                      onClick={() => {
                        setIframeLoading(true)
                        setIsDriveOpen(true)
                      }}
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] px-8 h-14 text-sm sm:px-12 sm:h-16 font-black uppercase tracking-[0.2em] shadow-[0_0_60px_-5px_rgba(202,163,101,0.5)] transition-all duration-500 group rounded-full border border-white/10"
                    >
                      {activeEvent.cta_text || 'Watch Video'}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </Button>
                  </MagneticButton>
                ) : (
                  <Link 
                    href={activeEvent.cta_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MagneticButton intensity={20}>
                      <Button
                        size="lg"
                        className="bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] px-8 h-14 text-sm sm:px-12 sm:h-16 font-black uppercase tracking-[0.2em] shadow-[0_0_60px_-5px_rgba(202,163,101,0.5)] transition-all duration-500 group rounded-full border border-white/10"
                      >
                        {activeEvent.cta_text || 'Watch Videos'}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                      </Button>
                    </MagneticButton>
                  </Link>
                )
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
        title={activeEvent?.title}
        subtitle={activeEvent?.category}
      />

      <MediaModal
        isOpen={isPhotosModalOpen}
        onClose={() => setIsPhotosModalOpen(false)}
        items={photosMediaItems}
        bgVideos={[]}
        title={activeEvent?.title}
        subtitle="Shared Google Photos Album"
      />

      {/* ── Google Drive Embed Modal ── */}
      <AnimatePresence>
        {isDriveOpen && activeDriveEmbedUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-5xl h-[80vh] rounded-2xl border border-accent/30 bg-[#160E0A] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-[#2D1A10] border-b border-accent/20 flex justify-between items-center z-10">
                <span className="font-serif text-xs sm:text-sm font-bold text-white uppercase tracking-widest text-left">
                  Event Media • Google Drive Player
                </span>
                <button
                  onClick={() => setIsDriveOpen(false)}
                  className="text-white/60 hover:text-white transition-colors p-1"
                  aria-label="Close Player"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Iframe Container */}
              <div className="flex-1 bg-black relative">
                {iframeLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#130B07] z-30">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-10 w-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/60 animate-pulse">Loading Media...</span>
                    </div>
                  </div>
                )}
                <iframe
                  src={activeDriveEmbedUrl}
                  onLoad={() => setIframeLoading(false)}
                  className="w-full h-full border-none"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
