export interface ServiceTemplate {
    name: string
    color_hex: string
    logo_url: string | null
    category: string
    default_price: number
    billing_cycle: 'monthly' | 'yearly'
}

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
    {
        name: 'Netflix',
        color_hex: '#E50914',
        logo_url: null,
        category: 'Streaming',
        default_price: 39.90,
        billing_cycle: 'monthly',
    },
    {
        name: 'Spotify',
        color_hex: '#1DB954',
        logo_url: null,
        category: 'Music',
        default_price: 21.90,
        billing_cycle: 'monthly',
    },
    {
        name: 'Prime Video',
        color_hex: '#00A8E1',
        logo_url: null,
        category: 'Streaming',
        default_price: 14.90,
        billing_cycle: 'monthly',
    },
    {
        name: 'YouTube Premium',
        color_hex: '#FF0000',
        logo_url: null,
        category: 'Streaming',
        default_price: 24.90,
        billing_cycle: 'monthly',
    },
    {
        name: 'HBO Max',
        color_hex: '#B535F6',
        logo_url: null,
        category: 'Streaming',
        default_price: 34.90,
        billing_cycle: 'monthly',
    },
]

export const CATEGORIES = [
    'Streaming',
    'Music',
    'Gaming',
    'Productivity',
    'Cloud Storage',
    'Fitness',
    'News',
    'Education',
    'Other',
]
