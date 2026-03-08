import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { updateSubscription, deleteSubscription } from '@/app/dashboard/actions'
import { CATEGORIES } from '@/lib/templates'
import { ArrowLeft, Trash2, Save } from 'lucide-react'
import Link from 'next/link'

export default async function EditSubscriptionPage({
    params,
}: {
    params: { id: string }
}) {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

    if (!subscription) {
        notFound()
    }

    return (
        <div className="max-w-xl mx-auto animate-fade-in">
            {/* Back link */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            <div className="glass-card p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg"
                        style={{
                            backgroundColor: subscription.color_hex + '20',
                            color: subscription.color_hex,
                            boxShadow: `0 4px 12px ${subscription.color_hex}15`,
                        }}
                    >
                        {subscription.service_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Edit {subscription.service_name}</h1>
                        <p className="text-sm text-zinc-500">Update subscription details</p>
                    </div>
                </div>

                {/* Edit Form */}
                <form action={updateSubscription} className="flex flex-col gap-4">
                    <input type="hidden" name="id" value={subscription.id} />

                    {/* Service Name */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="service_name" className="text-sm font-medium text-zinc-300">
                            Service Name
                        </label>
                        <input
                            id="service_name"
                            name="service_name"
                            type="text"
                            required
                            defaultValue={subscription.service_name}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all text-sm"
                        />
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="price" className="text-sm font-medium text-zinc-300">
                            Price (R$)
                        </label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0.01"
                            required
                            defaultValue={subscription.price}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all text-sm"
                        />
                    </div>

                    {/* Billing Cycle */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="billing_cycle" className="text-sm font-medium text-zinc-300">
                            Billing Cycle
                        </label>
                        <select
                            id="billing_cycle"
                            name="billing_cycle"
                            defaultValue={subscription.billing_cycle}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all text-sm"
                        >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    {/* Next Billing Date */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="next_billing_date" className="text-sm font-medium text-zinc-300">
                            Next Billing Date
                        </label>
                        <input
                            id="next_billing_date"
                            name="next_billing_date"
                            type="date"
                            required
                            defaultValue={subscription.next_billing_date}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all text-sm"
                        />
                    </div>

                    {/* Category + Color */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="category" className="text-sm font-medium text-zinc-300">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                defaultValue={subscription.category}
                                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all text-sm"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="color_hex" className="text-sm font-medium text-zinc-300">
                                Color
                            </label>
                            <input
                                id="color_hex"
                                name="color_hex"
                                type="color"
                                defaultValue={subscription.color_hex}
                                className="w-full h-[42px] bg-zinc-950 border border-zinc-800 rounded-xl cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </form>

                {/* Delete Section */}
                <div className="mt-6 pt-6 border-t border-zinc-800/50">
                    <form action={deleteSubscription}>
                        <input type="hidden" name="id" value={subscription.id} />
                        <button
                            type="submit"
                            className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium text-sm rounded-xl transition-colors border border-red-500/20 hover:border-red-500/30 flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Subscription
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
