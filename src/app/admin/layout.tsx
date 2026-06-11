import Link from 'next/link'
import { logout } from '@/app/login/actions'
import AdminMobileNav from './AdminMobileNav'
import {
  LayoutDashboard, Image as ImageIcon,
  Settings, LogOut, Mail, CalendarDays,
} from 'lucide-react'

// Force dynamic so admin pages are never statically cached
export const dynamic = 'force-dynamic'

const navLinks = [
  { href: '/admin',          label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/admin/leads',    label: 'Leads Inbox',   icon: Mail },
  { href: '/admin/events',   label: 'Event Editor',  icon: CalendarDays },
  { href: '/admin/media',    label: 'Media Manager', icon: ImageIcon },
  { href: '/admin/settings', label: 'Settings',      icon: Settings },
]

const linkCls =
  'flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">

      {/* ── Desktop Sidebar (md+) — Server Component, no JS needed ── */}
      <aside className="hidden md:flex w-64 border-r border-zinc-800 bg-zinc-900/50 flex-col shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <Link href="/admin" className="text-xl font-bold text-white flex items-center gap-2">
            Wanjey<span className="text-[#8C1B11]">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={linkCls}>
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

      {/* ── Right column: mobile nav + page content ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/*
          AdminMobileNav is a Client Component — isolated here so the layout
          itself stays a Server Component (required for export const dynamic).
        */}
        <AdminMobileNav />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
