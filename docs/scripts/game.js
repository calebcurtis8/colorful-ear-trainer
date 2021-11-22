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
    }
    play(){
        this.playCadence()
        document.addEventListener('answer', this.handleAnswer)
        //clears the piano
        document.dispatchEvent(new CustomEvent('question:start'))
        //notes which the user must answer
        let noteSet = Transposer.transpose(User.get('set', 'array'))
        User.notes = random(User.get('note_count','number'), noteSet)
        //duplicate to remember which were selected
        User.selected_notes = this.setOctaves(JSON.parse(JSON.stringify(User.notes)))
        User.notes = this.setOctave(User.notes)

        this.setButtonState('PLAYING', 'bg-yellow-gradient')
        this.playNotes()
        setTimeout(() => {
            this.setButtonState('Enter Notes', 'bg-yellow-gradient')
            document.dispatchEvent(new CustomEvent('gameify:afternotes'))
        },this.offset * 1000)
    }
    playCadence(){
        this.offset = cadence()
    }
    playNotes(offset = this.offset){
        User.selected_notes ? play_sequence([{ sequence: User.selected_notes.map( note => note.join('')), duration: 1 }], offset) : null;
    }
    setButtonState(state, colorClass){
        removeClassStartsWith(this.playBtn, 'bg-')
        this.playBtn.classList.add(colorClass)
        this.playBtn.innerText = state
    }
    setOctave(arr){
        return arr.map( note => `${note}${User.get('octave', 'number')}` )
    }
    setOctaves(arr){
        return arr.map( note => [note,`${User.get('octave', 'number') + Math.floor(Math.random() * User.get('spread','number'))}`])
    }
    registerAnswer(e){
        if(User.notes.indexOf(e.detail) == -1){
            Gameify.streak = 0
            Gameify.total += 1
            this.dispatchUpdateEvent()
            return 
        }
        if(Stopwatch.status == 'success'){
            Gameify.streak += 1
            Gameify.correct += 1
        }
        if(Stopwatch.status == 'fail'){
            Gameify.streak = 0
            Gameify.late += 1
        }
        Gameify.total += 1
        this.dispatchUpdateEvent()

        User.notes.splice(User.notes.indexOf(e.detail), 1)
        
        if(User.notes.length == 0){
            document.removeEventListener('answer', this.handleAnswer)
            document.dispatchEvent(new CustomEvent('gameify:afteranswer'))
            setTimeout(this.play.bind(this), 350)
        }
    }
    dispatchUpdateEvent(){
        document.dispatchEvent(new CustomEvent('gameify:update'))
    }
}
