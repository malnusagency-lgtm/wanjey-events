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
  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#2D1A10]/70 hover:text-[#8C1B11] hover:bg-[#8C1B11]/5 transition-all duration-300 font-medium'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-transparent text-[#2D1A10] overflow-hidden">

      {/* ── Desktop Sidebar (md+) — Server Component ── */}
      <aside className="hidden md:flex w-64 border-r border-accent/15 bg-white/40 backdrop-blur-xl flex-col shrink-0 shadow-sm">
        <div className="p-6 border-b border-accent/15">
          <Link href="/admin" className="text-xl font-bold text-[#2D1A10] flex items-center gap-2 font-serif">
            Wanjey<span className="text-[#8C1B11]">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={linkCls}>
              <Icon size={18} className="text-accent" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-accent/15">
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50/60 transition-colors font-medium"
            >
              <LogOut size={18} />
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
