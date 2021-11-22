import * as Tone from 'tone'

import { PianoElement } from "piano-keys-webcomponent-v0/dist/piano";

import User from './user'

const piano = document.getElementById("piano") as PianoElement;

class PianoPlayer {
    piano: {};
    notesDown: [];
    constructor(pno) {
        this.piano = pno
        this.notesDown = []
        this.handlePlay = this.play.bind(this)
        this.handleListen = this.listen.bind(this)
        this.piano.addEventListener('note-down', this.handlePlay)
        this.piano.addEventListener('note-down', this.handleListen)
        document.addEventListener('question:start', this.clear.bind(this))
    }
    play(e) {
        let key = e.detail
        const synth = new Tone.Synth().toDestination();

        //play the note for the duration of an 8th note
        let note = this.formatNote(key.note)

        synth.triggerAttackRelease(note, "8n");        
    }
    listen(e){
        let key = e.detail
        let notes = User.selected_notes || []
        let note = this.formatNote(key.note)

        if(notes.indexOf(note) > -1) {
            this.piano.removeEventListener('note-down', this.handlePlay)
            this.piano.setNoteDown(key.note, 0)
            this.notesDown.push([key.note, 0])
            this.piano.addEventListener('note-down', this.handlePlay)
        }
        document.dispatchEvent(new CustomEvent('answer', { detail: note }))
    }
    clear(){
        this.notesDown.forEach( note => {
            this.piano.setNoteUp(note[0], note[1])
        })
    }
    formatNote(note){
        return `${ note }${ User.get('octave','number') }`
    }
}

new PianoPlayer(piano)