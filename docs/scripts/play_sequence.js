import * as Tone from '../_snowpack/pkg/tone.js'

import User from './user.js'

let Speed = () => User.get('bpm', 'tempo')

export function play_sequence(seq, offset) {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = offset ? offset + Tone.now() : Tone.now();

    let time = 0
    seq.forEach( chord => {
        chord.sequence.forEach( note => {
            synth.triggerAttack(note, now + time);
        })
        let duration = chord.duration * Speed()
        synth.triggerRelease(chord.sequence, now + duration + time )

        time += duration
    })
}