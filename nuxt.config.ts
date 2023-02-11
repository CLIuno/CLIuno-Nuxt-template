// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  experimental: {
  reactivityTransform: false,
},
// auto import components
components: true,
  modules: ["@vueuse/nuxt", "@nuxtjs/tailwindcss"],
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
})
