'use client'

import { useState, useEffect } from 'react'
import { Image as ImageIcon, Video, FolderGit2, Loader2, HardDrive } from 'lucide-react'

export default function DashboardStats() {
  const [stats, setStats] = useState({ images: 0, videos: 0, bytes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/media/stats')
        if (response.ok) {
          const data = await response.json()
          setStats({ 
            images: data.totalImages || 0, 
            videos: data.totalVideos || 0,
            bytes: data.totalBytes || 0
          })
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const CLOUDINARY_FREE_TIER_BYTES = 25 * 1024 * 1024 * 1024; // 25 GB limit approx
  const usagePercentage = Math.min(100, (stats.bytes / CLOUDINARY_FREE_TIER_BYTES) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-3">
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

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
            <HardDrive size={24} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-zinc-400">Storage Used</p>
              <span className="text-xs text-zinc-500">{formatBytes(stats.bytes)} / 25 GB</span>
            </div>
            {loading ? (
              <div className="h-2 w-full bg-zinc-800 rounded-full animate-pulse"></div>
            ) : (
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${usagePercentage > 90 ? 'bg-red-500' : usagePercentage > 75 ? 'bg-amber-500' : 'bg-[#8C1B11]'}`}
                  style={{ width: `${Math.max(1, usagePercentage)}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
