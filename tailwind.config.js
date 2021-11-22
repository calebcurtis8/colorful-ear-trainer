module.exports = {
    mode: 'jit',
    purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
    plugins: [
        require('@tailwindcss/forms'),
        // ...
    ],
    // specify other options here
  };