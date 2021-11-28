import * as Tone from '../../_snowpack/pkg/tone.js'

import User from './user.js'

let Speed = () => User.get('bpm', 'tempo')

const synth = new Tone.PolySynth(Tone.Synth).toDestination();

export async function play_sequence(seq, offset) {
    await Tone.start()
    const now = offset ? offset + Tone.now() : Tone.now();

    let time = 0
    seq.forEach( chord => {
        let duration = chord.duration * Speed()
        chord.sequence.forEach( note => {
            synth.triggerAttackRelease(note, duration, now + time);
        })
        time += duration
    })
}