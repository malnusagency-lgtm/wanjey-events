'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, Calendar, Search, Loader2, Check, Archive, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type Lead = {
  id: string
  name: string
  email: string
  phone?: string
  event_type?: string
  event_date?: string
  message: string
  status: 'New' | 'Contacted' | 'Archived'
  created_at: string
}

type TabType = 'All' | 'New' | 'Contacted' | 'Archived'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('All')
  const [actioningId, setActioningId] = useState<string | null>(null)

  const fetchLeads = async () => {
    try {
      const response = await fetch(`/api/contact?t=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        setLeads(data.leads || [])
      } else {
        toast.error('Failed to load leads.')
      }
    } catch (error) {
      console.error('Failed to load leads:', error)
      toast.error('Network error while fetching leads.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const updateStatus = async (id: string, status: 'New' | 'Contacted' | 'Archived') => {
    setActioningId(id)
    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })

      if (response.ok) {
        const updated = await response.json()
        setLeads(prev => prev.map(lead => lead.id === id ? updated : lead))
        toast.success(`Lead status updated to ${status}`)
      } else {
        toast.error('Failed to update lead status.')
      }
    } catch (error) {
      console.error('Update status error:', error)
      toast.error('Network error.')
    } finally {
      setActioningId(null)
    }
  }

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this lead? This action cannot be undone.')) return
    setActioningId(id)
    try {
      const response = await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setLeads(prev => prev.filter(lead => lead.id !== id))
        toast.success('Lead permanently deleted.')
      } else {
        toast.error('Failed to delete lead.')
      }
    } catch (error) {
      console.error('Delete lead error:', error)
      toast.error('Network error.')
    } finally {
      setActioningId(null)
    }
  }

  // Filter and search logic
  const filteredLeads = leads.filter(lead => {
    const matchesTab = activeTab === 'All' || lead.status === activeTab
    const term = searchTerm.toLowerCase()
    const matchesSearch = 
      lead.name.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      (lead.phone && lead.phone.toLowerCase().includes(term)) ||
      (lead.event_type && lead.event_type.toLowerCase().includes(term)) ||
      lead.message.toLowerCase().includes(term)

    return matchesTab && matchesSearch
  })

  // Get counts for each status
  const counts = {
    All: leads.length,
    New: leads.filter(l => l.status === 'New').length,
    Contacted: leads.filter(l => l.status === 'Contacted').length,
    Archived: leads.filter(l => l.status === 'Archived').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#2D1A10] font-serif">Leads CRM</h1>
          <p className="text-zinc-500 mt-1 text-sm font-medium">Manage and track bookings, proposals, and client inquiries.</p>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 backdrop-blur-md border border-accent/25 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {(['All', 'New', 'Contacted', 'Archived'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-[#8C1B11] text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-[#2D1A10] hover:bg-[#8C1B11]/5'
              }`}
            >
              {tab} ({counts[tab]})
            </button>
          ))}
        </div>

        <div className="relative w-full md:max-w-xs shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search leads..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-accent/25 rounded-lg text-sm text-[#2D1A10] placeholder-zinc-400 focus:outline-none focus:border-[#8C1B11] focus:ring-1 focus:ring-[#8C1B11]/20 font-semibold"
          />
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white/60 backdrop-blur-md border border-accent/25 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center bg-white/40">
            <Loader2 className="animate-spin text-[#8C1B11] w-8 h-8" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 bg-white/40">
            <Mail className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-bold text-[#2D1A10] font-serif">No matching inquiries</h3>
            <p className="text-zinc-500 text-sm mt-1">We couldn't find any inquiries matching your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-accent/15">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="p-6 hover:bg-accent/5 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-[#2D1A10] font-serif">{lead.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        lead.status === 'New' 
                          ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                          : lead.status === 'Contacted' 
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' 
                            : 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-xs text-zinc-500 font-semibold">
                      <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-accent" /> {lead.email}</span>
                      {lead.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-accent" /> {lead.phone}</span>}
                      {lead.event_date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-accent" /> 
                          Date: {new Date(lead.event_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider sm:text-right shrink-0">
                    Received: {new Date(lead.created_at).toLocaleDateString()} at {new Date(lead.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                
                <div className="bg-[#2D1A10]/5 rounded-lg p-4 border border-accent/10">
                  <div className="text-xs font-bold text-accent mb-2 uppercase tracking-wider">Service: {lead.event_type || 'General Inquiry'}</div>
                  <p className="text-[#2D1A10]/80 text-sm whitespace-pre-wrap leading-relaxed font-medium">{lead.message}</p>
                </div>

                {/* CRM Controls */}
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-accent/10">
                  {lead.status === 'New' && (
                    <button
                      onClick={() => updateStatus(lead.id, 'Contacted')}
                      disabled={actioningId === lead.id}
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Contacted
                    </button>
                  )}
                  {lead.status !== 'Archived' && (
                    <button
                      onClick={() => updateStatus(lead.id, 'Archived')}
                      disabled={actioningId === lead.id}
                      className="flex items-center gap-1.5 bg-zinc-600 hover:bg-zinc-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      Archive
                    </button>
                  )}
                  {lead.status === 'Archived' && (
                    <button
                      onClick={() => updateStatus(lead.id, 'New')}
                      disabled={actioningId === lead.id}
                      className="flex items-center gap-1.5 bg-[#8C1B11] hover:bg-[#a12015] disabled:opacity-60 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Reopen Lead
                    </button>
                  )}
                  <button
                    onClick={() => deleteLead(lead.id)}
                    disabled={actioningId === lead.id}
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ml-auto sm:ml-0"
                  >
                    {actioningId === lead.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
