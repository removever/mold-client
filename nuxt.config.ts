

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  build: {
    // extractCSS: false,
    transpile: ["vuetify"],
  },
  css: ["@/assets/scss/style.scss"],
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
  modules: [
    "@pinia/nuxt",
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://192.168.1.35:5880',
      // apiExportUrl: 'http://localhost/eng/eng-brain-export/',
      // apiBaseUrl: 'https://rvscs-develop.com/engbrain',
      // apiExportUrl: 'https://rvscs-develop.com/eng-brain-export/',
    }
  }
});
