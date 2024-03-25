module.exports = {
  apps: [
    {
      name: 'NuxtAppName',
      port: '4000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './node_modules/nuxt/bin/nuxt.js',
    }
  ]
}
