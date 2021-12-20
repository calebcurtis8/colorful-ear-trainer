import Transposer from './transpose.js'
import cadence from './cadence.js'
import random from "./random.js";
import { play_sequence } from './play_sequence.js'
import { removeClassStartsWith } from "./remove-class-starts-with.js"

import User from './user.js'
import Gameify from './gameify.js'
import Piano from './piano.js'

const Stopwatch = document.getElementById('Stopwatch')
export class Game {
    constructor(){
        this.handleAnswer = this.registerAnswer.bind(this)
        this.playBtn = document.querySelector('#Play')
        this.playBtn?.addEventListener('click', this.playClick.bind(this))
        this.handleStart = this.start.bind(this)
        this.playBtn?.addEventListener('click', this.handleStart)
        this.cadenceBtn = document.querySelector('#PlayCadence')
        this.cadenceBtn?.addEventListener('click', this.playCadence.bind(this))
        this.notesBtn = document.querySelector('#PlayNotes')
        this.notesBtn?.addEventListener('click', this.playNotes.bind(this))

        this.playCount = 0
        this.gameStarted = false

        document.addEventListener('countdown:expired', this.stop.bind(this))
        document.addEventListener('user:levelchange', this.stop.bind(this))
    }
    start(){
        this.playBtn?.removeEventListener('click', this.handleStart)
        document.dispatchEvent(new CustomEvent('game:start'))
        this.setButtonState('PAUSE', 'bg-yellow-gradient', 'playing')
    }
    stop(e){
        this.pause()
        this.playBtn?.addEventListener('click', this.handleStart)
        this.setButtonState('PLAY', 'bg-green-gradient', 'stopped')
        Gameify.streak = 0
        Gameify.correct = 0
        Gameify.total = 0
        Gameify.late = 0
        this.attempts = 0
        User.notes = []
        User.selected_notes = []
        this.playCount = 0
        this.gameStarted = false
        document.removeEventListener('answer', this.handleAnswer)
        document.dispatchEvent(new CustomEvent('game:stop'))
    }
    playClick(){
        if(this.playBtn.state == 'playing'){ 
            this.pause()
            return
        }
        if(this.playBtn.state == 'paused'){
            this.setButtonState('PAUSE', 'bg-yellow-gradient', 'playing')
            document.dispatchEvent(new CustomEvent('game:continue'))   
        }
        this.play()
    }
    play(){
        this.playCount += 1

        //check if we are randomizing keys or not
        if(User.get('randomkey','checkbox')){
            const newKey = Math.floor(Math.random() * 12)
            const elm = User.getElm('keycenter')
            elm.value = newKey
            elm.dispatchEvent(new CustomEvent('change'))
        }

        const playCadence = this.playCount === 1 || Number.isInteger((this.playCount - 1) / User.get('cadenceevery', 'number'))

        //reset attempt count
        this.attempts = 0
        //notes which the user must answer
        const set = User.get('set', 'array')
        const noteSet = Transposer.transpose({ set })
        random(User.get('note_count','number'), noteSet)
        .then( notes => {
            User.notes = notes
            //duplicate to remember which were selected
            User.selected_notes_without_octave = JSON.parse(JSON.stringify(User.notes))
            User.selected_notes = this.setOctaves(User.selected_notes_without_octave)
            User.notes = this.setOctave(User.notes)
    
            if(playCadence){
                this.playCadence().then( this.askNotes.bind(this) )
            } else {
                setTimeout(this.askNotes.bind(this), 250)
            }
        })
    }
    playCadence(){
        return new Promise( (res, rej) => {
            if(this.playingCadence) return
            this.playingCadence = true
            this.offset = cadence()
            setTimeout( function(){
                this.playingCadence = false
                res()
            }.bind(this), this.offset * 1000)
        })
    }
    playNotes(){
        User.selected_notes ? play_sequence([{ sequence: User.selected_notes.map( note => note.join('')), duration: 2.5 }], 0) : null;
    }
    askNotes(){
        Piano.clear()
        if(this.playBtn.state == 'stopped' || this.playBtn.state == 'paused') return
        this.setButtonState('PAUSE', 'bg-yellow-gradient', 'playing')
        this.playNotes()
        document.addEventListener('answer', this.handleAnswer)
        //clears the piano
        document.dispatchEvent(new CustomEvent('game:ask'))
    }
    pause(){
        this.setButtonState('PLAY', 'bg-green-gradient', 'paused')
        document.dispatchEvent(new CustomEvent('game:pause'))
    }
    setButtonState(state, colorClass, playState){
        removeClassStartsWith(this.playBtn, 'bg-')
        this.playBtn.classList.add(colorClass)
        this.playBtn.innerText = state
        this.playBtn.state = playState
    }
    setOctave(arr){
        return arr.map( note => `${note}${User.get('cadenceoctave', 'number')}` )
    }
    setOctaves(arr){
        const range = User.getOctaveRange()
        return arr.map( note => [note,`${User.getOctaveRange()[0] + Math.floor(Math.random() * (range[1] - range[0]))}`])
    }
    registerAnswer(e){
        const note_with_octave = e.detail.note_with_octave
        Gameify.total++
        this.attempts++
        e.detail.q = User.selected_notes_without_octave
        if(User.notes.indexOf(note_with_octave) == -1){
            Gameify.streak = 0
            e.detail.msg = 'wrongNote'
            e.detail.status = 0
            Gameify.punish(e.detail)
            Gameify.update(e.detail)
            return 
        }
        if(Stopwatch.status == 'success'){
            Gameify.correct++
            e.detail.msg = 'rightNote'
            e.detail.status = 1
        }
        if(Stopwatch.status == 'fail'){
            Gameify.streak = 0
            Gameify.late++
            e.detail.msg = 'lateAnswer'
            e.detail.status = -1
            Gameify.punish(e.detail)
        }
        Gameify.update(e.detail)
        User.notes.splice(User.notes.indexOf(note_with_octave), 1)
        
        if(User.notes.length == 0){
            if(this.attempts == User.selected_notes.length && Stopwatch.status == 'success'){
                Gameify.streak++
                Gameify.reward(e.detail)
            }
            document.removeEventListener('answer', this.handleAnswer)
            document.dispatchEvent(new CustomEvent('game:answercomplete'))
            // this.setButtonState('PLAY', 'bg-green-gradient', 'paused')
            setTimeout(this.play.bind(this), 350)
        }
    }
}
