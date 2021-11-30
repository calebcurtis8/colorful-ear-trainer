const numbers = document.querySelectorAll('input[type="number"]');
(() => {
  numbers.forEach(num => {
    num.addEventListener('change', validate)
    num.addEventListener('blur', validate)
  })

  function validate(e) {
    const el = e.target || e
    if (el.type == "number" && el.max && el.min) {
      const step = parseFloat(el.getAttribute('step')) || 1
      const value = Number.isInteger(el.value / step) ? parseFloat(el.value) : Math.floor(el.value / step) * step;
      el.value = value // for 000 like input cleanup to 0
      const max = parseFloat(el.max)
      const min = parseFloat(el.min)
      if (value > max) el.value = el.max
      if (value < min || isNaN(value)) el.value = el.min
    }
  }
})()