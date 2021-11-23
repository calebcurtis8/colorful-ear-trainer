import User from './user'

export default function random( count = 1, set = ["C","D","E","F","G","A","B"]){
    let selected_notes = []
    
    //collect previous notes
    var all_previous_notes = User.previous_notes
    all_previous_notes = all_previous_notes.map( note => note[0])

    //half the time ignore previous notes - when less than 3 notes
    let ignore_previous = Math.floor(Math.random() * 2)
    let compare_set = []
    if(ignore_previous === 1 && count < 3) compare_set = all_previous_notes;
    
    while(selected_notes.length < count){
        var r = Math.floor(Math.random() * set.length);
        if(selected_notes.indexOf(set[r]) === -1 && compare_set.indexOf(set[r] === -1)) selected_notes.push(set[r]);
    }
    
    return selected_notes
}