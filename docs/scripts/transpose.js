const keyCenterElm = document.getElementById('KeyCenter')
keyCenterElm.addEventListener('change', function(){
    document.dispatchEvent(new CustomEvent('transpose'))
})

const AllNotes = ["C", ["C#","Db"], "D", ["D#","Eb"], "E", "F", ["F#","Gb"], "G", ["G#","Ab"], "A", ["A#","Bb"], "B"]
const Flats = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
const Sharps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
export const Transposer = {
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
    transpose(set, keyCenter = keyCenterElm.value){
        //make sure set is an array
        Array.isArray(set) ? set = set : set = [set]
        //make sure keyCenter is an int
        keyCenter = parseInt(keyCenter)
        set = set.map( note => this.notes[keyCenter][this.normalizeIndex(parseInt(note) + keyCenter)])
        return set
    },
    noteNames(set, keyCenter = keyCenterElm.value){
        //make sure set is an array
        Array.isArray(set) ? set = set : set = [set]
        //make sure keyCenter is an int
        keyCenter = parseInt(keyCenter)
        set = set.map( note => AllNotes[this.normalizeIndex(parseInt(note))])
        return set
    },
    normalizeIndex(i) {
        return i > 11 ? i - 12 : i;
    }
}

class KeySelector extends HTMLElement {
    constructor(){
        super()
        this.setSelector = this.querySelectorAll('#NoteSet option')

        document.dispatchEvent(new CustomEvent('transpose'))
        document.addEventListener('transpose', this.transposeSetSelector.bind(this))
    }
    transposeSetSelector() {
        this.setSelector.forEach( set => {
            const regex = /\{(.*?)}/gm;
            let str = set.getAttribute('data-template');
            let m;

            while ((m = regex.exec(str)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                str = str.replaceAll(m[0], Transposer.transpose([m[1]], keyCenterElm.value))
            }
            set.innerText = str
        })
    }
}

customElements.define('key-selector', KeySelector);