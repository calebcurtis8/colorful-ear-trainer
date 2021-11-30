import Transposer from './transpose.js'

import noUiSlider from '../../_snowpack/pkg/nouislider.js'
import '../../_snowpack/pkg/nouislider/dist/nouislider.css.proxy.js'

const STORAGE = 'EarTrainerUser'

class DefineUser extends HTMLElement {
    constructor(){
        super()
        this.addListeners()
        
        this.inputs = this.querySelectorAll('input,select')

        this.rangeElm = this.querySelector('#NoteRange')
        this.levelElm = document.getElementById('Level')
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

        this.loadLevel({ target: this.levelElm })
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
        this.loadOctaveRange()
        this.levelElm?.addEventListener('change', this.handleLevelChange)
    }
    loadLevel(e){
        const value = e?.target?.value || 0;
        if(value == 0){
            document.getElementById('UserCard')?.classList.remove('hidden')
            document.getElementById('LevelInfo')?.classList.add('hidden')
            return
        }
        document.getElementById('UserCard')?.classList.add('hidden')
        document.getElementById('LevelInfo')?.classList.remove('hidden')
        this.levelElm.removeEventListener('change', this.handleLevelChange)
        const level = this.levels.filter( lvl => lvl.level == value )[0]
        if(!level) return

        //display level attributes
        const displayElm = document.getElementById('LevelInfo')
        Object.entries(level).forEach( entry => {
            //fill the level info display area with values
            const elm = displayElm.querySelector(`[data-name="${ entry[0] }"]`)
            if(!elm) return
            const parser = elm.getAttribute('data-format')
            this[parser] ? elm.innerHTML = this[parser]( entry[1] ) : elm.innerHTML = entry[1];

            const input = document.querySelector(`[name=${entry[0]}]`)
            if(!input) return
            //window scoped function...
            setInputValue(input, entry[1])
        })

        displayElm.classList.remove('h-0')
        displayElm.classList.add('h-auto')

        this.loadUser()
    }
    loadOctaveRange(){
        const value = this.getStorage().range
        if(value) this.range.set(value)
    }
    saveOctaveRange(){
        this.set('range', this.getOctaveRange())
    }
    tempo(input){
        const value = input.value ? input.value : input;
        return (60 / parseInt(value))
    }
    number(input){
        const value = input.value ? input.value : input;
        return (value ? parseInt(value) : null)
    }
    float(input){
        const value = input.value ? input.value : input;
        return parseFloat(value)
    }
    array(input){
        const value = input.value ? input.value : input;
        return JSON.parse(value)
    }
    checkbox(input){
        return input.checked
    }
    checkmark(input){
        return (input ? 'x' : '')
    }
    optiontext(input){
        const elm = this.querySelector(`[value="${ input }"]`)
        return ( elm ? elm.innerText : null) 
    }
    transpose(input){
        //validate as array
        input = JSON.parse(input)
        if(!Array.isArray(input)) input = [input]
        input = Transposer.transpose(input)  
        return input.join(', ')
    }
    normal(input){
        const value = input.value ? input.value : input;
        return value
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