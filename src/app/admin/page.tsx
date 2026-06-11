import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardStats from './DashboardStats'
import RecentMediaWidget from '@/components/admin/RecentMediaWidget'
import { Mail, Phone, Calendar, UploadCloud, Edit, Settings, ExternalLink, ArrowRight, Ticket } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch recent leads
  const { data: recentLeads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch active event
  const { data: activeEvent } = await supabase
    .from('upcoming_event')
    .select('*')
    .limit(1)
    .single();

  const unreadLeadsCount = recentLeads?.filter(lead => lead.status === 'New').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#2D1A10]">Overview</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500">Welcome back, {user.email}</span>
        </div>
      </div>

      <DashboardStats />

      {/* Quick Actions Hub */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/media" className="flex flex-col items-center justify-center p-6 bg-white/60 hover:bg-white/95 border border-accent/25 hover:border-accent/40 rounded-xl shadow-sm hover:shadow-md transition-all group">
          <div className="p-3 bg-accent/10 group-hover:bg-[#8C1B11] text-accent group-hover:text-white rounded-lg mb-3 transition-colors">
            <UploadCloud size={24} />
          </div>
          <span className="text-sm font-semibold text-[#2D1A10] group-hover:text-[#8C1B11] transition-colors">Upload Media</span>
        </Link>
        <Link href="/admin/leads" className="flex flex-col items-center justify-center p-6 bg-white/60 hover:bg-white/95 border border-accent/25 hover:border-accent/40 rounded-xl shadow-sm hover:shadow-md transition-all group relative">
          {unreadLeadsCount > 0 && (
            <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
          )}
          <div className="p-3 bg-accent/10 group-hover:bg-[#8C1B11] text-accent group-hover:text-white rounded-lg mb-3 transition-colors">
            <Mail size={24} />
          </div>
          <span className="text-sm font-semibold text-[#2D1A10] group-hover:text-[#8C1B11] transition-colors">View Leads</span>
        </Link>
        <Link href="/admin/events" className="flex flex-col items-center justify-center p-6 bg-white/60 hover:bg-white/95 border border-accent/25 hover:border-accent/40 rounded-xl shadow-sm hover:shadow-md transition-all group">
          <div className="p-3 bg-accent/10 group-hover:bg-[#8C1B11] text-accent group-hover:text-white rounded-lg mb-3 transition-colors">
            <Edit size={24} />
          </div>
          <span className="text-sm font-semibold text-[#2D1A10] group-hover:text-[#8C1B11] transition-colors">Edit Event</span>
        </Link>
        <Link href="/admin/settings" className="flex flex-col items-center justify-center p-6 bg-white/60 hover:bg-white/95 border border-accent/25 hover:border-accent/40 rounded-xl shadow-sm hover:shadow-md transition-all group">
          <div className="p-3 bg-accent/10 group-hover:bg-[#8C1B11] text-accent group-hover:text-white rounded-lg mb-3 transition-colors">
            <Settings size={24} />
          </div>
          <span className="text-sm font-semibold text-[#2D1A10] group-hover:text-[#8C1B11] transition-colors">Settings</span>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Leads Widget */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-md border border-accent/25 rounded-xl flex flex-col shadow-sm">
          <div className="p-6 border-b border-accent/15 flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#2D1A10] font-serif">Recent Inquiries</h2>
            <Link href="/admin/leads" className="text-sm text-[#8C1B11] hover:text-[#a12015] font-semibold transition-colors flex items-center gap-1">
              View Inbox <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex-1 overflow-hidden">
            {!recentLeads || recentLeads.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 h-full flex flex-col items-center justify-center">
                <Mail className="h-8 w-8 text-zinc-300 mb-3" />
                <p>No new inquiries yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-accent/10">
                {recentLeads.map((lead) => (
                  <Link key={lead.id} href="/admin/leads" className="block p-5 hover:bg-accent/5 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#2D1A10] group-hover:text-[#8C1B11] transition-colors">{lead.name}</h3>
                        {lead.status === 'New' && (
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-400">{new Date(lead.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1 truncate max-w-[150px]"><Mail className="h-3 w-3 text-accent" /> {lead.email}</span>
                      <span className="flex items-center gap-1"><Ticket className="h-3 w-3 text-accent" /> {lead.event_type || 'General'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Event Snapshot & Recent Media */}
        <div className="space-y-6">
          <div className="bg-white/60 backdrop-blur-md border border-accent/25 rounded-xl overflow-hidden flex flex-col shadow-sm">
            <div className="p-6 border-b border-accent/15 flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#2D1A10] font-serif">Active Event</h2>
              <Link href="/admin/events" className="text-sm text-[#8C1B11] hover:text-[#a12015] font-semibold transition-colors flex items-center gap-1">
                Edit <Edit size={14} />
              </Link>
            </div>
            {activeEvent ? (
              <div className="p-6">
                <div className="aspect-[16/9] w-full rounded-lg overflow-hidden border border-accent/15 mb-4 relative bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={activeEvent.image_url} alt="Event" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                    <div className="text-xs font-bold text-accent uppercase tracking-wider mb-1">
                      {new Date(activeEvent.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight">{activeEvent.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
                  <ExternalLink size={14} className="text-accent" />
                  <span className="truncate">{activeEvent.location}</span>
                </div>
                <div className="w-full text-center py-2 bg-accent/10 text-accent text-sm font-semibold rounded-lg">
                  {activeEvent.is_active ? 'Currently live on homepage' : 'Hidden from homepage'}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500 flex flex-col items-center justify-center">
                <Calendar className="h-8 w-8 text-zinc-300 mb-3" />
                <p>No active event configured.</p>
              </div>
            )}
          </div>

          <RecentMediaWidget />
        </div>
      </div>
    </div>
  )
}
