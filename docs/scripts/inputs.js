const numbers = document.querySelectorAll('input[type="number"]');
(() => {
    numbers.forEach( num => {
        num.addEventListener('input', validate)
        num.addEventListener('blur', validate)
    })
    function validate(e){
            const el = e.target || e
            if(el.type == "number" && el.max && el.min ){
              let value = parseInt(el.value)
              el.value = value // for 000 like input cleanup to 0
              let max = parseInt(el.max)
              let min = parseInt(el.min)
              if ( value > max ) el.value = el.max
              if ( value < min || isNaN(value)) el.value = el.min
            }
          }
})()