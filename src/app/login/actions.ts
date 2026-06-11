'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData): Promise<never> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent('Email and password are required.')}`)
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error('[login] Supabase auth error:', error.message, '| status:', error.status)

    // Provide specific messages for common error codes
    let msg = 'Invalid email or password. Please try again.'
    if (error.status === 0 || error.message?.includes('fetch')) {
      msg = 'Connection error. Please check your internet connection and try again.'
    } else if (error.status === 429) {
      msg = 'Too many attempts. Please wait a moment and try again.'
    } else if (error.status === 400 && error.message?.includes('Email not confirmed')) {
      msg = 'Please confirm your email address before signing in.'
    }

    // NOTE: redirect() throws internally in Next.js.
    // It must NEVER be inside a try/catch — that would swallow it.
    redirect(`/login?error=${encodeURIComponent(msg)}`)
  }

  revalidatePath('/admin', 'layout')
  redirect('/admin')
}

export async function logout(): Promise<never> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
