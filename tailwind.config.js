module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{html,ejs}', './public/**/*.{html,ejs}', './src/scripts/**/*.{js,jsx,ts,tsx,vue}'],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
    // ...
  ],
  theme: {
    extend: {
      colors: {
        'theme-text': 'var(--text-color)',
        'theme-secondary': 'var(--text-secondary)',
        'theme-bg': 'var(--bkg-color)',
      },
      transitionDuration: {
        '0': '0ms',
      },
    }
  }
  // specify other options here
};