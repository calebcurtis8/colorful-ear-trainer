class MinutesSeconds extends HTMLElement {
    constructor() {
        super()

        this.inputs = this.querySelectorAll('input[type="text"]')
        this.valueElm = this.querySelector('input[name="countdown"]')
        this.minutes = this.querySelector('#CountdownMinutes')
        this.seconds = this.querySelector('#CountdownSeconds')
        this.btnIncrement = this.querySelector('[data-increment]')
        this.btnDecrement = this.querySelector('[data-decrement]')
        this.inputs.forEach( input => {
            input.addEventListener('change', this.validate.bind(this))
            input.addEventListener('blur', this.validate.bind(this))
            input.addEventListener('keyup', this.arrowKeys.bind(this))
        })

        let _this = this
        this.btnIncrement.addEventListener('click', (e) => {
            _this.increment(_this.seconds, e.shiftKey)
        })
        this.btnDecrement.addEventListener('click', (e) => {
            _this.decrement(_this.seconds, e.shiftKey)
        })

        this.setValue()
    }
    arrowKeys(e){
        let useKeys = ['ArrowUp','ArrowDown']
        if(useKeys.indexOf(e.key) == -1) return
        e.preventDefault()
        switch (e.key) {
            case 'ArrowUp':
                this.increment(e.target, e.shiftKey)
                break;
            case 'ArrowDown':
                this.decrement(e.target, e.shiftKey)
                break;
            default:
                break;
        }
    }
    validate(e) {
        let input = e.target
        if(input.value.length == 1) input.value = '0' + input.value
        this.setValue()
    }
    setValue(){
        //set value in seconds
        this.valueElm.value = (parseInt(this.minutes.value) * 60) + parseInt(this.seconds.value)
    }
    increment(input, shift){
        let min = parseInt(input.getAttribute('min'))
        let max = parseInt(input.getAttribute('max'))
        let step = parseInt(input.getAttribute('step'))
        if(shift) step = step * 10;
        let value = parseInt(input.value)
        let newValue = value + step
        if(newValue > max){
            newValue = min
            if(input.getAttribute('name') == 'countdown-seconds') this.increment(this.minutes)
        }
        input.value = newValue;
        input.dispatchEvent(new CustomEvent('change', { bubbles: true }))
    }
    decrement(input, shift){
        let min = parseInt(input.getAttribute('min'))
        let max = parseInt(input.getAttribute('max'))
        let step = parseInt(input.getAttribute('step'))
        if(shift) step = step * 10;
        let value = parseInt(input.value)
        let newValue = value - step
        if(newValue < min){
            newValue = max
            if(input.getAttribute('name') == 'countdown-seconds') this.decrement(this.minutes)
        }
        input.value = newValue;
        input.dispatchEvent(new CustomEvent('change', { bubbles: true }))
    }
}

customElements.define('minutes-seconds', MinutesSeconds)