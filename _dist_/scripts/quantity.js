import '../styles/quantity.css.proxy.js';

class QuantitySelector extends HTMLElement {
    constructor(){
        super()
        this.input = this.querySelector('input[type="number"]')
        this.plus = this.querySelector('[data-increment]')
        this.minus = this.querySelector('[data-decrement]')
        //listeners
        this.plus.addEventListener('click', this.increment.bind(this))
        this.minus.addEventListener('click', this.decrement.bind(this))
        this.event = new CustomEvent('change', { bubbles: true })
    }
    increment(e){
      e.preventDefault()
      let step = parseFloat(this.input.step) || 1
      if(e.shiftKey) step = step * 10
      this.input.value = parseFloat(this.input.value) + step
      this.dispatchChangeEvent()
    }
    decrement(e){
      e.preventDefault()
      let step = parseFloat(this.input.step) || 1
      if(e.shiftKey) step = step * 10
      this.input.value = parseFloat(this.input.value) - step
      this.dispatchChangeEvent()
    }
    dispatchChangeEvent(){
      this.input.dispatchEvent(this.event)
    }
  }

  customElements.define('quantity-selector', QuantitySelector);