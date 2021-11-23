import * as Tone from "../_snowpack/pkg/tone.js";
import User from "./user.js";
const piano = document.getElementById("piano");
const POSSIBLE_KEY_VALUES = ["C", ["C#", "Db"], "D", ["D#", "Eb"], "E", "F", ["F#", "Gb"], "G", ["G#", "Ab"], "A", ["A#", "Bb"], "B"];
piano.fillKey = function(note, color) {
  let key = this.getNote(note);
  if (key)
    key.style.fill = color;
};
piano.getNote = function(note) {
  return this.querySelector(`[data-note="${note}"]`);
};
piano.clearKey = function(note) {
  let key = this.getNote(note);
  if (key)
    key.style.fill = null;
};
class PianoPlayer {
  constructor(pno) {
    this.piano = pno;
    this.notesDown = [];
    this.handlePlayClick = this.playClick.bind(this);
    this.handleListenClick = this.listenClick.bind(this);
    this.handleListenKeys = this.listenKeys.bind(this);
    this.handleListenShifts = this.listenShifts.bind(this);
    this.playback = true;
    this.piano.addEventListener("click", this.handlePlayClick);
    this.piano.addEventListener("click", this.handleListenClick);
    document.addEventListener("keyup", this.handleListenKeys);
    document.addEventListener("keydown", this.handleListenShifts);
    document.addEventListener("keyup", this.handleListenShifts);
    document.addEventListener("question:start", this.clear.bind(this));
    this.synth = new Tone.Synth().toDestination();
  }
  async play(key) {
    if (!this.playback)
      return;
    await Tone.start();
    let note = this.formatNote(key);
    this.synth.triggerAttackRelease(note, "8n");
  }
  playClick(e) {
    let key = e.target.getAttribute("data-note").split(",")[0];
    this.play(key);
  }
  listenClick(e) {
    this.listen(e.target.getAttribute("data-note"));
  }
  listenShifts(e) {
    if (!(e.code == "ShiftLeft" || e.code == "ShiftRight"))
      return;
    if (e.type == "keyup") {
      if (e.code == "ShiftLeft")
        this.shiftLeftActive = false;
      if (e.code == "ShiftRight")
        this.shiftRightActive = false;
    }
    if (e.type == "keydown") {
      if (e.code == "ShiftLeft")
        this.shiftLeftActive = true;
      if (e.code == "ShiftRight")
        this.shiftRightActive = true;
    }
  }
  listenKeys(e) {
    let key = e.key.toUpperCase();
    if (POSSIBLE_KEY_VALUES.indexOf(key) == -1)
      return;
    let sharp = this.shiftRightActive;
    let flat = this.shiftLeftActive;
    if (sharp && flat)
      return;
    let note = `${key}${sharp ? "#" : ""}${flat ? "b" : ""}`;
    let matches = POSSIBLE_KEY_VALUES.filter((k) => {
      if (Array.isArray(k)) {
        return k.indexOf(note) > -1;
      }
      return k === note;
    });
    let match = matches.map((k) => {
      if (Array.isArray(k))
        return k.join(",");
      return k;
    });
    match = match.join("");
    this.listen(match);
    this.play(match.split(",")[0]);
  }
  listen(fullKey) {
    let key = fullKey.split(",");
    let matchKey = false;
    let notes = User.selected_notes || [];
    notes.filter((n) => {
      if (key.indexOf(n[0]) > -1) {
        matchKey = n[0];
        return true;
      }
      return false;
    });
    let note = fullKey;
    if (matchKey) {
      this.piano.removeEventListener("click", this.handlePlay);
      piano.fillKey(note, "rgba(80, 240, 80, 1)");
      this.notesDown.push(note);
      this.piano.addEventListener("click", this.handlePlay);
    } else if (notes.length > 0) {
      piano.fillKey(note, "rgba(185, 28, 28, 1)");
      this.notesDown.push(note);
    } else {
      piano.fillKey(note, "#fbbf24");
      setTimeout(function() {
        piano.clearKey(note);
      }, 300);
    }
    let reportNote = matchKey ? this.formatNote(matchKey) : this.formatNote(key[0]);
    document.dispatchEvent(new CustomEvent("answer", {detail: reportNote}));
  }
  clear() {
    this.notesDown.forEach((note) => {
      piano.clearKey(note);
    });
  }
  formatNote(note) {
    return `${note}${User.get("cadenceoctave", "number")}`;
  }
}
new PianoPlayer(piano);
