
import "piano-keys-webcomponent-v0";

import './piano'

import cadence from './cadence'
import random from "./random";
import { play_sequence } from './play_sequence'

import User from './user'
import Gameify from './gameify'

export class Game {
    constructor(){
        this.handleAnswer = this.registerAnswer.bind(this)
        document.querySelector('#Play')?.addEventListener('click', this.play.bind(this))
        document.querySelector('#PlayCadence')?.addEventListener('click', this.playCadence.bind(this))
        document.querySelector('#PlayNotes')?.addEventListener('click', function(){
            this.playNotes(0)
        }.bind(this))
    }
    play(){
        this.playCadence()
        document.addEventListener('answer', this.handleAnswer)
        //clears the piano
        document.dispatchEvent(new CustomEvent('question:start'))
        //notes which the user must answer
        User.notes = random(User.get('note_count','number'), User.get('set', 'array'))
        //duplicate to remember which were selected
        User.selected_notes = this.setOctaves(JSON.parse(JSON.stringify(User.notes)))
        User.notes = this.setOctave(User.notes)

        this.playNotes()
    }
    playCadence(){
        this.offset = cadence()
    }
    playNotes(offset = this.offset){
        User.selected_notes ? play_sequence([{ sequence: User.selected_notes, duration: 1 }], offset) : null;
    }
    setOctave(arr){
        return arr.map( note => `${note}${User.get('octave', 'number')}` )
    }
    setOctaves(arr){
        return arr.map( note => `${note}${User.get('octave', 'number') + Math.floor(Math.random() * User.get('spread','number'))}`)
    }
    registerAnswer(e){
        if(User.notes.indexOf(e.detail) == -1){
            Gameify.streak = 0
            Gameify.total += 1
            this.dispatchUpdateEvent()
            return 
        }
        Gameify.streak += 1
        Gameify.correct += 1
        Gameify.total += 1
        this.dispatchUpdateEvent()

        User.notes.splice(User.notes.indexOf(e.detail), 1)
        
        if(User.notes.length == 0){
            document.removeEventListener('answer', this.handleAnswer)
            setTimeout(this.play.bind(this), 350)
        }
    }
    dispatchUpdateEvent(){
        document.dispatchEvent(new CustomEvent('gameify:update'))
    }
}