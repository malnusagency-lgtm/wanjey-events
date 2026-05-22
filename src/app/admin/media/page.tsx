'use client'

import { useState, useEffect } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { UploadCloud, Folder, Image as ImageIcon, Video, Trash2, Loader2, CheckSquare, Square } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

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
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const fetchMedia = async (folder: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/media?folder=${folder}&t=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        setMedia(data.media || [])
      }
    } catch (error) {
      console.error('Failed to fetch media:', error)
      toast.error('Failed to load media assets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSelectedIds([])
    fetchMedia(activeFolder)
  }, [activeFolder])

  const handleDeleteSingle = async (publicId: string, resourceType: string) => {
    setDeletingId(publicId)
    // Remove from selection if it was selected
    setSelectedIds(prev => prev.filter(item => item !== publicId))
    
    try {
      const response = await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: publicId, resource_type: resourceType }),
      })
      if (response.ok) {
        setMedia(prev => prev.filter(item => item.id !== publicId))
        toast.success('Asset deleted successfully')
      } else {
        toast.error('Failed to delete asset')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      toast.error('An error occurred while deleting')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === media.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(media.map(item => item.id))
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return

    setBulkDeleting(true)
    const itemsToDelete = media
      .filter(item => selectedIds.includes(item.id))
      .map(item => ({ public_id: item.id, resource_type: item.type }))

    try {
      const response = await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToDelete }),
      })

      if (response.ok) {
        setMedia(prev => prev.filter(item => !selectedIds.includes(item.id)))
        toast.success(`Successfully deleted ${selectedIds.length} asset(s)`)
        setSelectedIds([])
      } else {
        toast.error('Failed to delete selected assets')
      }
    } catch (error) {
      console.error('Failed to delete selected:', error)
      toast.error('An error occurred during bulk deletion')
    } finally {
      setBulkDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Media Manager</h1>
          <p className="text-zinc-400 mt-1">Upload and manage assets for your website sections.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <span className="text-xs text-zinc-500 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-md">
            Max {activeFolder === 'bigvoices' ? '500 MB' : '100 MB'} per file
          </span>
        <CldUploadWidget 
          key={activeFolder}
          signatureEndpoint="/api/cloudinary/sign"
          options={{
            folder: `wanjey/${activeFolder}`,
            multiple: true,
            maxFiles: 50,
            // 500MB for bigvoices (videos), 100MB for gallery (images)
            maxFileSize: activeFolder === 'bigvoices' ? 524288000 : 104857600,
            maxVideoFileSize: 524288000, // 500MB explicitly for videos
            maxImageFileSize: 104857600, // 100MB explicitly for images
            // Chunked uploads: splits large files into 6MB chunks to bypass single-request limits
            maxChunkSize: 6000000,
            clientAllowedFormats: activeFolder === 'bigvoices'
              ? ['mp4', 'mov', 'avi', 'webm', 'mkv', 'png', 'jpg', 'jpeg', 'webp']
              : ['png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'mov', 'webm'],
          }}
          onSuccess={(result: any) => {
            console.log('Upload success:', result)
            if (result?.info && typeof result.info === 'object') {
              const newItem: MediaItem = {
                id: result.info.public_id,
                url: result.info.secure_url,
                type: result.info.resource_type,
                width: result.info.width,
                height: result.info.height,
                created_at: result.info.created_at,
              }
              setMedia(prev => [newItem, ...prev.filter(item => item.id !== newItem.id)])
              toast.success('Asset uploaded successfully')
            } else {
              fetchMedia(activeFolder)
            }
          }}
          onError={(error) => {
            console.error('Upload Error:', error)
            toast.error('Upload failed: ' + (typeof error === 'string' ? error : 'Check file type/size'))
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

      {/* Bulk actions bar */}
      {!loading && media.length > 0 && (
        <div className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 px-3.5 py-2 rounded-lg font-medium"
            >
              {selectedIds.length === media.length ? <CheckSquare size={18} className="text-[#8C1B11]" /> : <Square size={18} />}
              {selectedIds.length === media.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-sm text-zinc-400">
              {selectedIds.length} of {media.length} selected
            </span>
          </div>

          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={bulkDeleting}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg"
            >
              {bulkDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#8C1B11]" />
        </div>
      ) : media.length === 0 ? (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
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
          {media.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div 
                key={item.id} 
                onClick={() => handleToggleSelect(item.id)}
                className={`group relative aspect-square rounded-xl border transition-all duration-300 bg-zinc-900 overflow-hidden cursor-pointer ${
                  isSelected ? 'border-[#8C1B11] ring-2 ring-[#8C1B11]/30' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Checkbox badge */}
                <div className={`absolute top-3 left-3 z-20 transition-all duration-200 ${
                  isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
                }`}>
                  <div className={`p-1 rounded-md border backdrop-blur-md transition-colors ${
                    isSelected ? 'bg-[#8C1B11] border-[#8C1B11] text-white' : 'bg-black/60 border-zinc-700 text-zinc-400'
                  }`}>
                    <CheckSquare size={16} className={isSelected ? 'block' : 'hidden'} />
                    <Square size={16} className={isSelected ? 'hidden' : 'block'} />
                  </div>
                </div>

                {item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" muted playsInline />
                ) : (
                  <Image src={item.url} alt={item.id} fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw" />
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSingle(item.id, item.type);
                      }}
                      disabled={deletingId === item.id}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 z-20 shadow-md"
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
            )
          })}
        </div>
      )}
    </div>
  )
}
