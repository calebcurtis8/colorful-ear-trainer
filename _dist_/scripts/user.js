import Transposer from './transpose.js'
import noUiSlider from '../../_snowpack/pkg/nouislider.js'
import '../../_snowpack/pkg/nouislider/dist/nouislider.css.proxy.js'

const STORAGE = 'EarTrainerUser'

class DefineUser extends HTMLElement {
    constructor(){
        super()
        this.addListeners()
        
        this.inputs = this.querySelectorAll('input,select')

        this.noteSetElm = document.getElementById('NoteSet')
        this.rangeElm = document.getElementById('NoteRange')
        this.levelElm = document.getElementById('Level')
        this.modeElm = document.getElementById('Mode')
        this.levels = this.getJson('Levels')

        this.rangeElm.range = noUiSlider.create(this.rangeElm, {
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
        this.rangeElm.dispatchEvent(new CustomEvent('range:ready'))
        
        this.rangeElm.range.on('change', this.saveOctaveRange.bind(this))

        this.handleLevelChange = this.loadLevel.bind(this)

        this.loadUser()

        this.modeElm?.addEventListener('change', this.loadMode.bind(this))
        this.loadMode()
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
        return this.rangeElm.range.get()
    }
    getStorage(){
        return JSON.parse(localStorage.getItem(STORAGE)) || {}
    }
    loadUser(){
        this.levelElm?.addEventListener('change', this.handleLevelChange)
    }
    loadLevel(){
        const value = this.levelElm.querySelector('input:checked').value || 1;
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
            let append = elm.getAttribute('data-append')
            let content;
            this[parser] ? content = this[parser]( entry[1] ) : content = entry[1];
            if(append){
                parseInt(content) > 1 ? append = append.replace('(s)', 's') : append = append.replace('(s)','');
                content = content + append;
            }
            elm.innerHTML = content

            const input = document.querySelector(`[name=${entry[0]}]`)
            if(!input) return
            //window scoped function...
            setInputValue(input, entry[1])
        })

        displayElm.classList.remove('h-0')
        displayElm.classList.add('h-auto')

        document.dispatchEvent(new CustomEvent('user:levelchange'))

        this.loadUser()
    }
    loadMode(){
        const selected = this.modeElm.querySelector('input:checked')
        const UserCard = document.getElementById('UserCard')
        const LevelInfo = document.getElementById('LevelInfo')
        const AnimatedLabel = this.modeElm.querySelector('[data-animated-label]')
        if(selected.value === 'practice'){
            UserCard?.classList.remove('hidden')
            LevelInfo?.classList.add('hidden')
            AnimatedLabel.classList.remove('translate-x-full')
            document.dispatchEvent(new CustomEvent('user:levelchange'))
            return
        }
        // else 'play'
        UserCard?.classList.add('hidden')
        LevelInfo?.classList.remove('hidden')
        
        AnimatedLabel.classList.add('translate-x-full')
        setTimeout( () => {
            AnimatedLabel.classList.add('transition-all','duration-200')
        }, 200)
        this.loadLevel()
    }
    loadOctaveRange(){
        const value = this.getStorage().range
        if(value) this.rangeElm.range.set(value)
    }
    saveOctaveRange(){
        this.set('range', this.getOctaveRange())
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
    difference(input){
        return input[1] - input[0]
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
    noteset(input){
        const option = this.noteSetElm.querySelector(`option[value="${input}"]`)
        return (option ? option.innerText : input)
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