const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
const btn = document.getElementById('DarkMode')

const STORAGE = 'EarTrainerTheme';

(() => {
  const storage = JSON.parse(localStorage.getItem(STORAGE)) || { darkmode: prefersDarkScheme.matches }

  const isDark = storage.darkmode

  if (isDark) btn.checked = true

  toggleTheme(isDark)

  btn.addEventListener('change', toggleTheme)

  function toggleTheme (dark) {
    if (typeof dark === 'object') {
      dark = dark.target.checked
    }
    if (dark) {
      document.body.classList.remove('light-theme')
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
      document.body.classList.add('light-theme')
    }
  }
})()
