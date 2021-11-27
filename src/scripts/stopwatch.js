import StopWatch from "@slime/stopwatch"
import { removeClassStartsWith } from './remove-class-starts-with'

import User from './user'

class StopwatchTimer extends HTMLElement{
    constructor(){
        super()

        this.stopwatch = new StopWatch()

        this.display = this.querySelector('[data-time]')
        this.face = this.querySelector('[data-face]')
        this.limit = this.querySelector('[data-limit]')
        this.timelimit = function(){ return User.get('timelimit','float') * User.get('note_count', 'number')}
        this.timelimitInMs = function(){ return this.timelimit() * 1000}

        document.addEventListener('game:afterask', this.start.bind(this))
        document.addEventListener('game:answercomplete', this.stop.bind(this))
        document.addEventListener('game:pause', this.stop.bind(this))
        document.addEventListener('user:update', this.update.bind(this))

        window.addEventListener('blur', this.stop.bind(this))

        this.update()
    }
    start(){
        this.stop()
        this.reset()
        this.stopwatch.startTimer()
        this.currentLimit = this.timelimitInMs()
        this.refreshRate = setInterval( this.refresh.bind(this), 10)
        this.face.classList.add('bg-success')
        this.status = 'success'
    }
    stop(){
        this.isPaused = true
        this.stopwatch.stopTimer()
        clearInterval( this.refreshRate )
    }
    reset(){
        this.stopwatch.reset()
        removeClassStartsWith(this.face, 'bg-')
    }
    refresh(){
        this.display.innerText = `${(this.stopwatch.getTimeElapsedInMs / 1000).toFixed(2)}s`
        if(this.stopwatch.getTimeElapsedInMs > this.currentLimit && this.status != 'fail'){
            removeClassStartsWith(this.face, 'bg-')
            this.face.classList.add('bg-fail')
            this.status = 'fail'
            document.dispatchEvent(new CustomEvent('gameify:timeout', { detail: { note: null, msg: 'timeFail' }}))
        }
    }
    update(){
        this.limit.innerText = `${ this.timelimit() }s`
    }

}

customElements.define('stopwatch-timer', StopwatchTimer);

const Stopwatch = document.getElementById('Stopwatch')

export default Gameify