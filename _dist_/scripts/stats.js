import Transposer from './transpose.js'

const worker = new Worker('./_dist_/scripts/worker.js')

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
        Stats.get(q).then( data => {
            if(!data) data = {...questionAttrs}
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
        })
    },
    normalize(q){
        const nums = Transposer.notesAsNumber(q)
        return nums.sort(ascending).join(',')
    },
    total(q){
        return Stats.get(this.normalize(q))
        .then( data => {
            if(!data) return 0
            return data.r + data.w + data.l
        })
    },
    ratio(q){
        return Stats.get(this.normalize(q))
        .then( data => {
           return (data.r / (data.r + data.w + data.l))
        })
    },
    strength(q){
        //no answers is 0 strength
        return Stats.get(this.normalize(q))
        .then( data => {
            const total = this.total(q)
            if( !data || total == 0 ) return 0
            const denominator = ( total > 10 ? total : 10);
            return (data.r / denominator)
        })
    }
}

export const Stats = {
    init(){
        document.addEventListener('gameify:update', this.register.bind(this))
    },
    get(key){
        return new Promise( (resolve, reject) => {
            worker.postMessage({ action: 'getStat', key: key })
            worker.onmessage = (e) => {
                if(e.data.action != 'getStat') return
                resolve(e.data.result)
            }
        })
    },
    set(key, value){
        return new Promise( (resolve, reject) => {
            worker.postMessage({ action: 'saveStat', key: key, value: value })
            worker.onmessage = (e) => {
                if(e.data.action != 'saveStat') return
                resolve(e.data.result)
            }
        })
    },
    register(e){
        //listens for question answers
        //validate question is an array
        if(!Array.isArray(e.detail.q)) return
        Question.hit(e.detail.q, e.detail.status)
    }
}

Stats.init()
