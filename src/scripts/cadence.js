import { play_sequence } from './play_sequence'

import User from './user'

let octave = User.get('octave','number')

let Cadence = () => [
    {
        sequence: [
            `C${octave}`,`E${octave}`,`G${octave}`
        ],
        duration: 2,
    },
    {
        sequence: [
            `C${octave}`,`F${octave}`,`A${octave}`
        ],
        duration: 1,
    },
    {
        sequence: [
            `D${octave}`,`G${octave}`,`B${octave}`
        ],
        duration: 1,
    },
    {
        sequence: [
            `C${octave}`,`E${octave}`,`G${octave}`
        ],
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