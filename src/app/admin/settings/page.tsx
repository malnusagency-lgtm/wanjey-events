import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Settings as SettingsIcon, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your admin profile and dashboard configuration.</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-800">
            <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-500">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Admin Profile</h2>
              <p className="text-sm text-zinc-400">Your authentication details.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
              <div className="text-sm font-medium text-zinc-400">Email Address</div>
              <div className="md:col-span-2 text-white">{user.email}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
              <div className="text-sm font-medium text-zinc-400">User ID</div>
              <div className="md:col-span-2 text-white font-mono text-xs break-all">{user.id}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
              <div className="text-sm font-medium text-zinc-400">Last Signed In</div>
              <div className="md:col-span-2 text-white">{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
