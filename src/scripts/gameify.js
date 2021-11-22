import JSConfetti from 'js-confetti'

const jsConfetti = new JSConfetti()

class GameArea extends HTMLElement {
    constructor() {
        super()
        this.streak = 0
        this.correct = 0
        this.total = 0
        this.fire = 10

        this.elements = {
            streak: this.querySelector('[data-streak]'),
            correct: this.querySelector('[data-correct]'),
            total: this.querySelector('[data-total]'),
            gradient: this.querySelector('[data-gradient'),
            background: document.getElementById('background')
        }
        document.addEventListener('gameify:update', this.update.bind(this))
        // document.addEventListener('answer', this.timer.bind(this))
    }
    update() {
        this.elements.streak.innerText = this.streak
        this.elements.correct.innerText = this.correct
        this.elements.total.innerText = this.total
        this.elements.gradient.style.width = (this.correct / this.total) * 100 + '%'
        let ratio = this.streak / this.fire
        this.elements.background.style.opacity = ratio >= 1 ? 1 : ratio;
        if (ratio >= 1 && ratio == parseInt(ratio)) {
            if (ratio == 1) {
                jsConfetti.addConfetti()
            } else {
                jsConfetti.addConfetti({
                    emojis: ['🔥', '💥']
                })
            }
        }
    }
}

customElements.define('game-area', GameArea);

const Gameify = document.getElementById('Gameify')

export default Gameify