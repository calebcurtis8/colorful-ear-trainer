import { play_sequence } from './play_sequence.js'

import User from './user.js'

import { Transposer } from './transpose.js'

function formatChord(chord){
    return Transposer.transpose(chord).map( note => `${note}${User.get('octave','number')}` )
}

let Cadence = () => [
    {
        sequence: formatChord([ 0,4,7 ]),
        duration: 2,
    },
    {
        sequence: formatChord([ 0,5,9 ]),
        duration: 1,
    },
    {
        sequence: formatChord([ 2,7,11 ]),
        duration: 1,
    },
    {
        sequence: formatChord([ 0,4,7 ]),
        duration: 2,
    }
]

function duration(seq){
    let total = 0
    seq.forEach( notes => total += (notes.duration * User.get('bpm', 'tempo')))
    return total
}

export default function cadence(){
    {
        play_sequence(Cadence())
        return duration(Cadence())
    }
}