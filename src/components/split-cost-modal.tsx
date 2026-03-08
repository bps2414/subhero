'use client'

import { useState } from 'react'
import { X, Copy, Check, HandCoins } from 'lucide-react'

interface Subscription {
    id: string
    service_name: string
    price: number
    billing_cycle: 'monthly' | 'yearly'
    color_hex: string
}

interface SplitCostModalProps {
    isOpen: boolean
    onClose: () => void
    subscription: Subscription | null
}

export function SplitCostModal({ isOpen, onClose, subscription }: SplitCostModalProps) {
    const [pixKey, setPixKey] = useState('')
    const [copied, setCopied] = useState(false)

    if (!isOpen || !subscription) return null

    const splitPrice = (subscription.price / 2).toFixed(2)
    const cycleText = subscription.billing_cycle === 'monthly' ? 'mês' : 'ano'

    const generatedMessage = `Opa! Sua parte da assinatura da ${subscription.service_name} neste ${cycleText} é de R$ ${splitPrice}. Me envia via Pix: ${pixKey || '[SEU PIX AQUI]'}`

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(generatedMessage)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy text', err)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative glass-card w-full max-w-sm p-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                            style={{
                                backgroundColor: subscription.color_hex + '20',
                                color: subscription.color_hex,
                                boxShadow: `0 4px 12px ${subscription.color_hex}15`,
                            }}
                        >
                            <HandCoins className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Dividir Conta</h2>
                            <p className="text-xs text-zinc-500">Rachar {subscription.service_name} via Pix</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all"
                        aria-label="Fechar modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Your Pix Key */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="pix_key" className="text-xs font-medium text-zinc-400">
                            Sua Chave Pix (Opcional)
                        </label>
                        <input
                            id="pix_key"
                            value={pixKey}
                            onChange={(e) => setPixKey(e.target.value)}
                            placeholder="ex: 123.456.789-00 ou email@pix.com"
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all text-sm"
                        />
                    </div>

                    {/* Generated Message Preview */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">
                            Previsão da Mensagem
                        </label>
                        <div className="p-3 bg-white/[0.02] border border-zinc-800/50 rounded-lg">
                            <p className="text-sm text-zinc-300 leading-relaxed break-words">
                                {generatedMessage}
                            </p>
                        </div>
                    </div>

                    {/* Copy Button */}
                    <button
                        onClick={handleCopy}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium text-sm rounded-lg transition-colors shadow-lg shadow-purple-500/20"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" />
                                Copiado para  área de transferência!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copiar Mensagem
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
