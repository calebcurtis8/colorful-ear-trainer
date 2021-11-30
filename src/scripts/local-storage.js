window.setInputValue = function(input, value){
    let inputValue = false
    if(input.type == 'checkbox'){
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
    }
}
class LoadLocal extends HTMLElement{
    constructor(){
        super()
        this.key = this.getAttribute('data-key')
        this.inputs = this.querySelectorAll('input,select')
        this.displays = this.querySelectorAll('[data-storage-key]')
        this.addEventListener('change', this.save.bind(this))
        const storage = JSON.parse(localStorage.getItem(this.key)) || {}

        if(!storage) return
        this.inputs.forEach( input => {
            const name = input.getAttribute('name')
            const value = storage[name]
            if(!value) return
            setInputValue(input, value)
        })

        this.displays.forEach( display => {
            const name = display.getAttribute('[data-storage-key]')
            const value = storage[name]
            if(!value) return
            display.innerText = value
        })
    }
    save(e){
        const name = e.target.name
        let inputValue
        if(e.target.type == 'checkbox'){
            inputValue = e.target.checked
        } else {
            inputValue = e.target.value
        }
        const value = inputValue
        const storage = JSON.parse(localStorage.getItem(this.key)) || {}
        storage[name] = value
        localStorage.setItem(this.key, JSON.stringify(storage))   
    }
}
customElements.define('local-storage', LoadLocal)