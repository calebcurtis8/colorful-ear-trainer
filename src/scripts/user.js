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
    }
    set(attr, value){
        this.storage[attr] = value
        localStorage.setItem(STORAGE, JSON.stringify(this.storage))
    }
    get(attr, as = 'normal'){
        let value = this.querySelector(`[name="${attr}"]`).value
        return this[as](value)
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