module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.html', './src/scripts/**/*.{js,jsx,ts,tsx,vue}'],
  plugins: [
    require('@tailwindcss/forms'),
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