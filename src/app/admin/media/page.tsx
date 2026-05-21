'use client'

import { useState, useEffect } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { UploadCloud, Folder, Image as ImageIcon, Video, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'

type MediaItem = {
  id: string;
  url: string;
  type: string;
  width: number;
  height: number;
  created_at: string;
}

export default function MediaManagerPage() {
  const [activeFolder, setActiveFolder] = useState('bigvoices')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchMedia = async (folder: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/media?folder=${folder}`)
      if (response.ok) {
        const data = await response.json()
        setMedia(data.media || [])
      }
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia(activeFolder)
  }, [activeFolder])

  const handleDelete = async (publicId: string, resourceType: string) => {
    if (!confirm('Are you sure you want to delete this file? It will be removed from your website immediately.')) return;
    
    setDeletingId(publicId)
    try {
      const response = await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: publicId, resource_type: resourceType }),
      })
      if (response.ok) {
        setMedia(prev => prev.filter(item => item.id !== publicId))
      } else {
        alert('Failed to delete media')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('An error occurred while deleting')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Media Manager</h1>
          <p className="text-zinc-400 mt-1">Upload and manage assets for your website sections.</p>
        </div>
        
        <CldUploadWidget 
          signatureEndpoint="/api/cloudinary/sign"
          options={{
            folder: `wanjey/${activeFolder}`,
            multiple: true,
            maxFiles: 50,
          }}
          onSuccess={(result, { widget }) => {
            // Refresh logic
            console.log('Upload success:', result)
            fetchMedia(activeFolder)
          }}
        >
          {({ open }) => {
            return (
              <button 
                onClick={() => open()}
                className="flex items-center gap-2 bg-[#8C1B11] hover:bg-[#a12015] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg"
              >
                <UploadCloud size={20} />
                Upload to {activeFolder}
              </button>
            )
          }}
        </CldUploadWidget>
      </div>

      <div className="flex gap-4 border-b border-zinc-800 pb-4">
        <button
          onClick={() => setActiveFolder('bigvoices')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            activeFolder === 'bigvoices' 
              ? 'bg-zinc-800 text-white' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Folder size={18} />
          BigVoices
        </button>
        <button
          onClick={() => setActiveFolder('gallery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            activeFolder === 'gallery' 
              ? 'bg-zinc-800 text-white' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Folder size={18} />
          Gallery
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#8C1B11]" />
        </div>
      ) : media.length === 0 ? (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="bg-zinc-900 p-4 rounded-full mb-4">
            <ImageIcon size={32} className="text-zinc-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No media found in {activeFolder}</h3>
          <p className="text-zinc-400 max-w-md">
            Click the upload button above to add files. They will automatically appear on the website.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group relative aspect-square rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              {item.type === 'video' ? (
                <video src={item.url} className="w-full h-full object-cover" muted playsInline />
              ) : (
                <Image src={item.url} alt={item.id} fill className="object-cover" />
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleDelete(item.id, item.type)}
                    disabled={deletingId === item.id}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    title="Delete permanently"
                  >
                    {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-xs text-white truncate px-1 bg-black/50 rounded p-1">
                  {item.id.split('/').pop()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
