import type { Metadata } from 'next'
import Image from 'next/image'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Admin Login — Wanjey Events',
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  // Decode the error param server-side so LoginForm receives plain text
  const error = params.error ? decodeURIComponent(params.error) : undefined

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-transparent px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-[#8C1B11]/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-accent/40 shadow-[0_0_30px_rgba(202,163,101,0.2)] bg-white">
            <Image
              src="/assets/logo.jpeg"
              alt="Wanjey Events"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-[#2D1A10] tracking-tight">
              Wanjey<span className="text-[#8C1B11]">Admin</span>
            </h1>
            <p className="mt-1 text-sm text-zinc-500 font-medium">
              Sign in to manage your dashboard
            </p>
          </div>
        </div>

        {/* LoginForm imports the server action directly — no prop passing */}
        <LoginForm error={error} />

        <p className="mt-6 text-center text-xs text-zinc-400 font-medium">
          © {new Date().getFullYear()} Wanjey Events &amp; Marketing
        </p>
      </div>
    </div>
  )
}
