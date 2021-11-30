import noUiSlider from 'nouislider'
import 'nouislider/dist/nouislider.css'

const STORAGE = 'EarTrainerUser'
const CUSTOM_LEVEL = 'EarTrainerCustomLevel'

class DefineUser extends HTMLElement {
    constructor(){
        super()
        this.addListeners()
        
        this.inputs = this.querySelectorAll('input,select')

        this.rangeElm = this.querySelector('#NoteRange')
        this.levelElm = this.querySelector('#Level')
        this.levels = this.getJson('Levels')

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
        const storage = this.getStorage()
        storage[attr] = value
        localStorage.setItem(STORAGE, JSON.stringify(storage))
    }
    get(attr, as = 'normal'){
        const value = this.querySelector(`[name="${attr}"]`)
        return this[as](value)
    }
    getElm(attr){
        return this.querySelector(`[name="${attr}"]`)
    }
    getJson(id){
        const elm = document.getElementById(id)
        if(!elm) return false
        return JSON.parse(elm.innerText)
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
        const level = this.levels.filter( lvl => lvl.level == e.target.value )[0]
        if(!level) return
        localStorage.setItem(STORAGE, JSON.stringify(level))

        //display level attributes
        const displayElm = document.getElementById('LevelInfo')
        displayElm.innerText = ''
        Object.entries(level).forEach( entry => {
            const elm = document.createElement('div')
            elm.innerText = `${entry[0]}: ${entry[1]}`
            displayElm.appendChild(elm)
        })

        this.loadUser()
    }
    loadOctaveRange(){
        const value = this.getStorage().range
        if(value) this.range.set(value)
    }
    loadStorage(){
        const storage = this.getStorage()
        this.inputs.forEach( input => {
            const name = input.getAttribute('name')
            const value = storage[name]
            if(!value) return
            let inputValue = false
            if(input.type == 'checkbox'){
                if(input.id == 'DarkMode') return
                input.checked = value
                inputValue = input.checked
            } else if(input.tagName == 'SELECT'){
                if(input.querySelector(`option[value='${value}']`)){
                    inputValue = value
                    input.value = value
                }
            } else {
                input.value = value
                inputValue = input.value
            }
           
            if(inputValue) {
                input.dispatchEvent(new CustomEvent('change', { bubbles: true }))
                this.set(name, inputValue)
            }
        })
    }
    saveOctaveRange(){
        this.set('range', this.getOctaveRange())
    }
    tempo(input){
        return (60 / parseInt(input.value))
    }
    number(input){
        return (input?.value ? parseInt(input.value) : null)
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
        if(!e.target.getAttribute('name') || !e.target.value) return
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