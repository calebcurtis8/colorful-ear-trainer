import { play_sequence } from './play_sequence'

import User from './user'

import { Transposer } from './transpose'

function formatChord(chord){
    return Transposer.transpose(chord).map( note => `${note}${User.get('cadenceoctave','number')}` )
}

const Major = [
    [ 0,4,7 ],
    [ 0,5,9 ],
    [ 2,7,11, ],
    [ 0,4,7 ]
]
const Minor = [
    [ 0,3,7 ],
    [ 0,5,8 ],
    [ 2,7,10 ],
    [ 0,3,7 ]
]

let tonality = function(){
    switch (User.get('tonality')) {
        case 'major':
            return Major
            break;
        case 'minor':
            return Minor
            break;
        default:
            return Major
            break;
    }
}

let Cadence = () => [
    {
        sequence: formatChord(tonality()[0]),
        duration: 2,
    },
    {
        sequence: formatChord(tonality()[1]),
        duration: 1,
    },
    {
        sequence: formatChord(tonality()[2]),
        duration: 1,
    },
    {
        sequence: formatChord(tonality()[3]),
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