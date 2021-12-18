import { NOTE_NAMES } from './note_names'

const keyCenterElm = document.getElementById('KeyCenter')

document.addEventListener('user:update', function(){
    document.dispatchEvent(new CustomEvent('transpose'))
})

// const AllNotes = NOTE_NAMES.all
const Flats = NOTE_NAMES.flats
const Sharps = NOTE_NAMES.sharps


const Transposer = {
    notes : [
        Flats,
        Flats,
        Sharps,
        Flats,
        Sharps,
        Flats,
        Flats,
        Sharps,
        Flats,
        Sharps,
        Flats,
        Sharps
    ],
    transpose({ set = [], keyCenter = keyCenterElm.value, octave = 4, flatten = true, with_octave = false } = {}){
        //make sure set is an array
        Array.isArray(set) ? set = set : set = [set]
        //make sure keyCenter is an int
        keyCenter = parseInt(keyCenter)
        set = set.map( note => {
            const noteValue = parseInt(note) + keyCenter
            let oct = noteValue > 11 && !flatten ? octave + 1 : octave;
            oct = noteValue < 0 && !flatten ? octave - 1 : octave;
            let n = this.notes[keyCenter][this.normalizeIndex(noteValue)]
            if(with_octave) n = `${ n }${ oct }`
            return n
        })
        return set
    },
    notesAsNumber(set, keyCenter = keyCenterElm.value){
        Array.isArray(set) ? set = set : set = [set]
        keyCenter = parseInt(keyCenter)
        set = set.map( name => {
            return this.notes[keyCenter].indexOf(name)
        })
        return set
    },

    normalizeIndex(i) {
        i = i < 0 ? i + 12 : i;
        i = i > 11 ? i - 12 : i;
        return i;
    }
}

class KeySelector extends HTMLElement {
    constructor(){
        super()
        this.set = this.querySelector('#NoteSet')
        this.inactiveSet = this.querySelector('#InactiveSet')
        this.setSelector = this.querySelectorAll('.note-sets option')

        document.dispatchEvent(new CustomEvent('transpose'))
        document.addEventListener('transpose', this.transposeSetSelector.bind(this))
        this.transposeSetSelector()
    }
    transposeSetSelector() {
        const tonalityElm = document.getElementById('Tonality')
        const tonality = tonalityElm.value.split(',')[0]
        const selectedIndex = this.set.selectedIndex
        this.setSelector.forEach( (set,i) => {
            const regex = /\{(.*?)}/gm;
            let str = set.getAttribute('data-template');
            let m;

            while ((m = regex.exec(str)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                str = str.replaceAll(m[0], Transposer.transpose({ set: [m[1]], keyCenter: keyCenterElm.value}))
            }
            set.innerText = str
            //apply major / minor filter
            if(set.getAttribute('data-tonality').indexOf(tonality) == -1){
                this.inactiveSet.appendChild(set)
            } else {
                this.set.appendChild(set)
            }
        })
        if(this.set[selectedIndex]) this.set.value = this.set[selectedIndex].value
        
    }
}

customElements.define('key-selector', KeySelector);

export default Transposer