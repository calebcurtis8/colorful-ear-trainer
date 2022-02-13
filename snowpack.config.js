/** @type {import("snowpack").SnowpackUserConfig } */

process.env.SNOWPACK_PUBLIC_BUILD_HASH = Date.now().toString(36)

if ((process.env.NODE_ENV === 'production')) {
  process.env.SNOWPACK_PUBLIC_ANALYTICS = 'G-QPDJ6X371X'
} else {
  process.env.SNOWPACK_PUBLIC_ANALYTICS = ''
}

module.exports = {
  mount: {
    public: '/',
    src: '/_dist_'
  },
  buildOptions: {
    baseUrl: './'
  },
  devOptions: {
    tailwindConfig: './tailwind.config.js'
  },
  plugins: [
    '@snowpack/plugin-webpack',
    '@snowpack/plugin-postcss',
    ['snowpack-plugin-ejs']
  ]
}
