import * as Tone from 'tone'
import { PianoSamples } from './piano_samples'

import Tempo from './tempo'

const Speed = () => Tempo()

const synth = PianoSamples.create()

document.addEventListener('game:stop', () => {
  PianoSamples.stop()
})

export async function playSequence (seq, offset, volume = 0) {
  await Tone.start()
  synth.toDestination()
  synth.volume.value = volume
  const now = offset ? offset + Tone.now() : Tone.now()

  let time = 0
  seq.forEach(chord => {
    const duration = chord.duration * Speed()
    chord.sequence.forEach(note => {
      synth.triggerAttackRelease(note, duration, now + time)
    })
    time += duration
  })
}
