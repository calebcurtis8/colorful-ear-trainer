const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const btn = document.getElementById('DarkMode');

const STORAGE = 'EarTrainerUser';

(() => {
    const storage = JSON.parse(localStorage.getItem(STORAGE)) || {}

    const isDark = prefersDarkScheme.matches && storage.darkmode !== false

    if(isDark) btn.checked = true
    toggleTheme(isDark)
    
    btn.addEventListener('change', toggleTheme)

    function toggleTheme(theme){
        if(typeof theme === 'object'){
            theme = theme.target.checked
        }
        if (theme) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }
    }
   
})()