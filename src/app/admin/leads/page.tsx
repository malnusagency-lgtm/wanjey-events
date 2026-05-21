import { createClient } from '@/utils/supabase/server';
import { Mail, Phone, Calendar, User, Search, Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch leads
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch leads:', error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Leads Inbox</h1>
        <p className="text-zinc-400 mt-1">Manage inquiries from your website contact form.</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-700"
            />
          </div>
          <div className="text-sm text-zinc-400">
            Total: {leads?.length || 0}
          </div>
        </div>

        {(!leads || leads.length === 0) ? (
          <div className="p-12 text-center text-zinc-500">
            <Mail className="mx-auto h-12 w-12 text-zinc-700 mb-4" />
            <h3 className="text-lg font-medium text-white">No inquiries yet</h3>
            <p>When users submit the contact form, they will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {leads.map((lead) => (
              <div key={lead.id} className="p-6 hover:bg-zinc-800/20 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      {lead.name}
                      {lead.status === 'New' && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">New</span>
                      )}
                    </h3>
                    <div className="flex gap-4 mt-2 text-sm text-zinc-400">
                      <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {lead.email}</span>
                      {lead.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {lead.phone}</span>}
                      {lead.event_date && <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(lead.event_date).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="text-sm text-zinc-500 text-right">
                    {new Date(lead.created_at).toLocaleDateString()} <br/>
                    {new Date(lead.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                
                <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800/50">
                  <div className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Service: {lead.event_type || 'General'}</div>
                  <p className="text-zinc-300 text-sm whitespace-pre-wrap">{lead.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
