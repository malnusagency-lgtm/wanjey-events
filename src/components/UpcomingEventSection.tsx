'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import MagneticButton from './MagneticButton'
import { ArrowRight, MapPin, X } from 'lucide-react'
import AnimatedSection from './AnimatedSection'
import MediaModal from './MediaModal'
import Link from 'next/link'
import { parseImageUrl } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [isDriveOpen, setIsDriveOpen] = useState(false)
  const [bgIndex, setBgIndex] = useState(0)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [iframeLoading, setIframeLoading] = useState(true)
  const [isPhotosLoading, setIsPhotosLoading] = useState(false)
  const [photosMediaItems, setPhotosMediaItems] = useState<MediaItem[]>([])
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false)
  const [activeDriveUrl, setActiveDriveUrl] = useState<string | null>(null)

  // Gallery slideshow state for fallback
  const [galleryImages, setGalleryImages] = useState<string[]>([
    '/assets/gallery/event-30.jpg',
    '/assets/gallery/event-12.jpg',
    '/assets/gallery/event-31.jpg',
    '/assets/gallery/event-50.jpg',
    '/assets/gallery/event-64.jpg'
  ])

  const countdown = useCountdown(eventData?.date_iso)

  // Google Drive Embed Parser (Country-Agnostic)
  const parseDriveEmbedUrl = (url: string | null | undefined): string | null => {
    if (!url) return null
    const cleanUrl = url.trim()
    
    // Check for any google domain links (e.g. google.com, google.co.ke, google.co.uk)
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

  // Helper to parse multiple comma-separated CTA links and texts
  const getCtaButtons = (ctaLink: string | null | undefined, ctaText: string | null | undefined) => {
    if (!ctaLink) return []
    const links = ctaLink.split(',').map(l => l.trim()).filter(Boolean)
    const texts = ctaText ? ctaText.split(',').map(t => t.trim()).filter(Boolean) : []
    
    return links.map((link, idx) => {
      const text = texts[idx] || ''
      const isPhotos = isPhotosLink(link)
      const driveUrl = parseDriveEmbedUrl(link)
      
      let defaultLabel = 'Get Tickets'
      if (isPhotos) {
        defaultLabel = 'View Photos'
      } else if (driveUrl) {
        defaultLabel = 'Open Drive'
      } else if (link.includes('youtube.com') || link.includes('youtu.be')) {
        defaultLabel = 'Watch Highlights'
      } else if (link.includes('instagram.com')) {
        defaultLabel = 'View Reel'
      }
      
      return {
        link,
        text: text || defaultLabel,
        isPhotos,
        driveUrl
      }
    })
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

  // Combined background sources for continuous image/video transitions
  const rawBgSources: MediaItem[] = mediaItems.length > 0 
    ? [...mediaItems, ...galleryImages.map(src => ({ type: 'image' as const, src }))]
    : galleryImages.map(src => ({ type: 'image' as const, src }))

  // De-duplicate background sources to avoid duplicate key issues in React and prevent transition restarts
  const bgSourcesMap = new Map<string, MediaItem>()
  rawBgSources.forEach(item => {
    if (!bgSourcesMap.has(item.src)) {
      bgSourcesMap.set(item.src, item)
    }
  })
  const bgSources = Array.from(bgSourcesMap.values())

  // Slideshow interval for backgrounds
  useEffect(() => {
    if (bgSources.length <= 1) return
    const t = setInterval(() => setBgIndex(p => (p + 1) % bgSources.length), 6000)
    return () => clearInterval(t)
  }, [bgSources.length])

  // Preload only the next upcoming image to prevent visual flashes without overloading the network
  useEffect(() => {
    if (typeof window === 'undefined' || bgSources.length <= 1) return
    const currentBgIndex = bgIndex % (bgSources.length || 1)
    const nextBgIndex = (currentBgIndex + 1) % bgSources.length
    const nextItem = bgSources[nextBgIndex]
    if (nextItem && nextItem.type === 'image') {
      const img = new Image()
      img.src = parseImageUrl(nextItem.src)
    }
  }, [bgIndex, bgSources])

  const renderTitle = (title: string) => {
    const words = title.trim().split(/\s+/)
    if (words.length <= 1) return title
    const last = words.pop()
    return <>{words.join(' ')} <em className="italic font-light text-white">{last}</em></>
  }

  // Render Background slideshow markup
  const renderBackgroundSlideshow = () => (
    <div className="absolute inset-0 z-0">
      {bgSources.map((item, idx) => {
        const currentBgIndex = bgIndex % (bgSources.length || 1)
        const prevBgIndex = bgSources.length > 0 
          ? (currentBgIndex === 0 ? bgSources.length - 1 : currentBgIndex - 1)
          : 0
        const isActive = idx === currentBgIndex
        const isPrev = idx === prevBgIndex

        if (!isActive && !isPrev) return null

        // Pan/zoom Ken Burns styles based on index
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
            key={item.src}
            className={`absolute inset-0 transition duration-[3000ms] ease-in-out will-change-[opacity,transform] transform-gpu ${
              isActive 
                ? `opacity-100 z-20 scale-105 ${trans}` 
                : isPrev 
                  ? 'opacity-100 z-10 scale-100' 
                  : 'opacity-0 z-0 scale-100'
            }`}
          >
            {item.type === 'video' ? (
              <video
                src={item.src}
                autoPlay muted loop playsInline
                preload={idx === currentBgIndex || idx === prevBgIndex ? 'auto' : 'none'}
                className="h-full w-full object-cover contrast-[1.02]"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={parseImageUrl(item.src)}
                alt="Event Background"
                loading="eager"
                fetchPriority={isActive ? 'high' : 'low'}
                className="h-full w-full object-cover contrast-[1.02]"
              />
            )}
          </div>
        )
      })}
      {/* Dark vignette overlay for text legibility and color contrast */}
      <div className="absolute inset-0 z-20 bg-black/45" />
    </div>
  )

  // Minimal Services overlay (shown if no eventData after loading completes)
  const renderNoEventContent = () => (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-6 text-center max-w-4xl mx-auto">
      {/* "Book Us" CTA replacing the text label */}
      <AnimatedSection delay={0.1}>
        <Link href="/packages" className="inline-block mb-3 sm:mb-4">
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] px-5 h-9 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10 shadow-[0_0_30px_rgba(202,163,101,0.4)] transition-all duration-500 hover:scale-105 active:scale-95"
          >
            Book Us
          </Button>
        </Link>
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
            <Link href="/services" key={idx} className="block group h-full">
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-accent/25 bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] transition-all duration-300 flex flex-col justify-center h-full hover:scale-[1.02] active:scale-[0.98] shadow-lg">
                <h3 className="font-serif font-bold text-[11px] sm:text-sm md:text-base uppercase tracking-wider">{service.title}</h3>
                <p className="hidden sm:block text-xs mt-1 leading-relaxed opacity-90">{service.desc}</p>
              </div>
            </Link>
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
  )

  // Active Event overlay (shown if eventData is loaded)
  const renderActiveEventContent = () => {
    if (!eventData) return null
    const showCountdown = !!eventData.date_iso && !countdown.expired

    return (
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        {/* "Book Us" CTA replacing the text label */}
        <AnimatedSection delay={0.1}>
          <Link href="/packages" className="inline-block mb-4 md:mb-6">
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] px-5 h-9 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10 shadow-[0_0_30px_rgba(202,163,101,0.4)] transition-all duration-500 hover:scale-105 active:scale-95"
            >
              Book Us
            </Button>
          </Link>
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

        {/* CTA Buttons — Display main ticket link AND consult/packages dashboard links */}
        <AnimatedSection delay={0.7}>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2 w-full max-w-2xl">
            {eventData.booking_link ? (
              getCtaButtons(eventData.booking_link, eventData.cta_text).map((btn, idx) => {
                if (btn.isPhotos) {
                  return (
                    <MagneticButton key={idx} intensity={40} className="flex-1 w-full">
                      <Button
                        onClick={() => handlePhotosClick(btn.link)}
                        disabled={isPhotosLoading}
                        size="lg"
                        className="w-full bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] h-12 sm:h-14 text-xs sm:text-sm font-black uppercase tracking-[0.2em] shadow-[0_0_50px_-5px_rgba(202,163,101,0.5)] transition-all duration-500 group rounded-full border border-white/10"
                      >
                        {isPhotosLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2D1A10] border-t-transparent" />
                            Scraping Album...
                          </span>
                        ) : (
                          btn.text
                        )}
                        {!isPhotosLoading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />}
                      </Button>
                    </MagneticButton>
                  )
                }

                if (btn.driveUrl) {
                  return (
                    <MagneticButton key={idx} intensity={40} className="flex-1 w-full">
                      <Button
                        onClick={() => {
                          setIframeLoading(true)
                          setActiveDriveUrl(btn.driveUrl)
                          setIsDriveOpen(true)
                        }}
                        size="lg"
                        className="w-full bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] h-12 sm:h-14 text-xs sm:text-sm font-black uppercase tracking-[0.2em] shadow-[0_0_50px_-5px_rgba(202,163,101,0.5)] transition-all duration-500 group rounded-full border border-white/10"
                      >
                        {btn.text}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                      </Button>
                    </MagneticButton>
                  )
                }

                return (
                  <Link key={idx} href={btn.link} target="_blank" rel="noopener noreferrer" className="flex-1 w-full">
                    <MagneticButton intensity={40}>
                      <Button
                        size="lg"
                        className="w-full bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] h-12 sm:h-14 text-xs sm:text-sm font-black uppercase tracking-[0.2em] shadow-[0_0_50px_-5px_rgba(202,163,101,0.5)] transition-all duration-500 group rounded-full border border-white/10"
                      >
                        {btn.text}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                      </Button>
                    </MagneticButton>
                  </Link>
                )
              })
            ) : (
              <MagneticButton intensity={40} className="flex-1 w-full">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="w-full bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] h-12 sm:h-14 text-xs sm:text-sm font-black uppercase tracking-[0.2em] shadow-[0_0_50px_-5px_rgba(202,163,101,0.5)] transition-all duration-500 group rounded-full border border-white/10"
                >
                  {eventData.cta_text || 'Join the Movement'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Button>
              </MagneticButton>
            )}

            <Link href="/contact" className="flex-1 w-full">
              <MagneticButton intensity={20}>
                <Button
                  size="lg"
                  className="w-full bg-white/10 text-white hover:bg-[#FFD6C5] hover:text-[#2D1A10] h-12 sm:h-14 text-xs sm:text-sm font-black uppercase tracking-[0.2em] rounded-full border border-white/10 backdrop-blur-sm transition-all duration-500"
                >
                  Consult
                </Button>
              </MagneticButton>
            </Link>

            <Link href="/packages" className="flex-1 w-full">
              <MagneticButton intensity={15}>
                <Button
                  size="lg"
                  className="w-full bg-white/10 text-white hover:bg-[#FFD6C5] hover:text-[#2D1A10] h-12 sm:h-14 text-xs sm:text-sm font-black uppercase tracking-[0.2em] rounded-full border border-white/10 backdrop-blur-sm transition-all duration-500"
                >
                  Packages
                </Button>
              </MagneticButton>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    )
  }

  return (
    <>
      <section className="relative min-h-[640px] h-[85vh] md:h-[95vh] w-full overflow-hidden bg-[#130B07]">
        {/* Background slideshow renders immediately */}
        {renderBackgroundSlideshow()}

        {/* Content fades in once data loading is complete */}
        <AnimatePresence mode="wait">
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute inset-0 z-30 flex items-center justify-center"
            >
              {eventData ? renderActiveEventContent() : renderNoEventContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <MediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={[...mediaItems]}
        bgVideos={mediaItems.filter(i => i.type === 'video')}
        title={eventData?.title || 'Wanjey'}
        subtitle={eventData?.subtitle || 'Events & Marketing'}
      />

      <MediaModal
        isOpen={isPhotosModalOpen}
        onClose={() => setIsPhotosModalOpen(false)}
        items={photosMediaItems}
        bgVideos={[]}
        title={eventData?.title || 'Wanjey'}
        subtitle="Shared Google Photos Album"
      />

      {/* ── Google Drive Embed Modal ── */}
      <AnimatePresence>
        {isDriveOpen && activeDriveUrl && (
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
                  onClick={() => {
                    setIsDriveOpen(false)
                    setActiveDriveUrl(null)
                  }}
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
                  src={activeDriveUrl}
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
    </>
  )
}

export default UpcomingEventSection
