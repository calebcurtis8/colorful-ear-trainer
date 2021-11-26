module.exports = {
  plugins: [
    require('postcss-import')({ path: ['src'] }),
    require('postcss-nested'),
    require('tailwindcss'),
    require('autoprefixer'),
  ]
}