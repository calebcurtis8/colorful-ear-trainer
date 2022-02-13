import Transposer from './transpose'
import cadence from './cadence'
import random from './random'
import { playSequence } from './play_sequence'
import { removeClassStartsWith } from './remove-class-starts-with'

import User from './user'
import Gameify from './gameify'
import Piano from './piano'

const Stopwatch = document.getElementById('Stopwatch')
export class Game {
  constructor () {
    this.handleAnswer = this.registerAnswer.bind(this)
    this.playBtn = document.querySelector('#Play')
    this.playBtn?.addEventListener('click', this.playClick.bind(this))
    this.cadenceBtn = document.querySelector('#PlayCadence')
    this.cadenceBtn?.addEventListener('click', this.playCadence.bind(this))
    this.notesBtn = document.querySelector('#PlayNotes')
    this.notesBtn?.addEventListener('click', this.playNotes.bind(this))
    window.addEventListener('keydown', this.keyDown.bind(this))

    this.playCount = 0
    this.gameStarted = false

    document.addEventListener('countdown:expired', this.stop.bind(this))
    document.addEventListener('user:levelchange', this.stop.bind(this))
  }

  start () {
    document.dispatchEvent(new CustomEvent('game:start'))
    this.setButtonState('PAUSE', 'bg-yellow-gradient', 'playing')
    this.gameStarted = true
  }

  stop (e) {
    this.pause()
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

  keyDown (e) {
    switch (e.code.toLowerCase()) {
      case 'space':
        // play button
        this.playClick()
        break
      case 'enter':
      case 'keyn':
        // play notes
        this.playNotes()
        break
      case 'keyr':
        // play cadence
        this.playCadence()
        break
      default:
        break
    }
  }

  playClick () {
    if (this.playBtn.state === 'playing' || User.getSet().length <= 1) {
      this.pause()
      return
    }
    if (this.playBtn.state === 'paused') {
      this.setButtonState('PAUSE', 'bg-yellow-gradient', 'playing')
      document.dispatchEvent(new CustomEvent('game:continue'))
    }
    if (!this.gameStarted) this.start()
    this.play()
  }

  play () {
    this.playCount += 1

    const playCadence = this.playCount === 1 || Number.isInteger((this.playCount - 1) / User.get('cadenceevery', 'number'))

    // check if we are randomizing keys or not
    if (User.get('randomkey', 'checkbox') && playCadence) {
      const newKey = Math.floor(Math.random() * 12)
      const elm = User.getElm('keycenter')
      elm.value = newKey
      elm.dispatchEvent(new CustomEvent('change'))
    }

    // reset attempt count
    this.attempts = 0
    // notes which the user must answer
    const set = User.getSet()
    const noteSet = Transposer.transpose({ set })
    random(User.get('note_count', 'number'), noteSet)
      .then(notes => {
        User.notes = notes
        // duplicate to remember which were selected
        User.selected_notes_without_octave = JSON.parse(JSON.stringify(User.notes))
        User.selected_notes = this.setOctaves(User.selected_notes_without_octave)
        User.notes = this.setOctave(User.notes)

        if (playCadence) {
          this.playCadence().then(this.askNotes.bind(this))
        } else {
          setTimeout(this.askNotes.bind(this), 250)
        }
      })
  }

  playCadence () {
    return new Promise((resolve, reject) => {
      if (this.playingCadence) return
      this.playingCadence = true
      this.offset = cadence()
      setTimeout(function () {
        this.playingCadence = false
        resolve()
      }.bind(this), this.offset * 1000)
    })
  }

  playNotes () {
    if (User.selected_notes) playSequence([{ sequence: User.selected_notes.map(note => note.join('')), duration: 2.5 }], 0)
  }

  askNotes () {
    Piano.clear()
    if (this.playBtn.state === 'stopped' || this.playBtn.state === 'paused') return
    this.setButtonState('PAUSE', 'bg-yellow-gradient', 'playing')
    this.playNotes()
    document.addEventListener('answer', this.handleAnswer)
    // clears the piano
    document.dispatchEvent(new CustomEvent('game:ask'))
  }

  pause () {
    this.setButtonState('PLAY', 'bg-green-gradient', 'paused')
    document.dispatchEvent(new CustomEvent('game:pause'))
  }

  setButtonState (state, colorClass, playState) {
    removeClassStartsWith(this.playBtn, 'bg-')
    this.playBtn.classList.add(colorClass)
    this.playBtn.innerText = state
    this.playBtn.state = playState
  }

  setOctave (arr) {
    return arr.map(note => `${note}${User.get('cadenceoctave', 'number')}`)
  }

  setOctaves (arr) {
    const range = User.getOctaveRange()
    return arr.map(note => [note, `${User.getOctaveRange()[0] + Math.floor(Math.random() * (range[1] - range[0]))}`])
  }

  registerAnswer (e) {
    const noteWithOctave = e.detail.note_with_octave
    Gameify.total++
    this.attempts++
    e.detail.q = User.selected_notes_without_octave
    if (User.notes.indexOf(noteWithOctave) === -1) {
      Gameify.streak = 0
      e.detail.msg = 'wrongNote'
      e.detail.status = 0
      Gameify.punish(e.detail)
      Gameify.update(e.detail)
      return
    }
    if (Stopwatch.status === 'success') {
      Gameify.correct++
      e.detail.msg = 'rightNote'
      e.detail.status = 1
    }
    if (Stopwatch.status === 'fail') {
      Gameify.streak = 0
      Gameify.late++
      e.detail.msg = 'lateAnswer'
      e.detail.status = -1
      Gameify.punish(e.detail)
    }
    Gameify.update(e.detail)
    User.notes.splice(User.notes.indexOf(noteWithOctave), 1)

    if (User.notes.length === 0) {
      if (this.attempts === User.selected_notes.length && Stopwatch.status === 'success') {
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
