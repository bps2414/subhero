'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = createClient()
    const headerList = headers()

    // Determine the exact origin. Vercel exposes VERCEL_PROJECT_PRODUCTION_URL.
    let origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        origin = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    } else if (process.env.VERCEL_URL) {
        origin = `https://${process.env.VERCEL_URL}` // For preview deployments
    } else {
        const host = headerList.get('host')
        if (host && !host.includes('localhost')) {
            origin = `https://${host}`
        }
    }

    const data = {
        email: formData.get('email') as string,
    }

    const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
            shouldCreateUser: true,
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        redirect('/login?message=Não foi possível autenticar o usuário')
    }

    redirect('/login?message=Verifique seu email para continuar o login')
}
