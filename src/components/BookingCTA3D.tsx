'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Calendar, Users, Trophy, Zap, Star } from 'lucide-react'
import MagneticButton from './MagneticButton'

const services = [
  'Corporate Events',
  'Brand Activations',
  'Luxury Picnics',
  'Festivals & Concerts',
  'Wedding Experiences',
  'Influencer Campaigns',
]

const stats = [
  { icon: Trophy, value: '50+', label: 'Events' },
  { icon: Users, value: '100+', label: 'Clients' },
  { icon: Star, value: '3+', label: 'Years' },
  { icon: Zap, value: '24/7', label: 'Support' },
]

export default function BookingCTA3D() {
  const [svcIdx, setSvcIdx] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setInterval(() => setSvcIdx(p => (p + 1) % services.length), 2800)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      })
    }
    const el = containerRef.current
    el?.addEventListener('mousemove', handleMouse)
    return () => el?.removeEventListener('mousemove', handleMouse)
  }, [])

  const cardRotateX = -mousePos.y * 6
  const cardRotateY = mousePos.x * 6

  return (
    <section
      ref={containerRef}
      className="relative h-[75vh] md:h-[95vh] w-full overflow-hidden flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse 120% 100% at 50% 0%, #0e0b04 0%, #020202 60%)' }}
    >
      {/* ── Ambient Orbs ── */}
      <motion.div
        className="pointer-events-none absolute"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 700, height: 700, top: '-20%', left: '-10%',
          background: 'radial-gradient(circle, hsl(43 45% 40% / 0.5) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)' }}
      />
      <motion.div
        className="pointer-events-none absolute"
        animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{ width: 600, height: 600, bottom: '-15%', right: '-5%',
          background: 'radial-gradient(circle, hsl(43 60% 35% / 0.4) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(90px)' }}
      />
      <motion.div
        className="pointer-events-none absolute"
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{ width: 400, height: 400, top: '30%', left: '60%',
          background: 'radial-gradient(circle, hsl(43 45% 50% / 0.3) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)' }}
      />

      {/* ── Floating geometric frames ── */}
      <motion.div
        className="pointer-events-none absolute border border-white/5 rounded-full"
        style={{ width: 500, height: 500, top: '50%', left: '50%',
          x: '-50%', y: '-50%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="pointer-events-none absolute border border-accent/10 rounded-full"
        style={{ width: 700, height: 700, top: '50%', left: '50%',
          x: '-50%', y: '-50%' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      />
      {/* Rotating diamond */}
      <motion.div
        className="pointer-events-none absolute border border-accent/20"
        style={{ width: 120, height: 120, top: '12%', right: '12%', rotate: 45 }}
        animate={{ rotate: [45, 225, 45] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute border border-white/10"
        style={{ width: 80, height: 80, bottom: '15%', left: '10%', rotate: 45 }}
        animate={{ rotate: [45, -135, 45] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Particle dots ── */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full bg-accent/40"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ── Central 3D Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          transform: `perspective(1200px) rotateX(${cardRotateX}deg) rotateY(${cardRotateY}deg)`,
          transition: 'transform 0.12s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className="relative z-10 w-full max-w-xl md:max-w-2xl px-4"
      >
        {/* Card glow border */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, hsl(43 45% 55% / 0.4), transparent 50%, hsl(43 45% 55% / 0.2))',
            padding: 1,
            borderRadius: 24,
          }}
        >
          <div className="w-full h-full rounded-3xl" style={{ background: '#020202' }} />
        </div>

        {/* Card content */}
        <div
          className="relative rounded-3xl px-8 py-10 md:px-14 md:py-14 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Inner shimmer */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, hsl(43 45% 55% / 0.05) 0%, transparent 60%)',
            }}
          />

          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-accent/70 mb-6"
          >
            No Events Scheduled Right Now
          </motion.p>

          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.0] uppercase"
          >
            Let&apos;s Build<br />
            <em className="not-italic text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, hsl(43 65% 65%), hsl(43 45% 45%))' }}>
              Your Event
            </em>
          </motion.h2>

          {/* Animated service type */}
          <div className="mt-5 h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={svcIdx}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.4 }}
                className="font-sans text-sm md:text-base font-bold uppercase tracking-[0.2em] text-white/50"
              >
                {services[svcIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mx-auto my-8 h-px w-24 origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, hsl(43 45% 55%), transparent)' }}
          />

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-6 md:gap-10 mb-10"
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="h-4 w-4 text-accent mb-1" />
                <span className="font-serif text-xl md:text-2xl font-black text-white">{value}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <MagneticButton intensity={35}>
              <Link href="/contact">
                <button className="group relative inline-flex items-center gap-3 rounded-full px-8 py-4 md:px-12 md:py-5 font-black uppercase tracking-[0.2em] text-sm md:text-base text-accent-foreground transition-all duration-500 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, hsl(43 65% 52%), hsl(43 45% 42%))',
                    boxShadow: '0 0 60px -10px hsl(43 45% 55% / 0.7), 0 20px 40px -15px hsl(43 45% 40% / 0.4)',
                  }}
                >
                  {/* Button shimmer */}
                  <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
                  Book a Consultation
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Sub-CTA */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-5 text-xs text-white/25 font-medium"
          >
            Or call us at{' '}
            <a href="tel:+254790381039" className="text-accent/60 hover:text-accent transition-colors">
              +254 790 381039
            </a>
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
