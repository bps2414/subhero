'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
    }

    const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
            // set this to false if you do not want the user to be automatically signed up
            shouldCreateUser: true,
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (error) {
        redirect('/login?message=Could not authenticate user')
    }

    redirect('/login?message=Check email to continue sign in process')
}
