module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.html', './src/scripts/**/*.{js,jsx,ts,tsx,vue}'],
    plugins: [
        require('@tailwindcss/forms'),
        // ...
    ],
    theme: {
        extend: {
          transitionDuration: {
           '0': '0ms',
          }
        }
      }
    // specify other options here
  };