const numbers = document.querySelectorAll('input[type="number"]');
(() => {
    numbers.forEach( num => {
        num.addEventListener('change', validate)
        num.addEventListener('blur', validate)
    })
    function validate(e){
            const el = e.target || e
            if(el.type == "number" && el.max && el.min ){
              let step = parseFloat(el.getAttribute('step')) || 1
              let value = Number.isInteger(el.value / step) ? parseFloat(el.value) : Math.floor(el.value / step) * step;
              el.value = value // for 000 like input cleanup to 0
              let max = parseFloat(el.max)
              let min = parseFloat(el.min)
              if ( value > max ) el.value = el.max
              if ( value < min || isNaN(value)) el.value = el.min
            }
          }
})()