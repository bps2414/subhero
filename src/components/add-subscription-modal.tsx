'use client'

import { useState, useRef } from 'react'
import { X, Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SERVICE_TEMPLATES, CATEGORIES, type ServiceTemplate } from '@/lib/templates'
import { addSubscription } from '@/app/dashboard/actions'

interface AddSubscriptionModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AddSubscriptionModal({ isOpen, onClose }: AddSubscriptionModalProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<ServiceTemplate | null>(null)
    const [isCustom, setIsCustom] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    if (!isOpen) return null

    function handleSelectTemplate(template: ServiceTemplate) {
        setSelectedTemplate(template)
        setIsCustom(false)
        setError(null)
    }

    function handleCustom() {
        setSelectedTemplate(null)
        setIsCustom(true)
        setError(null)
    }

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        setError(null)

        // Inject template data if selected
        if (selectedTemplate) {
            formData.set('service_name', selectedTemplate.name)
            formData.set('color_hex', selectedTemplate.color_hex)
            formData.set('category', selectedTemplate.category)
            if (!formData.get('billing_cycle')) {
                formData.set('billing_cycle', selectedTemplate.billing_cycle)
            }
        }

        const result = await addSubscription(formData)

        setIsPending(false)

        if (result?.error) {
            setError(result.error)
            return
        }

        // Success — reset and close
        setSelectedTemplate(null)
        setIsCustom(false)
        formRef.current?.reset()
        onClose()
    }

    const showForm = selectedTemplate || isCustom

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-white">
                            {showForm ? 'Detalhes da Assinatura' : 'Nova Assinatura'}
                        </h2>
                        <p className="text-sm text-zinc-500 mt-0.5">
                            {showForm ? 'Preencha os detalhes abaixo' : 'Escolha um serviço ou crie um personalizado'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {!showForm ? (
                    <>
                        {/* Template Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                            {SERVICE_TEMPLATES.map((template) => (
                                <button
                                    key={template.name}
                                    onClick={() => handleSelectTemplate(template)}
                                    className="glass-card-sm p-4 flex flex-col items-center gap-2 hover:border-zinc-600 transition-all group"
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
                                        style={{
                                            backgroundColor: template.color_hex + '20',
                                            color: template.color_hex,
                                            boxShadow: `0 4px 12px ${template.color_hex}15`,
                                        }}
                                    >
                                        {template.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                                        {template.name}
                                    </span>
                                    <span className="text-[10px] text-zinc-600">
                                        R$ {template.default_price.toFixed(2)}
                                    </span>
                                </button>
                            ))}

                            {/* Custom option */}
                            <button
                                onClick={handleCustom}
                                className="glass-card-sm p-4 flex flex-col items-center gap-2 hover:border-purple-500/40 border-dashed transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                </div>
                                <span className="text-xs font-medium text-zinc-300 group-hover:text-purple-400 transition-colors">
                                    Personalizado
                                </span>
                                <span className="text-[10px] text-zinc-600">Seu serviço</span>
                            </button>
                        </div>
                    </>
                ) : (
                    /* Form */
                    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
                        {/* Service Name */}
                        {isCustom ? (
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="service_name" className="text-sm font-medium text-zinc-300">
                                    Nome do Serviço
                                </label>
                                <input
                                    id="service_name"
                                    name="service_name"
                                    type="text"
                                    required
                                    placeholder="ex: Disney+"
                                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all text-sm"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-zinc-800/50">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                                    style={{
                                        backgroundColor: selectedTemplate!.color_hex + '20',
                                        color: selectedTemplate!.color_hex,
                                    }}
                                >
                                    {selectedTemplate!.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-white">{selectedTemplate!.name}</p>
                                    <p className="text-[11px] text-zinc-500">{selectedTemplate!.category}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedTemplate(null); setIsCustom(false) }}
                                    className="text-xs text-zinc-500 hover:text-white transition-colors"
                                >
                                    Alterar
                                </button>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="price" className="text-sm font-medium text-zinc-300">
                                Preço (R$)
                            </label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0.01"
                                required
                                defaultValue={selectedTemplate?.default_price}
                                placeholder="0.00"
                                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all text-sm"
                            />
                        </div>

                        {/* Billing Cycle */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="billing_cycle" className="text-sm font-medium text-zinc-300">
                                Ciclo de Cobrança
                            </label>
                            <select
                                id="billing_cycle"
                                name="billing_cycle"
                                defaultValue={selectedTemplate?.billing_cycle ?? 'monthly'}
                                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all text-sm"
                            >
                                <option value="monthly">Mensal</option>
                                <option value="yearly">Anual</option>
                            </select>
                        </div>

                        {/* Next Billing Date */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="next_billing_date" className="text-sm font-medium text-zinc-300">
                                Próxima Cobrança
                            </label>
                            <input
                                id="next_billing_date"
                                name="next_billing_date"
                                type="date"
                                required
                                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all text-sm"
                            />
                        </div>

                        {/* Category + Color (custom only) */}
                        {isCustom && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="category" className="text-sm font-medium text-zinc-300">
                                        Categoria
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all text-sm"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="color_hex" className="text-sm font-medium text-zinc-300">
                                        Cor
                                    </label>
                                    <input
                                        id="color_hex"
                                        name="color_hex"
                                        type="color"
                                        defaultValue="#a855f7"
                                        className="w-full h-[42px] bg-zinc-950 border border-zinc-800 rounded-xl cursor-pointer"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className={cn(
                                'w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2',
                                isPending
                                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                    : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30'
                            )}
                        >
                            {isPending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
                                    Adicionando...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Adicionar Assinatura
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
