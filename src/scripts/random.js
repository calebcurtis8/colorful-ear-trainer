import { Question }  from './stats'

export default function random( count = 1, set = ["C","D","E","F","G","A","B"]){
    
    function run(ignore_set = []){
        let selected_notes = []
        while(selected_notes.length < count){
            var r = Math.floor(Math.random() * set.length);
            if(selected_notes.indexOf(set[r]) === -1) selected_notes.push(set[r]);
            //if selected array matches ignore set, do this again
            if(areArraysEqualSets(selected_notes, ignore_set)) selected_notes = []
        }
        return selected_notes
    }
    let selected = run()

    let strength = Question.strength(selected)

    if(strength > 0){
        let chance = Math.floor(1 / strength)
        let rerun = Math.floor(Math.random() * chance)
        if(rerun === 1){
            //get new notes, the weaker the strength the less likely we are to find a new note
            selected = run(selected)
        }
    }
    
    return selected
}

/** assumes array elements are primitive types
* check whether 2 arrays are equal sets.
* @param  {} a1 is an array
* @param  {} a2 is an array
*/
function areArraysEqualSets(a1, a2) {
    const superSet = {};
    for (const i of a1) {
      const e = i + typeof i;
      superSet[e] = 1;
    }
  
    for (const i of a2) {
      const e = i + typeof i;
      if (!superSet[e]) {
        return false;
      }
      superSet[e] = 2;
    }
  
    for (let e in superSet) {
      if (superSet[e] === 1) {
        return false;
      }
    }
  
    return true;
  }