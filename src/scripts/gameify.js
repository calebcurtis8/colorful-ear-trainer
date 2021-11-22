import JSConfetti from 'js-confetti'
import { removeClassStartsWith } from './remove-class-starts-with'

const jsConfetti = new JSConfetti()
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
            correct: this.querySelector('[data-correct]'),
            total: this.querySelector('[data-total]'),
            late: this.querySelector('[data-late]'),
            gradient: this.querySelector('[data-gradient'),
            background: document.getElementById('background')
        }
        document.addEventListener('gameify:update', this.update.bind(this))
        document.addEventListener('gameify:reward', this.reward.bind(this))
        document.addEventListener('gameify:punish', this.punish.bind(this))
    }
    update() {
        this.elements.streak.innerText = this.streak
        this.elements.correct.innerText = this.correct
        this.elements.total.innerText = this.total
        this.elements.gradient.style.width = (this.correct / this.total) * 100 + '%'
        let ratio = this.streak / this.fire
        this.elements.background.style.opacity = ratio >= 1 ? 1 : ratio;
        if (ratio == 0) {
            document.dispatchEvent(new CustomEvent('gameify:punish'))
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
    reward(e) {
        let ratio = e.detail.ratio
        let is_threshold = e.detail.is_threshold()
        if (!is_threshold) return
        if (ratio == 1) {
            jsConfetti.addConfetti()
        } else {
            jsConfetti.addConfetti({
                emojis: ['🔥', '💥']
            })
        }

    }
    punish(e) {
        removeClassStartsWith(this.elements.background, 'duration-')
        setTimeout( () => {
            //re-add duration class
            this.elements.background.classList.add('duration-1000')
        }, 1000)
    }
}

customElements.define('game-area', GameArea);

const Gameify = document.getElementById('Gameify')

export default Gameify