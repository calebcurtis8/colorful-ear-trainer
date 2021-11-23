import noUiSlider from 'nouislider'
import 'nouislider/dist/nouislider.css'

const STORAGE = 'EarTrainerUser'
class DefineUser extends HTMLElement {
    constructor(){
        super()
        this.addListeners()
        this.storage = JSON.parse(localStorage.getItem(STORAGE)) || {}
        this.inputs = this.querySelectorAll('input,select')
        this.previous_notes = []
        this.inputs.forEach( input => {
            let name = input.getAttribute('name')
            let value = this.storage[name]
            if(value) input.value = value
            input.dispatchEvent(new CustomEvent('change', { bubbles: true }))
            this.set(name, input.value)
        })

        this.rangeElm = this.querySelector('#NoteRange')

        this.range = noUiSlider.create(this.rangeElm, {
            start: [4,5],
            margin: 1,
            snap: true,
            connect: true,
            tooltips: true,
            range: {
                'min': 0,
                '14.29%': 1,
                '28.57%': 2,
                '42.86%': 3,
                '57.14%': 4,
                '71.42%': 5,
                '85.71%': 6,
                'max': 7
            },
            format: {
                to: function (value) {
                    return value;
                },
                from: function (value) {
                    return Number(value.replace('.00', ''));
                }
            }
        })

        this.loadOctaveRange()
        this.range.on('change', this.saveOctaveRange.bind(this))
    }
    set(attr, value){
        this.storage[attr] = value
        localStorage.setItem(STORAGE, JSON.stringify(this.storage))
    }
    get(attr, as = 'normal'){
        let value = this.querySelector(`[name="${attr}"]`).value
        return this[as](value)
    }
    getOctaveRange(){
        return this.range.get()
    }
    loadOctaveRange(){
        let value = JSON.parse(localStorage.getItem(STORAGE)).range
        if(value) this.range.set(value)
    }
    saveOctaveRange(){
        this.set('range', this.getOctaveRange())
    }
    tempo(input){
        return (60 / parseInt(input))
    }
    number(input){
        return parseInt(input)
    }
    float(input){
        return parseFloat(input)
    }
    array(input){
        return JSON.parse(input)
    }
    normal(input){
        return input
    }
    addListeners(){
        this.addEventListener('change', this.update.bind(this))
        this.addEventListener('keyup', this.update.bind(this))
    }
    update(e){
        if(!e.target.getAttribute('name')) return
        this.set(e.target.getAttribute('name'), e.target.value)
        document.dispatchEvent(new CustomEvent('userupdate'))
    }
}

customElements.define('define-user', DefineUser);

const User = document.getElementById('User')

export default User