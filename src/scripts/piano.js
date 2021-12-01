import * as Tone from 'tone'

import User from './user'

import { NOTE_NAMES } from './note_names'

let synth = new Tone.Synth().toDestination()

const piano = document.getElementById("Piano");

const POSSIBLE_KEY_VALUES = NOTE_NAMES.all

piano.fillKey = function(note, color){
    const key = this.getNote(note)
    if(key) key.style.fill = color
}

piano.getNote = function( note ){
    return this.querySelector(`[data-note="${ note }"]`)
}

piano.clearKey = function(note){
    const key = this.getNote(note)
    if(key) key.style.fill = null
}
class PianoPlayer {
    constructor(pno) {
        this.piano = pno
        this.notesDown = []
        this.handlePlayClick = this.playClick.bind(this)
        this.handleListenClick = this.listenClick.bind(this)
        this.handleListenKeys = this.listenKeys.bind(this)
        this.handleListenShifts = this.listenShifts.bind(this)
        this.playback = true
        this.notesDown = []
        this.piano.addEventListener('mousedown', this.handlePlayClick)
        this.piano.addEventListener('mousedown', this.handleListenClick)
        document.addEventListener('keyup', this.handleListenKeys)
        document.addEventListener('keydown', this.handleListenShifts)
        document.addEventListener('keyup', this.handleListenShifts)
        document.addEventListener('game:stop', this.stop.bind(this))
    }
    async play(key) {
        if(!this.playback) return
        await Tone.start()

        //play the note for the duration of an 8th note
        const note = this.formatNote(key)
    
        synth.triggerAttackRelease(note, "8n");        
    }
    playClick(e){
        const key = e.target.getAttribute('data-note').split(',')[0]
        this.play(key)
    }
    listenClick(e){
        this.listen(e.target.getAttribute('data-note'))
    } 
    listenShifts(e){
        if(!(e.code == 'ShiftLeft' || e.code == 'ShiftRight')) return
        if(e.type == 'keyup'){
            if(e.code == 'ShiftLeft') this.shiftLeftActive = false
            if(e.code == 'ShiftRight') this.shiftRightActive = false
        }
        if(e.type == 'keydown'){
            if(e.code == 'ShiftLeft') this.shiftLeftActive = true
            if(e.code == 'ShiftRight') this.shiftRightActive = true
        }
    }
    listenKeys(e){
        const key = e.key.toUpperCase()
        if(POSSIBLE_KEY_VALUES.indexOf(key) == -1) return
        const sharp = this.shiftRightActive
        const flat = this.shiftLeftActive
        if(sharp && flat) return
        const note = `${ key }${ sharp ? '#' : '' }${ flat ? 'b' : '' }`;
        const matches = POSSIBLE_KEY_VALUES.filter( k => {
            if(Array.isArray(k)){
                return k.indexOf(note) > -1
            }
            return k === note
        })
        let match = matches.map( k => {
            if(Array.isArray(k)) return k.join(',')
            return k
        })
        if(!match.length) return
        match = match.join('')
        this.listen(match)

        this.play(match.split(',')[0])
    }
    listen(fullKey){
        const key = fullKey.split(',')
        let matchKey = false
        const notes = User.selected_notes || []
        notes.filter( n => {
            if(key.indexOf(n[0]) > -1){
                matchKey = n[0]
                return true
            }
            return false
        })
        const note = fullKey;
        //if octave independent note is a match, highlight it
        if(matchKey) {
            this.piano.removeEventListener('click', this.handlePlay)
            piano.fillKey(note, 'rgba(80, 240, 80, 1)')
            this.notesDown.push(note)
            this.piano.addEventListener('click', this.handlePlay)
        } else if (notes.length > 0){
            piano.fillKey(note, 'rgba(185, 28, 28, 1)')
            this.notesDown.push(note)
        } else {
            piano.fillKey(note, '#fbbf24')
            setTimeout( function(){
                piano.clearKey(note)
            }, 300)
        }
        const reportNote = matchKey ? this.formatNote(matchKey) : this.formatNote(key[0]);
        document.dispatchEvent(new CustomEvent('answer', { detail: { note_with_octave: reportNote, note: note, elm: piano.querySelector(`[data-note="${ note }"]`) } }))
    }
    clear(){
        this.notesDown.forEach( note => {
            piano.clearKey(note)
        })
    }
    formatNote(note){
        return `${ note }${ User.get('cadenceoctave','number') }`
    }
    stop(){
        synth.disconnect()
        synth = new Tone.Synth().toDestination()
    }
}

const Piano = new PianoPlayer(piano)

export default Piano