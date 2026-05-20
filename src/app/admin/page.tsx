import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Image as ImageIcon, Video, FolderGit2 } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">Overview</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">Welcome back, {user.email}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
              <ImageIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Images</p>
              <h3 className="text-2xl font-bold text-white">--</h3>
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
              <h3 className="text-2xl font-bold text-white">--</h3>
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

      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Media Management</h2>
        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
          Navigate to the Media Manager to upload and organize your assets via Cloudinary.
        </p>
        <a 
          href="/admin/media"
          className="inline-flex items-center justify-center rounded-lg bg-[#8C1B11] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#a12015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C1B11] transition-colors"
        >
          Go to Media Manager
        </a>
      </div>
    </div>
  )
}
