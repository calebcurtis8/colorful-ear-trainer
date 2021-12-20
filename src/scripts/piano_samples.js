import * as Tone from 'tone'

export function PianoSamples() {
    const baseUrl = `_dist_/samples/`
    const synth = new Tone.Sampler({
        urls: {
            C2: `${ baseUrl }C2.mp3`,
            G2: `${ baseUrl }G2.mp3`,
            C3: `${ baseUrl }C3.mp3`,
            G3: `${ baseUrl }G3.mp3`,
            C4: `${ baseUrl }C4.mp3`,
            G4: `${ baseUrl }G4.mp3`,
            G5: `${ baseUrl }G5.mp3`,
            C5: `${ baseUrl }C5.mp3`,
        }
    }).toDestination();
    synth.release = 1
    return synth
}