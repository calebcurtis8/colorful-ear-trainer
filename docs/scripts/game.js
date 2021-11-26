import { Transposer } from './transpose.js'
import cadence from './cadence.js'
import random from "./random.js";
import { play_sequence } from './play_sequence.js'
import { removeClassStartsWith } from "./remove-class-starts-with.js"

import User from './user.js'
import Gameify from './gameify.js'

const Stopwatch = document.getElementById('Stopwatch')

export class Game {
    constructor(){
        this.handleAnswer = this.registerAnswer.bind(this)
        this.playBtn = document.querySelector('#Play')
        this.playBtn?.addEventListener('click', this.play.bind(this))
        this.cadenceBtn = document.querySelector('#PlayCadence')
        this.cadenceBtn?.addEventListener('click', this.playCadence.bind(this))
        this.notesBtn = document.querySelector('#PlayNotes')
        this.notesBtn?.addEventListener('click', function(){
            this.playNotes(0)
        }.bind(this))

        this.playCount = 0
    }
    play(){
        this.playCount += 1
        if(this.playBtn.isPlaying){ 
            this.pause()
            return
        }
        let playCadence = this.playCount === 1 || Number.isInteger((this.playCount - 1) / User.get('cadenceevery', 'number'))
        if(playCadence){
            this.playCadence()
        } else {
            this.offset = .25 // in seconds
        }

        document.addEventListener('answer', this.handleAnswer)
        //clears the piano
        document.dispatchEvent(new CustomEvent('game:ask'))
        //notes which the user must answer
        let noteSet = Transposer.transpose(User.get('set', 'array'))
        User.notes = random(User.get('note_count','number'), noteSet)
        //duplicate to remember which were selected
        User.selected_notes = this.setOctaves(JSON.parse(JSON.stringify(User.notes)))
        //assign to previous note array
        User.previous_notes = User.selected_notes

        User.notes = this.setOctave(User.notes)

        this.setButtonState('PAUSE', 'bg-yellow-gradient', true)
        this.playNotes()
        setTimeout(() => {
            if(this.playBtn.isPlaying) document.dispatchEvent(new CustomEvent('game:afterask'))
        },this.offset * 1000)
    }
    playCadence(){
        if(this.playingCadence) return
        this.playingCadence = true
        this.offset = cadence()
        setTimeout( function(){
            this.playingCadence = false
        }.bind(this), this.offset * 1000)
    }
    playNotes(offset = this.offset){
        User.selected_notes ? play_sequence([{ sequence: User.selected_notes.map( note => note.join('')), duration: 1 }], offset) : null;
    }
    pause(){
        this.setButtonState('PLAY', 'bg-green-gradient', false)
        document.dispatchEvent(new CustomEvent('game:pause'))
    }
    setButtonState(state, colorClass, playing){
        removeClassStartsWith(this.playBtn, 'bg-')
        this.playBtn.classList.add(colorClass)
        this.playBtn.innerText = state
        this.playBtn.isPlaying = playing
    }
    setOctave(arr){
        return arr.map( note => `${note}${User.get('cadenceoctave', 'number')}` )
    }
    setOctaves(arr){
        let range = User.getOctaveRange()
        return arr.map( note => [note,`${User.getOctaveRange()[0] + Math.floor(Math.random() * (range[1] - range[0]))}`])
    }
    registerAnswer(e){
        let note_with_octave = e.detail.note_with_octave
        Gameify.total += 1
        let updateEvent = new CustomEvent('gameify:update', { detail: e.detail })
        if(User.notes.indexOf(note_with_octave) == -1){
            Gameify.streak = 0
            e.detail.msg = 'wrongNote'
            document.dispatchEvent(updateEvent)
            return 
        }
        if(Stopwatch.status == 'success'){
            Gameify.streak += 1
            Gameify.correct += 1
            e.detail.msg = 'rightNote'
            document.dispatchEvent(updateEvent)
        }
        if(Stopwatch.status == 'fail'){
            Gameify.streak = 0
            Gameify.late += 1
            e.detail.msg = 'lateAnswer'
            document.dispatchEvent(updateEvent)
        }

        User.notes.splice(User.notes.indexOf(note_with_octave), 1)
        
        if(User.notes.length == 0){
            document.removeEventListener('answer', this.handleAnswer)
            document.dispatchEvent(new CustomEvent('game:answercomplete'))
            this.setButtonState('PLAY', 'bg-green-gradient', false)
            setTimeout(this.play.bind(this), 350)
        }
    }
}
