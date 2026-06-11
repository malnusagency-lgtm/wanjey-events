'use client'

import { useState } from 'react'
import Link from 'next/link'
import { logout } from '@/app/login/actions'
import {
  Menu, X, LayoutDashboard,
  Image as ImageIcon, Settings, LogOut, Mail, CalendarDays,
} from 'lucide-react'

const navLinks = [
  { href: '/admin',          label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/admin/leads',    label: 'Leads Inbox',   icon: Mail },
  { href: '/admin/events',   label: 'Event Editor',  icon: CalendarDays },
  { href: '/admin/media',    label: 'Media Manager', icon: ImageIcon },
  { href: '/admin/settings', label: 'Settings',      icon: Settings },
]

const linkCls =
  'flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors'

export default function AdminMobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar — hidden on md+ */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <Link href="/admin" className="text-lg font-bold text-white">
          Wanjey<span className="text-[#8C1B11]">Admin</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <Link
            href="/admin"
            className="text-xl font-bold text-white"
            onClick={() => setOpen(false)}
          >
            Wanjey<span className="text-[#8C1B11]">Admin</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={linkCls}
              onClick={() => setOpen(false)}
            >
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
      </div>
    </>
  )
}
