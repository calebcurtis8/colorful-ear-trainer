import JSConfetti from 'js-confetti'

const jsConfetti = new JSConfetti()

const SCORE_STORAGE = 'EarTrainerScores'
class GameArea extends HTMLElement {
    constructor() {
        super()
        this.fire = 10
        
        this.elements = {
            streak: this.querySelector('[data-streak]'),
            highStreak: this.querySelector('[data-high-streak]'),
            highScore: this.querySelector('[data-high-score]'),
            correct: this.querySelector('[data-correct]'),
            total: this.querySelector('[data-total]'),
            late: this.querySelector('[data-late]'),
            gradient: this.querySelector('[data-gradient'),
            background: document.getElementById('Background'),
            message: document.getElementById('Message'),
            level: document.getElementById('Level')
        }
        
        document.addEventListener('game:answercomplete', this.update.bind(this))
        document.addEventListener('countdown:expired', this.update.bind(this))
        document.addEventListener('user:levelchange', this.reset.bind(this))
        
        const savedScores = JSON.parse(localStorage.getItem(SCORE_STORAGE)) || {}
        const levels = this.elements.level.querySelectorAll('option')
        //set default for practice mode
        if(!savedScores[0]){
            savedScores[0] = {
                streak: 0,
                score: 0
            }
        }
        //set defaults for all levels
        levels.forEach( level => {
            const id = level.value
            if(!savedScores[id]){
                savedScores[id] = {
                    streak: 0,
                    score: 0
                }
            }
        })
        this.highScores = savedScores

        this.reset()
    }
    punish(e) {
        if(!e.elm) return
        //specific punishments
        switch (e.msg) {
            case 'wrongNote':
                const elm = e.elm
                elm.classList.add('shake')
                
                setTimeout( () => {
                    elm.classList.remove('shake')
                }, 500)
                break;
            case 'timeFail':
                // console.log(e.msg)
                break;
            case 'lateAnswer':
                // console.log(e.msg)
                break;
            default:
                break;
        }
        document.dispatchEvent(new CustomEvent('gameify:punish', { detail: e }))
    }
    reward(e) {
        const ratio = this.streak / this.fire
        const is_threshold = (ratio >= 1 && Number.isInteger(ratio))
        if (!is_threshold) return
        switch (ratio) {
            case 1:
                jsConfetti.addConfetti()
                break;
            case 2:
                jsConfetti.addConfetti({
                    emojis: ['🔥', '💥']
                })
                break;
            case 3:
                jsConfetti.addConfetti({
                    emojis: ['💀']
                })
                break;
            default:

                break;
        }

    }
    checkScores(){
        const levelID = this.getLevelID()
        if(this.streak > this.highScores[levelID].streak){
            document.dispatchEvent(new CustomEvent('gameify:highstreak'))
            this.highScores[levelID].streak = this.streak
            this.saveScores()
            if(this.streak >= 10) this.streakAnimation()
        }
        if(this.correct > this.highScores[levelID].score){
            document.dispatchEvent(new CustomEvent('gameify:highscore'))
            this.highScores[levelID].score = this.correct
            this.saveScores()
        }
    }
    saveScores(){
        this.updateHighScoreDisplay()
        localStorage.setItem(SCORE_STORAGE, JSON.stringify(this.highScores))
    }
    updateHighScoreDisplay(){
        const levelID = this.getLevelID()
        this.elements.highStreak.innerText = this.highScores[levelID].streak
        this.elements.highScore.innerText = this.highScores[levelID].score
    }
    getLevelID(){
        const mode = document.querySelector('input[name="mode"]:checked').value
        const level = this.elements.level.querySelector('input:checked').value
        if(mode == 'practice') return 0
        return level
    }
    streakAnimation(){
        const white_keys = document.querySelectorAll('#Piano [data-key="white"]')
        const black_keys = document.querySelectorAll('#Piano [data-key="black"]')
        //ordering the keys
        const keys = [
            white_keys[0],
            black_keys[0],
            white_keys[1],
            black_keys[1],
            white_keys[2],
            white_keys[3],
            black_keys[2],
            white_keys[4],
            black_keys[3],
            white_keys[5],
            black_keys[4],
            white_keys[6]
        ]
        let timeout = 0
        keys.forEach( (key, i) => {
            timeout += 50
            setTimeout( function(){
                if(key.getAttribute('data-key') == 'black') key.setAttribute('fill', `hsl(${ i * 25 }, 90%, 70%)`)
                key.setAttribute('stroke', `hsl(${ i * 25 }, 90%, 70%)`)
            }, timeout)
            setTimeout( function(){
                if(key.getAttribute('data-key') == 'black') key.setAttribute('fill', 'var(--text-color)')
                key.setAttribute('stroke', 'var(--text-color)')
            }, timeout + 600)
        })
        this.message('HIGH STREAK 🎉', 1000)
    }
    update(e) {
        document.dispatchEvent(new CustomEvent('gameify:update', { detail: e }))
        this.checkScores()
        this.updateScoreDisplay()
    }
    updateScoreDisplay(){
        this.elements.streak.innerText = this.streak
        this.elements.correct.innerText = this.correct
        this.elements.total.innerText = this.total
        this.elements.gradient.style.width = (this.correct / this.total) * 100 + '%'
        const ratio = this.streak / this.fire
        this.elements.background.style.opacity = ratio >= 1 ? 1 : ratio;
        this.updateHighScoreDisplay()
    }
    message(note, time = 1000){
        this.elements.message.innerHTML = note
        // this.elements.message.classList.add('active')
        setTimeout( () => {
            // this.elements.message.classList.remove('active')
        }, time)
    }
    reset(){
        this.streak = 0
        this.correct = 0
        this.total = 0
        this.late = 0
        this.updateScoreDisplay()
    }
}

customElements.define('game-area', GameArea);

const Gameify = document.getElementById('Gameify')

export default Gameify