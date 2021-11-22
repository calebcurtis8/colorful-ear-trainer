module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.html', './src/scripts/**/*.{js,jsx,ts,tsx,vue}'],
    plugins: [
        require('@tailwindcss/forms'),
        // ...
    ],
    // specify other options here
  };