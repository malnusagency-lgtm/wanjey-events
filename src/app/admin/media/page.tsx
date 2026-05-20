'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { UploadCloud, Folder, Image as ImageIcon, Video, Trash2 } from 'lucide-react'

export default function MediaManagerPage() {
  const [activeFolder, setActiveFolder] = useState('bigvoices')

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
            // Refresh logic or state update can go here
            console.log('Upload success:', result)
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

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="bg-zinc-900 p-4 rounded-full mb-4">
          <ImageIcon size={32} className="text-zinc-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Manage your media securely</h3>
        <p className="text-zinc-400 max-w-md">
          Files uploaded here are directly sent to your Cloudinary storage under the selected folder.
          Once uploaded, they will automatically appear on the website.
        </p>
      </div>
    </div>
  )
}
