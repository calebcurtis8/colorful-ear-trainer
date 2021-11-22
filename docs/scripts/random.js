export default function random( count = 1, set = ["C","D","E","F","G","A","B"]){
    let selected_notes = []
    for (let index = 0; index < count; index++) {
        let random = Math.floor(Math.random() * set.length)
        selected_notes.push(set[random])
        //remove from our set so our next random note is not the same
        set.splice(random, 1)
    }
    return selected_notes
}