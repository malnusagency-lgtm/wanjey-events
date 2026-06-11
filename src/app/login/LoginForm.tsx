'use client'

import { login } from './actions'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

// useFormStatus must live in a child of the <form> that uses the action
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

export function LoginForm({ error }: { error?: string }) {
  return (
    <div className="rounded-2xl bg-white/65 backdrop-blur-xl border border-accent/25 p-8 shadow-2xl">
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-center font-medium">
          {error}
        </div>
      )}

      {/*
        Import the server action directly — do NOT pass it as a prop.
        Next.js automatically creates a serialisable reference when a
        server action is imported into a client component, which avoids
        the hydration mismatch that occurs when passing actions as props.
      */}
      <form action={login} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full rounded-xl border border-accent/25 bg-white py-3.5 px-4 text-[#2D1A10] text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#8C1B11] focus:ring-2 focus:ring-[#8C1B11]/10 transition-all duration-200 font-semibold"
            placeholder="admin@wanjeyevents.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="block w-full rounded-xl border border-accent/25 bg-white py-3.5 px-4 text-[#2D1A10] text-sm placeholder:text-zinc-400 focus:outline-none focus:border-[#8C1B11] focus:ring-2 focus:ring-[#8C1B11]/10 transition-all duration-200 font-semibold"
            placeholder="••••••••"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}
