'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = createClient()
    const headerList = headers()

    // Get origin from headers for absolute reliability on Vercel
    const host = headerList.get('x-forwarded-host') || headerList.get('host')
    const protocol = headerList.get('x-forwarded-proto') || 'http'

    let origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    if (host) {
        origin = `${protocol}://${host}`
    } else if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        origin = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    } else if (process.env.VERCEL_URL) {
        origin = `https://${process.env.VERCEL_URL}`
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
