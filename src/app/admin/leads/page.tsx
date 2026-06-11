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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#2D1A10]">Leads Inbox</h1>
        <p className="text-zinc-500 mt-1">Manage inquiries from your website contact form.</p>
      </div>

      <div className="bg-white/60 backdrop-blur-md border border-accent/25 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-accent/15 flex justify-between items-center bg-white/40">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-accent/25 rounded-lg text-sm text-[#2D1A10] placeholder-zinc-400 focus:outline-none focus:border-[#8C1B11] focus:ring-1 focus:ring-[#8C1B11]/20"
            />
          </div>
          <div className="text-sm text-zinc-500 font-medium">
            Total: {leads?.length || 0}
          </div>
        </div>

        {(!leads || leads.length === 0) ? (
          <div className="p-12 text-center text-zinc-500">
            <Mail className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-bold text-[#2D1A10] font-serif">No inquiries yet</h3>
            <p className="text-zinc-500">When users submit the contact form, they will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-accent/15">
            {leads.map((lead) => (
              <div key={lead.id} className="p-6 hover:bg-accent/5 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#2D1A10] flex items-center gap-2">
                      {lead.name}
                      {lead.status === 'New' && (
                        <span className="px-2 py-0.5 rounded-full bg-[#8C1B11]/10 text-[#8C1B11] text-xs font-semibold border border-[#8C1B11]/20">New</span>
                      )}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-zinc-500">
                      <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-accent" /> {lead.email}</span>
                      {lead.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-accent" /> {lead.phone}</span>}
                      {lead.event_date && <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-accent" /> {new Date(lead.event_date).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="text-xs text-zinc-400 sm:text-right shrink-0">
                    {new Date(lead.created_at).toLocaleDateString()} at {new Date(lead.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                
                <div className="bg-[#2D1A10]/5 rounded-lg p-4 border border-accent/10">
                  <div className="text-xs font-semibold text-accent mb-2 uppercase tracking-wider">Service: {lead.event_type || 'General'}</div>
                  <p className="text-[#2D1A10]/80 text-sm whitespace-pre-wrap leading-relaxed">{lead.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
