import StopWatch from "../../_snowpack/pkg/@slime/stopwatch.js"
import User from './user.js'

function getMinSec(seconds){
    var date = new Date(0);
    date.setSeconds(seconds); // specify value for SECONDS here
    return date.toTimeString().substr(3, 5);
}
class CountdownTimer extends HTMLElement{
    constructor(){
        super()

        this.face = this.querySelector('[data-face]')
        this.timeDisplay = this.querySelector('[data-time]')
        this.timeBackground = this.querySelector('[data-bg]')

        this.handleRefresh = this.refresh.bind(this)

        document.addEventListener('game:start', this.start.bind(this))
        document.addEventListener('game:pause', this.pause.bind(this))
        document.addEventListener('game:continue', this.continue.bind(this))

        document.addEventListener('user:update', this.updateDisplay.bind(this))

        this.updateDisplay()
        this.stopwatch = new StopWatch.StopWatch()
        
        this.reset()
    }
    updateDisplay(){
        this.timeRemaining = User.get('countdown', 'number') || 300
        this.timelimitInMs = this.timeRemaining * 1000
        this.timeLeft = this.timeRemaining
        this.timeDisplay.innerText = getMinSec(this.timelimitInMs / 1000)
    }
    continue(){
        this.timelimitInMs = this.timeLeft
        this.reset()
        this.start()
    }
    pause(){
        this.isPaused = true
        this.stopwatch.stopTimer()
        this.timeLeft = parseInt(this.getRemainingTime())
        this.stopwatch.start = this.stopwatch.stop

        clearInterval( this.refreshRate )
    }
    reset(){
        this.refresh()
        if(this.expired) this.timelimitInMs = this.timeRemaining * 1000
        this.timeDisplay.innerText = getMinSec(this.timelimitInMs / 1000)
        this.stopwatch.reset()
        this.success = true
        this.expired = false
        console.trace('reset')
    }
    getRemainingTime(){
        return -(this.stopwatch.getTimeElapsedInMs - this.timelimitInMs)
    }
    refresh(){
        let remainingTime = this.getRemainingTime()
        let percentage = (remainingTime / (this.timeRemaining * 1000)) * 100
        this.timeDisplay.innerText = getMinSec(remainingTime / 1000)
        this.timeBackground.style.height = `${percentage}%`
        if(remainingTime <= 0){
            document.dispatchEvent(new CustomEvent('countdown:expired', { bubbles: true }))
            this.expired = true
        }
    }
    start(){
        if(this.expired) this.reset()
        this.stopwatch.startTimer()
        this.refreshRate = setInterval(this.handleRefresh, 50)
        this.status = 'success'
    }
    stop(){
        this.pause()
        this.reset()
    }
}

export const Countdown = document.getElementById('Countdown')

customElements.define('countdown-timer', CountdownTimer)