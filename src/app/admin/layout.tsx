'use client'

import { useState } from 'react'
import Link from 'next/link'
import { logout } from '@/app/login/actions'
import {
  Menu,
  X,
  LayoutDashboard,
  Image as ImageIcon,
  Settings,
  LogOut,
  Mail,
  CalendarDays,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const navLinks = [
  { href: '/admin',          label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/admin/leads',    label: 'Leads Inbox',   icon: Mail },
  { href: '/admin/events',   label: 'Event Editor',  icon: CalendarDays },
  { href: '/admin/media',    label: 'Media Manager', icon: ImageIcon },
  { href: '/admin/settings', label: 'Settings',      icon: Settings },
]

const navLinkClass =
  'flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">

      {/* ─── Desktop Sidebar (md+) ─────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 border-r border-zinc-800 bg-zinc-900/50 flex-col">
        <div className="p-6 border-b border-zinc-800">
          <Link href="/admin" className="text-xl font-bold text-white flex items-center gap-2">
            Wanjey<span className="text-[#8C1B11]">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={navLinkClass}>
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ─── Right-hand column: mobile header + main content ──────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Mobile Top Bar (hidden on md+) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
          <Link href="/admin" className="text-lg font-bold text-white">
            Wanjey<span className="text-[#8C1B11]">Admin</span>
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* ─── Mobile Slide-out Drawer ───────────────────────────────── */}
        {/* Backdrop */}
        {mobileOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Drawer panel */}
        <div
          className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col transform transition-transform duration-300 ease-in-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between p-5 border-b border-zinc-800">
            <Link
              href="/admin"
              className="text-xl font-bold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Wanjey<span className="text-[#8C1B11]">Admin</span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* Drawer nav links */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={20} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Drawer sign-out */}
          <div className="p-4 border-t border-zinc-800">
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* ─── Main Content ──────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>

      </div>
    </div>
  )
}
