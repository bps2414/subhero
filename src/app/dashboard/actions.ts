'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Used by the modal (Client Component) — returns error objects for UI feedback
export async function addSubscription(formData: FormData) {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const service_name = formData.get('service_name') as string
    const price = parseFloat(formData.get('price') as string)
    const billing_cycle = formData.get('billing_cycle') as 'monthly' | 'yearly'
    const next_billing_date = formData.get('next_billing_date') as string
    const color_hex = formData.get('color_hex') as string
    const category = formData.get('category') as string

    if (!service_name || isNaN(price) || price <= 0 || !billing_cycle || !next_billing_date) {
        return { error: 'Please fill in all required fields.' }
    }

    const { error } = await supabase.from('subscriptions').insert({
        user_id: user.id,
        service_name,
        price,
        billing_cycle,
        next_billing_date,
        color_hex: color_hex || '#a855f7',
        logo_url: null,
        category: category || 'Other',
    })

    if (error) {
        return { error: 'Failed to add subscription. Please try again.' }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

// Used by native form action (Server Component) — returns void, redirects on success
export async function updateSubscription(formData: FormData) {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const id = formData.get('id') as string
    const service_name = formData.get('service_name') as string
    const price = parseFloat(formData.get('price') as string)
    const billing_cycle = formData.get('billing_cycle') as 'monthly' | 'yearly'
    const next_billing_date = formData.get('next_billing_date') as string
    const color_hex = formData.get('color_hex') as string
    const category = formData.get('category') as string

    if (!id || !service_name || isNaN(price) || price <= 0) {
        redirect('/dashboard')
    }

    await supabase
        .from('subscriptions')
        .update({
            service_name,
            price,
            billing_cycle,
            next_billing_date,
            color_hex,
            category,
        })
        .eq('id', id)
        .eq('user_id', user.id)

    revalidatePath('/dashboard')
    redirect('/dashboard')
}

// Used by native form action — returns void, revalidates after delete
export async function deleteSubscription(formData: FormData) {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const id = formData.get('id') as string

    if (!id) {
        redirect('/dashboard')
    }

    await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
