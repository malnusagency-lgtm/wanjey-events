'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader2, Image as ImageIcon } from 'lucide-react'

type MediaItem = {
  id: string;
  url: string;
  type: string;
  width: number;
  height: number;
  created_at: string;
}

export default function RecentMediaWidget() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentMedia() {
      try {
        // Fetch from gallery or bigvoices just to get recent items
        // In a perfect world, we'd fetch all folders, but let's just grab the latest from 'gallery' for the widget
        const response = await fetch(`/api/media?folder=gallery&t=${Date.now()}`)
        if (response.ok) {
          const data = await response.json()
          // Take only the top 5
          setMedia((data.media || []).slice(0, 5))
        }
      } catch (error) {
        console.error('Failed to fetch recent media:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecentMedia()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[150px] bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <Loader2 className="w-6 h-6 animate-spin text-[#8C1B11]" />
      </div>
    )
  }

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[150px] bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <ImageIcon className="w-8 h-8 text-zinc-600 mb-2" />
        <p className="text-sm text-zinc-400">No media uploaded yet</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recent Media</h2>
        <a href="/admin/media" className="text-sm text-[#8C1B11] hover:text-[#a12015] font-medium transition-colors">
          View All
        </a>
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {media.map((item) => (
          <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors bg-zinc-900 group">
            {item.type === 'video' ? (
              <video src={item.url} className="w-full h-full object-cover" muted playsInline />
            ) : (
              <Image src={item.url} alt={item.id} fill className="object-cover" sizes="(max-width: 768px) 20vw, 10vw" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] text-zinc-300 truncate max-w-full px-2 text-center">
                {item.id.split('/').pop()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
