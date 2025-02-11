module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    'nuxt3/type': true, // Adiciona o ambiente Nuxt 3
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'prettier'],
  plugins: [
    'vue',
  ],
  rules: {},
}
