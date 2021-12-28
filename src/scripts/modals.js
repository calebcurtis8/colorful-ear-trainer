class ModalToggle extends HTMLElement {
  constructor () {
    super()
    this.modal = document.getElementById(this.getAttribute('aria-controls'))
    this.addEventListener('click', this.toggle.bind(this))
  }

  toggle () {
    this.modal.classList.toggle('hidden')
  }
}

customElements.define('modal-toggle', ModalToggle)

class ModalContent extends HTMLElement {
  constructor () {
    super()
    this.addEventListener('click', this.hide.bind(this))
    document.addEventListener('keyup', this.escHide.bind(this))
  }

  hide () {
    this.classList.toggle('hidden')
  }

  escHide (e) {
    if (e.key.toUpperCase() !== 'ESCAPE') return
    this.classList.add('hidden')
  }
}

customElements.define('modal-content', ModalContent)
