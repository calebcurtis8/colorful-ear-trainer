export default function random( count = 1, set = ["C","D","E","F","G","A","B"]){
    let selected_notes = []
    while(selected_notes.length < count){
        var r = Math.floor(Math.random() * set.length);
        if(selected_notes.indexOf(set[r]) === -1) selected_notes.push(set[r]);
    }
    return selected_notes
}