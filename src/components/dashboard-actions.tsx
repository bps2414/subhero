'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AddSubscriptionModal } from '@/components/add-subscription-modal'

export function DashboardActions() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Nova Assinatura
            </button>

            <AddSubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}
