'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#8C1B11] px-4 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-[#a12015] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#8C1B11]/20"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing in…
        </>
      ) : (
        'Sign in'
      )}
    </button>
  )
}

interface LoginFormProps {
  error?: string
  // Server action passed from the Server Component parent
  serverAction: (formData: FormData) => Promise<never>
}

export function LoginForm({ error, serverAction }: LoginFormProps) {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl">
      {error && (
        <div className="mb-6 rounded-lg bg-red-950/50 border border-red-500/40 px-4 py-3 text-sm text-red-300 text-center">
          {decodeURIComponent(error)}
        </div>
      )}

      {/*
        The server action is bound to the native form action prop.
        This is the ONLY reliable way to:
        1. Get pending state via useFormStatus()
        2. Have redirect() from the server action fire correctly in the browser
        Do NOT use startTransition / event.preventDefault() with server actions that redirect.
      */}
      <form action={serverAction} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full rounded-xl border-0 bg-zinc-800/60 py-3.5 px-4 text-white text-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-[#8C1B11] transition-all duration-200"
            placeholder="admin@wanjeyevents.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="block w-full rounded-xl border-0 bg-zinc-800/60 py-3.5 px-4 text-white text-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-[#8C1B11] transition-all duration-200"
            placeholder="••••••••"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}
