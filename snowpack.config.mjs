// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */

if((process.env.NODE_ENV == 'production')){
  process.env.SNOWPACK_PUBLIC_ANALYTICS = 'G-QPDJ6X371X';
} else {
  process.env.SNOWPACK_PUBLIC_ANALYTICS = '';
}

export default {
  mount: {
    src: '/',
  },
  buildOptions: {
    baseUrl: './',
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