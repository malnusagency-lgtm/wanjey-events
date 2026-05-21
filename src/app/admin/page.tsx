import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardStats from './DashboardStats'

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

      <DashboardStats />

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
