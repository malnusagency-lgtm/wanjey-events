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
        <h1 className="text-3xl font-bold tracking-tight text-white">Overview</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">Welcome back, {user.email}</span>
        </div>
      </div>

      <DashboardStats />

      {/* Quick Actions Hub */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/media" className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all group">
          <div className="p-3 bg-zinc-800 group-hover:bg-[#8C1B11] text-zinc-400 group-hover:text-white rounded-lg mb-3 transition-colors">
            <UploadCloud size={24} />
          </div>
          <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Upload Media</span>
        </Link>
        <Link href="/admin/leads" className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all group relative">
          {unreadLeadsCount > 0 && (
            <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
          )}
          <div className="p-3 bg-zinc-800 group-hover:bg-[#8C1B11] text-zinc-400 group-hover:text-white rounded-lg mb-3 transition-colors">
            <Mail size={24} />
          </div>
          <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">View Leads</span>
        </Link>
        <Link href="/admin/events" className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all group">
          <div className="p-3 bg-zinc-800 group-hover:bg-[#8C1B11] text-zinc-400 group-hover:text-white rounded-lg mb-3 transition-colors">
            <Edit size={24} />
          </div>
          <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Edit Event</span>
        </Link>
        <Link href="/admin/settings" className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all group">
          <div className="p-3 bg-zinc-800 group-hover:bg-[#8C1B11] text-zinc-400 group-hover:text-white rounded-lg mb-3 transition-colors">
            <Settings size={24} />
          </div>
          <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Settings</span>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Leads Widget */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Recent Inquiries</h2>
            <Link href="/admin/leads" className="text-sm text-[#8C1B11] hover:text-[#a12015] font-medium transition-colors flex items-center gap-1">
              View Inbox <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex-1 overflow-hidden">
            {!recentLeads || recentLeads.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 h-full flex flex-col items-center justify-center">
                <Mail className="h-8 w-8 text-zinc-700 mb-3" />
                <p>No new inquiries yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {recentLeads.map((lead) => (
                  <Link key={lead.id} href="/admin/leads" className="block p-5 hover:bg-zinc-800/30 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white group-hover:text-[#8C1B11] transition-colors">{lead.name}</h3>
                        {lead.status === 'New' && (
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-500">{new Date(lead.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1 truncate max-w-[150px]"><Mail className="h-3 w-3" /> {lead.email}</span>
                      <span className="flex items-center gap-1"><Ticket className="h-3 w-3" /> {lead.event_type || 'General'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Event Snapshot & Recent Media */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Active Event</h2>
              <Link href="/admin/events" className="text-sm text-[#8C1B11] hover:text-[#a12015] font-medium transition-colors flex items-center gap-1">
                Edit <Edit size={14} />
              </Link>
            </div>
            {activeEvent ? (
              <div className="p-6">
                <div className="aspect-[16/9] w-full rounded-lg overflow-hidden border border-zinc-800 mb-4 relative bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={activeEvent.image_url} alt="Event" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                    <div className="text-xs font-bold text-[#8C1B11] uppercase tracking-wider mb-1">
                      {new Date(activeEvent.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight">{activeEvent.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
                  <ExternalLink size={14} />
                  <span className="truncate">{activeEvent.location}</span>
                </div>
                <div className="w-full text-center py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg">
                  {activeEvent.is_active ? 'Currently live on homepage' : 'Hidden from homepage'}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500 flex flex-col items-center justify-center">
                <Calendar className="h-8 w-8 text-zinc-700 mb-3" />
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
