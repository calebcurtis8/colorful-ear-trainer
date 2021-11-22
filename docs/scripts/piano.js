import * as Tone from "../_snowpack/pkg/tone.js";
import User from "./user.js";
const piano = document.getElementById("piano");
class PianoPlayer {
  constructor(pno) {
    this.piano = pno;
    this.notesDown = [];
    this.handlePlay = this.play.bind(this);
    this.handleListen = this.listen.bind(this);
    this.piano.addEventListener("note-down", this.handlePlay);
    this.piano.addEventListener("note-down", this.handleListen);
    document.addEventListener("question:start", this.clear.bind(this));
  }
  play(e) {
    let key = e.detail;
    const synth = new Tone.Synth().toDestination();
    let note = this.formatNote(key.note);
    synth.triggerAttackRelease(note, "8n");
  }
  listen(e) {
    let key = e.detail;
    let notes = User.selected_notes || [];
    let note = this.formatNote(key.note);
    if (notes.indexOf(note) > -1) {
      this.piano.removeEventListener("note-down", this.handlePlay);
      this.piano.setNoteDown(key.note, 0);
      this.notesDown.push([key.note, 0]);
      this.piano.addEventListener("note-down", this.handlePlay);
    }
    document.dispatchEvent(new CustomEvent("answer", {detail: note}));
  }
  clear() {
    this.notesDown.forEach((note) => {
      this.piano.setNoteUp(note[0], note[1]);
    });
  }
  formatNote(note) {
    return `${note}${User.get("octave", "number")}`;
  }
}
new PianoPlayer(piano);
