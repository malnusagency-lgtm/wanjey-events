import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Settings as SettingsIcon, User, Shield, Key } from 'lucide-react';

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

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-800">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Security & API</h2>
              <p className="text-sm text-zinc-400">Connection statuses for external services.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
              <div className="flex items-center gap-3">
                <Key size={18} className="text-zinc-400" />
                <div>
                  <div className="text-sm font-medium text-white">Supabase Connection</div>
                  <div className="text-xs text-zinc-500">Database and Authentication</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
              <div className="flex items-center gap-3">
                <Key size={18} className="text-zinc-400" />
                <div>
                  <div className="text-sm font-medium text-white">Cloudinary Connection</div>
                  <div className="text-xs text-zinc-500">Media Storage API</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
                Active
              </span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg text-sm text-blue-200">
            <strong>Note:</strong> To change passwords or manage API keys, please use your Supabase or Cloudinary dashboard directly.
          </div>
        </div>
      </div>
    </div>
  );
}
