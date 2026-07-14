// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  modules: ['@pinia/nuxt', 'shadcn-nuxt'],

  shadcn: {
    /** Prefix for all the imported components */
    prefix: '',
    /** Directory that the components live in */
    componentDir: './components/ui',
  },

  vite: {
    plugins: [(await import('@tailwindcss/vite')).default()],
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api/v1',
    },
  },
})
