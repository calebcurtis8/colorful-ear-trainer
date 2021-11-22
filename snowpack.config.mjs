// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    src: '/',
  },
 
  buildOptions: {
    baseUrl: '/colorful-ear-trainer',
    out: './docs',
  },
  devOptions: {
    tailwindConfig: './tailwind.config.js',
  },
  plugins: [
    '@snowpack/plugin-webpack',
    '@snowpack/plugin-postcss',
  ],
};