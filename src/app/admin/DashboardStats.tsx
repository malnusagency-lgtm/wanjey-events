'use client'

import { useState, useEffect } from 'react'
import { Image as ImageIcon, Video, HardDrive, Loader2, Users, Eye, BarChart2, MousePointerClick, TrendingUp, Globe } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
type MediaStats = { images: number; videos: number; bytes: number }
type AnalyticsStats = {
  pageViews: number
  uniqueVisitors: number
  topPages: { path: string; count: number }[]
  topSections: { section: string; count: number }[]
  dailyChart: { date: string; count: number }[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
function MiniBarChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="flex items-end gap-1.5 h-16 w-full">
      {data.map(({ date, count }) => (
        <div key={date} className="flex-1 flex flex-col items-center gap-1 group">
          <div
            className="w-full rounded-t-sm bg-[#8C1B11]/70 group-hover:bg-[#8C1B11] transition-all duration-300"
            style={{ height: `${Math.max(4, (count / max) * 100)}%` }}
            title={`${fmtDate(date)}: ${count} views`}
          />
          <span className="text-[9px] text-zinc-400 hidden sm:block">{fmtDate(date)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Row bar for top pages / sections ────────────────────────────────────────
function TopBar({ label, count, max, color = '#8C1B11' }: { label: string; count: number; max: number; color?: string }) {
  const pct = Math.max(4, (count / Math.max(max, 1)) * 100)
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-zinc-500 w-28 shrink-0 truncate" title={label}>{label}</span>
      <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold text-[#2D1A10] w-8 text-right shrink-0">{count}</span>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = 'accent' }: {
  icon: React.ReactNode; label: string; value: React.ReactNode; sub?: string; color?: string
}) {
  return (
    <div className="rounded-xl border border-accent/25 bg-white/60 backdrop-blur-md p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2.5 rounded-lg bg-[${color}]/10 text-[${color}]`}>{icon}</div>
        <p className="text-sm font-medium text-zinc-500">{label}</p>
      </div>
      <h3 className="text-2xl font-black text-[#2D1A10]">{value}</h3>
      {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DashboardStats() {
  const [media, setMedia] = useState<MediaStats>({ images: 0, videos: 0, bytes: 0 })
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null)
  const [loadingMedia, setLoadingMedia] = useState(true)
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)
  const [analyticsError, setAnalyticsError] = useState(false)

  useEffect(() => {
    fetch('/api/media/stats')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setMedia({ images: data.totalImages ?? 0, videos: data.totalVideos ?? 0, bytes: data.totalBytes ?? 0 })
      })
      .catch(() => {})
      .finally(() => setLoadingMedia(false))
  }, [])

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && !data.error) setAnalytics(data)
        else setAnalyticsError(true)
      })
      .catch(() => setAnalyticsError(true))
      .finally(() => setLoadingAnalytics(false))
  }, [])

  const CLOUDINARY_FREE_TIER_BYTES = 25 * 1024 * 1024 * 1024
  const usagePct = Math.min(100, (media.bytes / CLOUDINARY_FREE_TIER_BYTES) * 100)

  return (
    <div className="space-y-8">
      {/* ── Media stats ── */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
          <HardDrive size={13} /> Media Library
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-accent/25 bg-white/60 backdrop-blur-md p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg text-accent"><ImageIcon size={22} /></div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Total Images</p>
                <h3 className="text-2xl font-bold text-[#2D1A10]">
                  {loadingMedia ? <Loader2 className="w-5 h-5 animate-spin text-accent" /> : media.images}
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-accent/25 bg-white/60 backdrop-blur-md p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#8C1B11]/10 rounded-lg text-[#8C1B11]"><Video size={22} /></div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Total Videos</p>
                <h3 className="text-2xl font-bold text-[#2D1A10]">
                  {loadingMedia ? <Loader2 className="w-5 h-5 animate-spin text-[#8C1B11]" /> : media.videos}
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-accent/25 bg-white/60 backdrop-blur-md p-6 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-accent/10 rounded-lg text-accent"><HardDrive size={22} /></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-zinc-500">Storage Used</p>
                  <span className="text-xs text-zinc-400">{formatBytes(media.bytes)} / 25 GB</span>
                </div>
                {loadingMedia ? (
                  <div className="h-2 w-full bg-zinc-200/60 rounded-full animate-pulse" />
                ) : (
                  <div className="h-2 w-full bg-zinc-200/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${usagePct > 90 ? 'bg-red-500' : usagePct > 75 ? 'bg-amber-500' : 'bg-[#8C1B11]'}`}
                      style={{ width: `${Math.max(1, usagePct)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Website Analytics ── */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
          <Globe size={13} /> Website Analytics — Last 30 Days
        </h2>

        {analyticsError ? (
          <div className="rounded-xl border border-amber-300/40 bg-amber-50/60 p-6 text-sm text-amber-800 shadow-sm">
            <p className="font-bold mb-1">Analytics table not set up yet</p>
            <p className="text-amber-700/80 text-xs leading-relaxed">
              Run the SQL script in{' '}
              <code className="bg-amber-100 px-1 rounded font-mono text-[11px]">scripts/01-update-db.sql</code>{' '}
              in your Supabase SQL Editor to enable analytics tracking.
            </p>
          </div>
        ) : loadingAnalytics ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-[#8C1B11]" />
          </div>
        ) : analytics ? (
          <div className="space-y-5">
            {/* KPI row */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="rounded-xl border border-accent/25 bg-white/60 backdrop-blur-md p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  <Eye size={18} className="text-[#8C1B11]" />
                  <p className="text-sm font-medium text-zinc-500">Page Views</p>
                </div>
                <h3 className="text-3xl font-black text-[#2D1A10]">{analytics.pageViews.toLocaleString()}</h3>
                <p className="text-xs text-zinc-400 mt-1">Last 30 days</p>
              </div>

              <div className="rounded-xl border border-accent/25 bg-white/60 backdrop-blur-md p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  <Users size={18} className="text-[#8C1B11]" />
                  <p className="text-sm font-medium text-zinc-500">Unique Visitors</p>
                </div>
                <h3 className="text-3xl font-black text-[#2D1A10]">{analytics.uniqueVisitors.toLocaleString()}</h3>
                <p className="text-xs text-zinc-400 mt-1">By session ID</p>
              </div>

              <div className="rounded-xl border border-accent/25 bg-white/60 backdrop-blur-md p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  <MousePointerClick size={18} className="text-[#8C1B11]" />
                  <p className="text-sm font-medium text-zinc-500">Total Clicks</p>
                </div>
                <h3 className="text-3xl font-black text-[#2D1A10]">
                  {analytics.topSections.reduce((s, x) => s + x.count, 0).toLocaleString()}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Across all sections</p>
              </div>

              <div className="rounded-xl border border-accent/25 bg-white/60 backdrop-blur-md p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  <TrendingUp size={18} className="text-[#8C1B11]" />
                  <p className="text-sm font-medium text-zinc-500">Avg. Daily Views</p>
                </div>
                <h3 className="text-3xl font-black text-[#2D1A10]">
                  {analytics.dailyChart.length > 0
                    ? Math.round(analytics.dailyChart.reduce((s, d) => s + d.count, 0) / analytics.dailyChart.length).toLocaleString()
                    : '0'}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">Last 7 days</p>
              </div>
            </div>

            {/* Daily Chart */}
            <div className="rounded-xl border border-accent/25 bg-white/60 backdrop-blur-md p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                <BarChart2 size={13} /> Daily Page Views (last 7 days)
              </p>
              {analytics.dailyChart.every(d => d.count === 0) ? (
                <p className="text-sm text-zinc-400 text-center py-4">No views tracked yet. Data will appear once visitors browse your site.</p>
              ) : (
                <MiniBarChart data={analytics.dailyChart} />
              )}
            </div>

            {/* Top Pages + Top Sections */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-accent/25 bg-white/60 backdrop-blur-md p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                  <Globe size={13} /> Top Pages
                </p>
                {analytics.topPages.length === 0 ? (
                  <p className="text-sm text-zinc-400">No page data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.topPages.map(({ path, count }) => (
                      <TopBar
                        key={path}
                        label={path === '/' ? 'Home' : path}
                        count={count}
                        max={analytics.topPages[0]?.count ?? 1}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-accent/25 bg-white/60 backdrop-blur-md p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                  <MousePointerClick size={13} /> Most Clicked Sections
                </p>
                {analytics.topSections.length === 0 ? (
                  <p className="text-sm text-zinc-400">No click data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.topSections.map(({ section, count }) => (
                      <TopBar
                        key={section}
                        label={section}
                        count={count}
                        max={analytics.topSections[0]?.count ?? 1}
                        color="#2D1A10"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
