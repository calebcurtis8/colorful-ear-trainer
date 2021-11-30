import { Transposer } from './transpose'

const SESSION = 'EarTrainerStats'

function ascending(a, b) {
    return a - b;
}
/* ===
r - right answer
w - wrong answer
l - late answer (scored as a wrong answer)
==== */
const questionAttrs = {
    r: 0,
    w: 0,
    l: 0
}

export const Question = {
    hit(q, status){
        //get existing reference or use our new question
        q = this.normalize(q)
        const data = Stats.get(q) || {...questionAttrs}
        //register stat...
        switch (status) {
            case -1:
                //late
                data.l++
                break;
            case 0:
                //wrong
                data.w++
                break;
            case 1:
                //right
                data.r++
                break;
            default:
                break;
        }
        //save
        Stats.set(q, data)
    },
    normalize(q){
        const nums = Transposer.notesAsNumber(q)
        return nums.sort(ascending).join(',')
    },
    total(q){
        const data = Stats.get(this.normalize(q))
        return data.r + data.w + data.l
    },
    ratio(q){
        const data = Stats.get(this.normalize(q))
        return data.r / (data.r + data.w + data.l)
    },
    strength(q){
        //no answers is 0 strength
        if(!Stats.get(this.normalize(q)) || this.total(q) == 0) return 0
        return ((this.total(q) * this.ratio(q)) / 10)
    }
}

export const Stats = {
    init(){
        document.addEventListener('gameify:update', this.register.bind(this))
    },
    get(key){
        const data = JSON.parse(sessionStorage.getItem(SESSION)) || {}
        const value = key ? data[key] : data;
        return value
    },
    set(key, value){
        const s = this.get()
        s[key] = value
        return sessionStorage.setItem(SESSION, JSON.stringify(s))
    },
    register(e){
        //listens for question answers
        //validate question is an array
        if(!Array.isArray(e.detail.q)) return
        Question.hit(e.detail.q, e.detail.status)
    }
}

Stats.init()
