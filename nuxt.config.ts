import UnpluginComponentsVite from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  // server side rendering mode
  ssr: false,

  // typescripts
  typescript: {
    strict: true,
    typeCheck: false,
  },

  // css
  css: [
    '~/assets/sass/vendor.scss',
    '~/assets/sass/app.scss',
    '~/assets/fonts/icomoon/style.css',
  ],

  // plugins
  plugins: [
    '~/plugins/navbar.ts',
    '~/plugins/nuxtServerInit.ts',
    '~/plugins/api.ts',
    '~/plugins/modal.ts',
    '~/plugins/floating-vue.ts',
    '~/plugins/vueMq.ts',
    { src: '~/plugins/vuePlyr.ts', mode: 'client' },
    { src: '~/plugins/vueDatePicker.ts', mode: 'client' },
  ],

  // build
  build: {
    transpile: [
      '@headlessui/vue',
      '@vuepic/vue-datepicker',
    ],
  },

  // modules
  modules: [
    'unplugin-icons/nuxt',
    '@intlify/nuxt3',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore'],
      },
    ],
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-windicss',
    '@nuxtjs/device',
  ],
  device: {
    refreshOnResize: true,
  },

  // experimental features
  experimental: {
    reactivityTransform: false,
  },

  // auto import components
  components: true,

  // vite plugins
  vite: {
    plugins: [
      UnpluginComponentsVite({
        dts: true,
        resolvers: [
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@import "../assets/sass/_variables.scss";',
        },
      },
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
  },

  // app config
  app: {
    // global transition
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  // localization - i18n config
  intlify: {
    localeDir: 'locales',
    vueI18n: {
      locale: 'ja',
      fallbackLocale: 'ja',
      availableLocales: ['en', 'id', 'ja', 'ko'],
    },
  },

  // vueuse
  vueuse: {
    ssrHandlers: true,
  },

  // windicss
  windicss: {
    analyze: {
      analysis: {
        interpretUtilities: false,
      },
      server: {
        port: 4000,
        open: false,
      },
    },
    scan: true,
  },

  // content
  content: {
    documentDriven: true,
    markdown: {
      mdc: true,
    },
    highlight: {
      theme: 'github-dark',
    },
    watch: false,
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
      apiVer: process.env.API_VER,
      apiCloud: process.env.API_CLOUD,
    },
  },
})
