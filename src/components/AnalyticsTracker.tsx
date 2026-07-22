'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Generate or retrieve anonymous visitor ID from sessionStorage
function getVisitorId(): string {
  try {
    let id = sessionStorage.getItem('wanjey_visitor_id')
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      sessionStorage.setItem('wanjey_visitor_id', id)
    }
    return id
  } catch {
    return 'anon'
  }
}

function track(event_type: string, path: string, section?: string) {
  const visitor_id = getVisitorId()
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_type, path, section, visitor_id }),
  }).catch(() => {})
}

// Sections to track clicks on
const TRACKED_SECTIONS = [
  { selector: '#hero',                  label: 'Hero' },
  { selector: '#services',              label: 'Services' },
  { selector: '#upcoming-event',        label: 'Upcoming Event' },
  { selector: '#past-events',           label: 'Past Events' },
  { selector: '#our-process',           label: 'Our Process' },
  { selector: '#brands',                label: 'Brands Marquee' },
  { selector: '#contact',               label: 'Contact' },
  { selector: 'footer',                 label: 'Footer' },
  { selector: '[data-track]',           label: 'data-track' },
]

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPath = useRef<string>('')

  // Track page views on route changes
  useEffect(() => {
    if (pathname === lastPath.current) return
    lastPath.current = pathname
    track('page_view', pathname)
  }, [pathname])

  // Track clicks globally and attribute to the nearest tracked section
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target) return

      for (const { selector, label } of TRACKED_SECTIONS) {
        try {
          const section = target.closest(selector)
          if (section) {
            const sectionLabel =
              selector === '[data-track]'
                ? (section.getAttribute('data-track') ?? 'Unknown')
                : label
            track('click', pathname, sectionLabel)
            return
          }
        } catch {}
      }

      // Also track nav link clicks
      const link = target.closest('a')
      if (link && link.href) {
        try {
          const url = new URL(link.href)
          track('click', pathname, `Link: ${url.pathname}`)
        } catch {}
      }
    }

    document.addEventListener('click', handleClick, { passive: true })
    return () => document.removeEventListener('click', handleClick)
  }, [pathname])

  return null
}
