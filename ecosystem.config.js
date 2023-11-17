module.exports = {
  apps: [
    {
      name: 'mold-client',
      port: 3001,
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
