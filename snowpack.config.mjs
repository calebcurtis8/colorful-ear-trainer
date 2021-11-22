// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  devOptions: {
    tailwindConfig: './tailwind.config.js',
  },
  plugins: [
    '@snowpack/plugin-webpack',
    '@snowpack/plugin-postcss',
  ],
};