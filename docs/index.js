
import "./_snowpack/pkg/piano-keys-webcomponent-v0.js";

import './scripts/piano.js'
import './scripts/background.js'
import './scripts/transpose.js'
import './scripts/stopwatch.js'

import { Game } from './scripts/game.js'
//attach a click listener to a play button
const game = new Game()
