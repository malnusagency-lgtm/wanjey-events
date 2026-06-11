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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#2D1A10]">Settings</h1>
        <p className="text-zinc-500 mt-1">Manage your admin profile and dashboard configuration.</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white/60 backdrop-blur-md border border-accent/25 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-accent/15">
            <div className="p-3 bg-accent/10 rounded-lg text-accent">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2D1A10] font-serif">Admin Profile</h2>
              <p className="text-sm text-zinc-500">Your authentication details.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#2D1A10]/5 rounded-lg border border-accent/10">
              <div className="text-sm font-semibold text-zinc-500">Email Address</div>
              <div className="md:col-span-2 text-[#2D1A10] font-medium">{user.email}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#2D1A10]/5 rounded-lg border border-accent/10">
              <div className="text-sm font-semibold text-zinc-500">User ID</div>
              <div className="md:col-span-2 text-[#2D1A10] font-mono text-xs break-all">{user.id}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#2D1A10]/5 rounded-lg border border-accent/10">
              <div className="text-sm font-semibold text-zinc-500">Last Signed In</div>
              <div className="md:col-span-2 text-[#2D1A10] font-medium">{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
