import * as Tone from "../_snowpack/pkg/tone.js";
import PianoKeys from "../_snowpack/pkg/@jesperdj/pianokeys.js";
import User from "./user.js";
const piano = document.getElementById("piano");
const notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const keyboard = new PianoKeys.Keyboard(piano, {
  lowest: `C${User.get("octave", "number")}`,
  highest: `B${User.get("octave", "number")}`
});
class PianoPlayer {
  constructor(pno) {
    this.piano = pno;
    this.notesDown = [];
    this.handlePlay = this.play.bind(this);
    this.handleListen = this.listen.bind(this);
    this.piano.addEventListener("click", this.handlePlay);
    this.piano.addEventListener("click", this.handleListen);
    document.addEventListener("question:start", this.clear.bind(this));
    keyboard._keys.forEach((key, i) => {
      let noteIndex = i - User.get("octave", "number") * 12;
      key.setAttribute("data-note", notes[noteIndex]);
    });
  }
  play(e) {
    let key = e.target.getAttribute("data-note");
    const synth = new Tone.Synth().toDestination();
    let note = this.formatNote(key);
    synth.triggerAttackRelease(note, "8n");
  }
  listen(e) {
    let key = e.target.getAttribute("data-note");
    let notes2 = User.selected_notes || [];
    let note = this.formatNote(key);
    let matching = notes2.filter((note2) => note2[0] == key);
    if (matching.length > 0) {
      this.piano.removeEventListener("click", this.handlePlay);
      keyboard.fillKey(note);
      this.notesDown.push(note);
      this.piano.addEventListener("click", this.handlePlay);
    } else if (notes2.length > 0) {
      keyboard.fillKey(note, "red");
      this.notesDown.push(note);
    } else {
      keyboard.fillKey(note, "yellow");
      setTimeout(function() {
        keyboard.clearKey(note);
      }, 300);
    }
    document.dispatchEvent(new CustomEvent("answer", {detail: note}));
  }
  clear() {
    this.notesDown.forEach((note) => {
      keyboard.clearKey(note);
    });
  }
  formatNote(note) {
    return `${note}${User.get("octave", "number")}`;
  }
}
new PianoPlayer(piano);
