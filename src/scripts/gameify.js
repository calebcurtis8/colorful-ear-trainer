import JSConfetti from 'js-confetti'
import { removeClassStartsWith } from './remove-class-starts-with'

const jsConfetti = new JSConfetti()

const SCORE_STORAGE = 'EarTrainerScores'
class GameArea extends HTMLElement {
    constructor() {
        super()
        this.streak = 0
        this.correct = 0
        this.total = 0
        this.late = 0
        this.fire = 10

        this.elements = {
            streak: this.querySelector('[data-streak]'),
            highStreak: this.querySelector('[data-high-streak]'),
            correct: this.querySelector('[data-correct]'),
            total: this.querySelector('[data-total]'),
            late: this.querySelector('[data-late]'),
            gradient: this.querySelector('[data-gradient'),
            background: document.getElementById('Background'),
            message: document.getElementById('Message')
        }
        document.addEventListener('gameify:update', this.update.bind(this))
        document.addEventListener('gameify:update', this.checkScores.bind(this))
        document.addEventListener('gameify:reward', this.reward.bind(this))
        document.addEventListener('gameify:punish', this.punish.bind(this))

        let savedScores = localStorage.getItem(SCORE_STORAGE)
        this.highScores = savedScores ? JSON.parse(savedScores) : { streak: 0 };
        this.updateHighScoreDisplay()
    }
    punish(e) {
        removeClassStartsWith(this.elements.background, 'duration-')
        this.elements.background.style.opacity = 0
        setTimeout( () => {
            //re-add duration class
            this.elements.background.classList.add('duration-1000')
        }, 1000)
        //specific punishments
        switch (e.detail.msg) {
            case 'wrongNote':
                let elm = e.detail.elm
                elm.classList.add('shake')
                setTimeout( () => {
                    elm.classList.remove('shake')
                }, 500)
                break;
            case 'timeFail':
                // console.log(e.detail.msg)
                break;
            case 'lateAnswer':
                // console.log(e.detail.msg)
                break;
            default:
                break;
        }
    }
    reward(e) {
        let ratio = e.detail.ratio
        let is_threshold = e.detail.is_threshold()
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
        if(this.streak > this.highScores.streak){
            document.dispatchEvent(new CustomEvent('gameify:highstreak'))
            this.highScores.streak = this.streak
            this.saveScores()
            if(this.streak >= 10) this.streakAnimation()
        }
    }
    saveScores(){
        this.updateHighScoreDisplay()
        localStorage.setItem(SCORE_STORAGE, JSON.stringify(this.highScores))
    }
    updateHighScoreDisplay(){
        this.elements.highStreak.innerText = this.highScores.streak
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
            key.style.transition = '300ms'
            timeout += 50
            setTimeout( function(){
                key.setAttribute('fill', `hsl(${ i * 25 }, 90%, 70%)`)
            }, timeout)
            setTimeout( function(){
                key.setAttribute('fill', (key.getAttribute('data-key') == 'black' ? 'black' : 'transparent'))
                key.style.transition = null
            }, timeout + 600)
        })
        this.message('HIGH STREAK 🎉', 1000)
    }
    update(e) {
        this.elements.streak.innerText = this.streak
        this.elements.correct.innerText = this.correct
        this.elements.total.innerText = this.total
        this.elements.gradient.style.width = (this.correct / this.total) * 100 + '%'
        let ratio = this.streak / this.fire
        this.elements.background.style.opacity = ratio >= 1 ? 1 : ratio;
        if (ratio == 0) {
            document.dispatchEvent(new CustomEvent('gameify:punish', { detail: e.detail }))
        } else if (ratio >= 1) {
            document.dispatchEvent(new CustomEvent('gameify:reward', {
                detail: {
                    ratio: ratio,
                    is_threshold: function () {
                        return ratio >= 1 && ratio == parseInt(ratio)
                    }
                }
            }))
        }
    }
    message(note, time = 1000){
        this.elements.message.innerHTML = note
        this.elements.message.classList.add('active')
        setTimeout( () => {
            this.elements.message.classList.remove('active')
        }, time)
    }
}

customElements.define('game-area', GameArea);

const Gameify = document.getElementById('Gameify')

export default Gameify