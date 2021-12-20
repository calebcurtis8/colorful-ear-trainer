import { play_sequence } from './play_sequence'

import User from './user'

import Tempo from './tempo'

import Transposer from './transpose'

function formatChord(set) {
    return Transposer.transpose({ set, octave: User.get('cadenceoctave','number'), flatten: false, with_octave: true })
}

const Major = {
    1451: [
        [-12, 0, 4, 7],
        [-7, 0, 5, 9],
        [-5, 2, 7, 11],
        [-12, 0, 4, 7]
    ],
    1251: [
        [-12, 0, 4, 7],
        [-10, 2, 5, 9, 12],
        [-5, 2, 7, 11, 12],
        [-12, 0, 4, 7, 11]
    ],
    1441: [
        [-12, 0, 4, 7],
        [-7, 0, 5, 9],
        [-7, 0, 5, 8],
        [-12, 0, 4, 7]
    ]
}
const Minor = {
    1451: [
        [-12, 0, 3, 7],
        [-7, 0, 5, 8],
        [-5, 2, 7, 10],
        [-12, 0, 3, 7]
    ],
    14571: [
        [0, 3, 7, 12],
        [-7, 0, 8, 12],
        [-5, 2, 7, 11],
        [-12, 0, 3, 7]
    ]
}

const Tonality = function () {
    let progression = User.get('tonality').split(',')
    switch (progression[0]) {
        case 'major':
            return Major[progression[1]]
        case 'minor':
            return Minor[progression[1]]
        default:
            return Major
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
        const seq = Cadence()
        play_sequence(seq, 0, 0)
        return duration(seq)
    }
}