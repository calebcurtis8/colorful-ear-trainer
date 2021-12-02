import { play_sequence } from './play_sequence.js'

import User from './user.js'

import Tempo from './tempo.js'

import Transposer from './transpose.js'

function formatChord(chord) {
    return Transposer.transpose(chord).map(note => `${note}${User.get('cadenceoctave','number')}`)
}

const Major = {
    1451: [
        [0, 4, 7],
        [0, 5, 9],
        [2, 7, 11],
        [0, 4, 7]
    ],
    1251: [
        [0, 4, 7],
        [2, 5, 9, 0],
        [2, 7, 11, 0],
        [0, 4, 7]
    ],
    1441: [
        [0, 4, 7],
        [0, 5, 9],
        [0, 5, 8],
        [0, 4, 7]
    ]
}
const Minor = {
    1451: [
        [0, 3, 7],
        [0, 5, 8],
        [2, 7, 10],
        [0, 3, 7]
    ],
    14571: [
        [0, 3, 7],
        [0, 5, 8],
        [2, 7, 11, 0],
        [0, 3, 7]
    ]
}

const Tonality = function () {
    let progression = User.get('tonality').split(',')
    switch (progression[0]) {
        case 'major':
            return Major[progression[1]]
            break;
        case 'minor':
            return Minor[progression[1]]
            break;
        default:
            return Major
            break;
    }
}

const Cadence = () => {
    let progression = Tonality().map( (chord, i) => {
        return {
            sequence: formatChord(chord),
            duration: (i == 0 || i == 3 ? 2 : 1)
        }
    })
    return progression
}

function duration(seq) {
    let total = 0
    seq.forEach(notes => total += (notes.duration * Tempo()))
    return total
}

export default function cadence() {
    {
        play_sequence(Cadence())
        return duration(Cadence())
    }
}