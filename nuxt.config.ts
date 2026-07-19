export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@nuxtjs/i18n',
  ],

  image: {
    format: ['webp', 'jpg'],
    quality: 80,
  },

  supabase: {
    redirect: false,
  },

  i18n: {
    locales: [
      { code: 'es', language: 'es-ES', name: 'Español', dir: 'ltr', file: 'es.json' },
      { code: 'en', language: 'en-US', name: 'English', dir: 'ltr', file: 'en.json' },
      { code: 'fr', language: 'fr-FR', name: 'Français', dir: 'ltr', file: 'fr.json' },
      { code: 'ar', language: 'ar', name: 'العربية', dir: 'rtl', file: 'ar.json' },
    ],
    defaultLocale: 'es',
    lazy: true,
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'stayora_lang',
      redirectOn: 'root',
    },
  },

  app: {
    head: {
      title: 'StayOra — Apartamentos Turísticos',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Encuentra tu alojamiento perfecto. Apartamentos turísticos con todas las comodidades para unas vacaciones inolvidables.',
        },
        { property: 'og:title', content: 'StayOra — Apartamentos Turísticos' },
        {
          property: 'og:description',
          content:
            'Descubre apartamentos turísticos en las mejores ciudades. Reserva fácil y rápido.',
        },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      whatsappNumber: process.env.WHATSAPP_NUMBER || '34600000000',
    },
  },
})
