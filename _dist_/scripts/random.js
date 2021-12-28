import { Question } from './stats.js'

export default function random (count = 1, set = ['C', 'D', 'E', 'F', 'G', 'A', 'B'], weighted = true) {
  function run (ignore_set = []) {
    const selectedNotes = []
    while (selectedNotes.length < count) {
      const r = Math.floor(Math.random() * set.length)
      if (selectedNotes.indexOf(set[r]) === -1) selectedNotes.push(set[r])
      // if selected array matches ignore set, do this again
      if (areArraysEqualSets(selectedNotes, ignore_set)) selectedNotes.length = 0
    }
    return selectedNotes
  }
  let selected = run()

  return Question.strength(selected)
    .then(strength => {
      if (strength > 0 && weighted) {
        const chance = 1 / strength
        const rerun = Math.floor(Math.random() * chance)
        // ie if strength = .2, then there is a 1 in 5 chance of rerunning
        if (rerun === 1) {
          // get new notes, the weaker the strength the less likely we are to find a new note
          selected = run(selected)
        }
      }
      return selected
    })
}

/** assumes array elements are primitive types
* check whether 2 arrays are equal sets.
* @param  {} a1 is an array
* @param  {} a2 is an array
*/
function areArraysEqualSets (a1, a2) {
  const superSet = {}
  for (const i of a1) {
    const e = i + typeof i
    superSet[e] = 1
  }

  for (const i of a2) {
    const e = i + typeof i
    if (!superSet[e]) {
      return false
    }
    superSet[e] = 2
  }

  for (const e in superSet) {
    if (superSet[e] === 1) {
      return false
    }
  }

  return true
}
