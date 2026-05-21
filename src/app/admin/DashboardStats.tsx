'use client'

import { useState, useEffect } from 'react'
import { Image as ImageIcon, Video, FolderGit2, Loader2 } from 'lucide-react'

export default function DashboardStats() {
  const [stats, setStats] = useState({ images: 0, videos: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/media/stats')
        if (response.ok) {
          const data = await response.json()
          setStats({ images: data.totalImages || 0, videos: data.totalVideos || 0 })
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
            <ImageIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">Total Images</p>
            <h3 className="text-2xl font-bold text-white">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.images}
            </h3>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
            <Video size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">Total Videos</p>
            <h3 className="text-2xl font-bold text-white">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats.videos}
            </h3>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
            <FolderGit2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">Storage Used</p>
            <h3 className="text-2xl font-bold text-white">Cloudinary</h3>
          </div>
        </div>
      </div>
    </div>
  )
}
