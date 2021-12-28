class MinutesSeconds extends HTMLElement {
  constructor () {
    super()

    this.inputs = this.querySelectorAll('input[data-countdown]')
    this.valueElm = this.querySelector('input[name="countdown"]')
    this.minutes = this.querySelector('#CountdownMinutes')
    this.seconds = this.querySelector('#CountdownSeconds')
    this.btnIncrement = this.querySelector('[data-increment]')
    this.btnDecrement = this.querySelector('[data-decrement]')
    this.inputs.forEach(input => {
      input.addEventListener('change', this.validate.bind(this))
      input.addEventListener('blur', this.validate.bind(this))
      input.addEventListener('keyup', this.arrowKeys.bind(this))
      this.validate({ target: input })
    })

    this.btnIncrement.addEventListener('click', (e) => {
      this.increment(this.seconds, e.shiftKey)
    })
    this.btnDecrement.addEventListener('click', (e) => {
      this.decrement(this.seconds, e.shiftKey)
    })

    this.setValue()
  }

  arrowKeys (e) {
    const useKeys = ['ArrowUp', 'ArrowDown']
    if (useKeys.indexOf(e.key) === -1) return
    e.preventDefault()
    switch (e.key) {
      case 'ArrowUp':
        this.increment(e.target, e.shiftKey)
        break
      case 'ArrowDown':
        this.decrement(e.target, e.shiftKey)
        break
      default:
        break
    }
  }

  validate (e) {
    const input = e.target
    input.value = parseInt(input.value)
    if (input.value.length === 1) input.value = '0' + parseInt(input.value)
    this.setValue()
  }

  setValue () {
    // set value in seconds
    this.valueElm.value = (parseInt(this.minutes.value) * 60) + parseInt(this.seconds.value)
  }

  increment (input, shift) {
    const min = parseInt(input.getAttribute('min'))
    const max = parseInt(input.getAttribute('max'))
    let step = parseInt(input.getAttribute('step'))
    if (shift) step = step * 10
    const value = parseInt(input.value)
    let newValue = value + step
    if (newValue > max) {
      newValue = min
      if (input.getAttribute('name') === 'countdown-seconds') this.increment(this.minutes)
    }
    input.value = newValue
    input.dispatchEvent(new CustomEvent('change', { bubbles: true }))
  }

  decrement (input, shift) {
    const min = parseInt(input.getAttribute('min'))
    const max = parseInt(input.getAttribute('max'))
    let step = parseInt(input.getAttribute('step'))
    if (shift) step = step * 10
    const value = parseInt(input.value)
    let newValue = value - step
    if (newValue < min) {
      newValue = max
      if (input.getAttribute('name') === 'countdown-seconds') this.decrement(this.minutes)
    }
    input.value = newValue
    input.dispatchEvent(new CustomEvent('change', { bubbles: true }))
  }
}

customElements.define('minutes-seconds', MinutesSeconds)
