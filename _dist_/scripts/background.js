import { removeClassStartsWith } from './remove-class-starts-with.js'

const Colors = ['green','pink','blue','purple','yellow']
const Stop = ['from','via','to']

class FancyBackground extends HTMLElement {
    constructor() {
        super()
        document.addEventListener('gameify:punish', this.reset.bind(this))
        this.reset()
    }
    reset() {
        removeClassStartsWith(this, 'duration-')
        this.style.opacity = 0
        setTimeout( () => {
            //re-add duration class
            this.classList.add('duration-1000')
        }, 1000)

        removeClassStartsWith(this, 'from-')
        removeClassStartsWith(this, 'via-')
        removeClassStartsWith(this, 'to-')

        let selected_colors = []

        while(selected_colors.length < 3){
            var rand = Math.floor(Math.random() * Colors.length)
            var color = Colors[rand]
            if(selected_colors.indexOf(color) === -1) selected_colors.push(color)
        }
        selected_colors = selected_colors.map( (color, i) => `${ Stop[i]}-${color}-500`)
        this.classList.add(...selected_colors)
    }
}

customElements.define('fancy-background', FancyBackground)
/*
["from-green-500", "from-pink-500", "from-blue-500", "from-purple-500", "from-yellow-500", "via-green-500", "via-pink-500", "via-blue-500", "via-purple-500", "via-yellow-500", "to-green-500", "to-pink-500", "to-blue-500", "to-purple-500", "to-yellow-500" ]
*/