const SCORE_STORAGE = 'EarTrainerScores'

const LEVELS = JSON.parse(document.getElementById('Levels').innerText)

class StarStatus extends HTMLElement {
    constructor(){
        super()
        this.level = this.parentElement.previousElementSibling.value
        document.addEventListener('gameify:highstreak', this.checkStreak.bind(this))
        this.checkStreak()
    }
    getScores(){
        return JSON.parse(localStorage.getItem(SCORE_STORAGE)) || {}
    }
    checkStreak(){
        const scores = this.getScores()
        if(!scores[this.level]) return
        const highStreak = scores[this.level].streak
        const level = LEVELS.filter( level => level.level == this.level)[0]
        if(highStreak >= level.to_beat) this.markComplete()
    }
    markComplete(){
        this.innerHTML = '⭐'
        this.parentElement.classList.add('complete')
    }
}

customElements.define('star-status', StarStatus)