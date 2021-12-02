import * as Tone from '../../_snowpack/pkg/tone.js'

import User from './user.js'

import Tempo from './tempo.js'

const Speed = () => Tempo()

let synth = new Tone.PolySynth(Tone.Synth).toDestination()

document.addEventListener('game:stop', () => {
    synth.disconnect()
    synth = new Tone.PolySynth(Tone.Synth).toDestination()
})

export async function play_sequence(seq, offset) {
    await Tone.start()
    synth.toDestination()
    const now = offset ? offset + Tone.now() : Tone.now();

    let time = 0
    seq.forEach( chord => {
        const duration = chord.duration * Speed()
        chord.sequence.forEach( note => {
            synth.triggerAttackRelease(note, duration, now + time);
        })
        time += duration
    })
}