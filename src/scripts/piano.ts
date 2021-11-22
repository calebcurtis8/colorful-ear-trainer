import * as Tone from 'tone'

import PianoKeys from '@jesperdj/pianokeys';

import User from './user'

const piano = document.getElementById("piano");

import { Transposer } from './transpose';

const keyboard = new PianoKeys.Keyboard(piano, {
    lowest: `C${ User.get('octave', 'number') }`,
    highest: `B${ User.get('octave', 'number') }`
});

class PianoPlayer {
    piano: {};
    notesDown: [];
    constructor(pno) {
        this.piano = pno
        this.notesDown = []
        this.handlePlay = this.play.bind(this)
        this.handleListen = this.listen.bind(this)
        this.playback = true
        
        this.piano.addEventListener('click', this.handlePlay)
        this.piano.addEventListener('click', this.handleListen)
        document.addEventListener('question:start', this.clear.bind(this))

        this.setKeyNames()

        document.addEventListener('transpose', this.setKeyNames.bind(this))
    }
    setKeyNames(){
        keyboard._keys.forEach( (key, i) => {
            let noteIndex = i - (User.get('octave', 'number') * 12)
            key.setAttribute('data-note', Transposer.noteNames(noteIndex))
        })
    }
    async play(e) {
        if(!this.playback) return
        await Tone.start()
        let key = e.target.getAttribute('data-note').split(',')[0]
        const synth = new Tone.Synth().toDestination();

        //play the note for the duration of an 8th note
        let note = this.formatNote(key)
    
        synth.triggerAttackRelease(note, "8n");        
    }
    listen(e){
        let key = e.target.getAttribute('data-note').split(',')
        let matchKey = false
        let notes = User.selected_notes || []
        notes.filter( n => {
            if(key.indexOf(n[0]) > -1){
                matchKey = n[0]
                return true
            }
            return false
        })
        let note = matchKey ? this.formatNote(matchKey) : this.formatNote(key[0]);
        //if octave independent note is a match, highlight it
        if(matchKey) {
            this.piano.removeEventListener('click', this.handlePlay)
            keyboard.fillKey(note)
            this.notesDown.push(note)
            this.piano.addEventListener('click', this.handlePlay)
        } else if (notes.length > 0){
            keyboard.fillKey(note, 'rgba(185, 28, 28, 1)')
            this.notesDown.push(note)
        } else {
            keyboard.fillKey(note, '#fbbf24')
            setTimeout( function(){
                keyboard.clearKey(note)
            }, 300)
        }
        document.dispatchEvent(new CustomEvent('answer', { detail: note }))
    }
    clear(){
        this.notesDown.forEach( note => {
            keyboard.clearKey(note)
        })
    }
    formatNote(note){
        return `${ note }${ User.get('octave','number') }`
    }
}

new PianoPlayer(piano)