import noUiSlider from '../_snowpack/pkg/nouislider.js'
import '../_snowpack/pkg/nouislider/dist/nouislider.css.proxy.js'

const STORAGE = 'EarTrainerUser'

class DefineUser extends HTMLElement {
    constructor(){
        super()
        this.addListeners()
        
        this.inputs = this.querySelectorAll('input,select')

        this.rangeElm = this.querySelector('#NoteRange')
        this.levelElm = this.querySelector('#Level')
        this.levels = this.getJson('./levels.json')

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

        
        this.range.on('change', this.saveOctaveRange.bind(this))

        this.handleLevelChange = this.loadLevel.bind(this)

        this.loadUser()
    }
    set(attr, value){
        if(!attr) return
        let storage = this.getStorage()
        storage[attr] = value
        localStorage.setItem(STORAGE, JSON.stringify(storage))
    }
    get(attr, as = 'normal'){
        let value = this.querySelector(`[name="${attr}"]`)
        return this[as](value)
    }
    getJson(url){
        return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(json => {
            return json
        })
        .catch(function () {
            this.dataError = true;
        })
    }
    getOctaveRange(){
        return this.range.get()
    }
    getStorage(){
        return JSON.parse(localStorage.getItem(STORAGE)) || {}
    }
    loadUser(){
        this.loadStorage()
        this.loadOctaveRange()
        this.levelElm?.addEventListener('change', this.handleLevelChange)
    }
    loadLevel(e){
        this.levelElm.removeEventListener('change', this.handleLevelChange)
        this.levels.then( data => {
            let level = data.filter( lvl => lvl.level == e.target.value )[0]
            if(!level) return
            localStorage.setItem(STORAGE, JSON.stringify(level))
            this.loadUser()
        })
    }
    loadOctaveRange(){
        let value = this.getStorage().range
        if(value) this.range.set(value)
    }
    loadStorage(){
        let storage = this.getStorage()
        this.inputs.forEach( input => {
            let name = input.getAttribute('name')
            let value = storage[name]
            let inputValue
            if(input.type == 'checkbox'){
                if(input.id == 'DarkMode') return
                if(value) input.checked = value
                inputValue = input.checked
            } else {
                if(value) input.value = value
                inputValue = input.value
            }
            input.dispatchEvent(new CustomEvent('change', { bubbles: true }))
            this.set(name, inputValue)
        })
    }
    saveOctaveRange(){
        this.set('range', this.getOctaveRange())
    }
    tempo(input){
        return (60 / parseInt(input.value))
    }
    number(input){
        return parseInt(input.value)
    }
    float(input){
        return parseFloat(input.value)
    }
    array(input){
        return JSON.parse(input.value)
    }
    checkbox(input){
        return input.checked
    }
    normal(input){
        return input.value
    }
    addListeners(){
        this.addEventListener('change', this.update.bind(this))
        this.addEventListener('keyup', this.update.bind(this))
    }
    update(e){
        if(!e.target.getAttribute('name')) return
        if(e.target.type == 'checkbox'){
            this.set(e.target.getAttribute('name'), e.target.checked)
        } else {
            this.set(e.target.getAttribute('name'), e.target.value)
        }
        document.dispatchEvent(new CustomEvent('user:update'))
    }
}

customElements.define('define-user', DefineUser);

const User = document.getElementById('User')

export default User