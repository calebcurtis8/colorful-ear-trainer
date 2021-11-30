import { Question }  from './stats'

export default function random( count = 1, set = ["C","D","E","F","G","A","B"], weighted = true){
    
    function run(ignore_set = []){
        const selected_notes = []
        while(selected_notes.length < count){
            var r = Math.floor(Math.random() * set.length);
            if(selected_notes.indexOf(set[r]) === -1) selected_notes.push(set[r]);
            //if selected array matches ignore set, do this again
            if(areArraysEqualSets(selected_notes, ignore_set)) selected_notes.length = 0
        }
        return selected_notes
    }
    let selected = run()

    const strength = Question.strength(selected)

    if(strength > 0 && weighted){
        const chance = Math.floor(1 / strength)
        const rerun = Math.floor(Math.random() * chance)
        //ie if strengh = .2, then there is a 1 in 5 chance of rerunning
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
  
    for (const e in superSet) {
      if (superSet[e] === 1) {
        return false;
      }
    }
  
    return true;
  }