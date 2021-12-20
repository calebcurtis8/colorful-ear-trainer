import * as Tone from 'tone'
import { unmute } from './unmute'

export const PianoSamples = {
    create(){
        if(this.synth) return this.synth
        const baseUrl = `_dist_/samples/`
        this.synth = new Tone.Sampler({
            urls: {
                C2: `${ baseUrl }C2.mp3`,
                G2: `${ baseUrl }G2.mp3`,
                C3: `${ baseUrl }C3.mp3`,
                G3: `${ baseUrl }G3.mp3`,
                C4: `${ baseUrl }C4.mp3`,
                G4: `${ baseUrl }G4.mp3`,
                Bb4: `${ baseUrl }Bb4.mp3`,
                G5: `${ baseUrl }G5.mp3`
            }
        }).toDestination();
        this.synth.release = 1

        //iOS hacky script
        unmute(this.synth.context._context)
        return this.synth
    },
    stop(){
        this.synth.volume.value = -Infinity
    }
}