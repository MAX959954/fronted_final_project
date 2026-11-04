import { ref, onBeforeUnmount } from 'vue'

// Every voice is synthesised in the browser, so there are no audio files to load.
let ctx = null
let master = null

function audio() {
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext
    ctx = new Ctx()
    const comp = ctx.createDynamicsCompressor()
    master = ctx.createGain()
    master.gain.value = 0.55
    master.connect(comp).connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Karplus–Strong plucked string: a burst of noise fed through a short averaging delay line.
function pluck(freq, duration, damping) {
  const ac = audio()
  const length = Math.floor(ac.sampleRate * duration)
  const buffer = ac.createBuffer(1, length, ac.sampleRate)
  const out = buffer.getChannelData(0)
  const period = Math.max(2, Math.round(ac.sampleRate / freq))
  for (let i = 0; i < length; i++) {
    out[i] =
      i < period
        ? Math.random() * 2 - 1
        : damping * 0.5 * (out[i - period] + out[i - period - 1 >= 0 ? i - period - 1 : 0])
  }
  return buffer
}

function noiseBuffer(duration) {
  const ac = audio()
  const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * duration), ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

function play(buffer, at, chain) {
  const ac = audio()
  const src = ac.createBufferSource()
  src.buffer = buffer
  src.connect(chain)
  src.start(at)
}

function envelope(at, peak, decay) {
  const ac = audio()
  const g = ac.createGain()
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(peak, at + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0001, at + decay)
  return g
}

const E_MAJOR = [82.41, 123.47, 164.81, 207.65, 246.94, 329.63]
const A_MAJOR = [110.0, 164.81, 220.0, 277.18, 329.63]
const POWER_E = [82.41, 123.47, 164.81, 246.94]
const POWER_G = [98.0, 146.83, 196.0, 293.66]

function strum(notes, at, gap, duration, damping, chain) {
  notes.forEach((f, i) => play(pluck(f, duration, damping), at + i * gap, chain))
}

function acoustic() {
  const ac = audio()
  const body = ac.createBiquadFilter()
  body.type = 'lowpass'
  body.frequency.value = 5200
  const g = ac.createGain()
  g.gain.value = 0.5
  body.connect(g).connect(master)
  const t = ac.currentTime + 0.03
  strum(E_MAJOR, t, 0.028, 2.4, 0.996, body)
  strum(A_MAJOR, t + 1.1, 0.024, 2.2, 0.996, body)
  return 3.4
}

function electric() {
  const ac = audio()
  const drive = ac.createWaveShaper()
  const curve = new Float32Array(1024)
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1
    curve[i] = Math.tanh(x * 9)
  }
  drive.curve = curve
  const cab = ac.createBiquadFilter()
  cab.type = 'lowpass'
  cab.frequency.value = 2900
  const g = ac.createGain()
  g.gain.value = 0.16
  drive.connect(cab).connect(g).connect(master)
  const t = ac.currentTime + 0.03
  strum(POWER_E, t, 0.012, 0.9, 0.998, drive)
  strum(POWER_E, t + 0.42, 0.012, 0.5, 0.998, drive)
  strum(POWER_G, t + 0.84, 0.012, 1.6, 0.998, drive)
  return 2.6
}

function kick(at) {
  const ac = audio()
  const osc = ac.createOscillator()
  osc.frequency.setValueAtTime(140, at)
  osc.frequency.exponentialRampToValueAtTime(45, at + 0.16)
  osc.connect(envelope(at, 1, 0.42)).connect(master)
  osc.start(at)
  osc.stop(at + 0.45)
}

function snareHit(at, level = 0.6) {
  const ac = audio()
  const band = ac.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 2400
  band.Q.value = 0.7
  band.connect(envelope(at, level, 0.22)).connect(master)
  play(noiseBuffer(0.25), at, band)
  const tone = ac.createOscillator()
  tone.frequency.value = 190
  tone.connect(envelope(at, level * 0.5, 0.09)).connect(master)
  tone.start(at)
  tone.stop(at + 0.1)
}

function hat(at, open = false) {
  const ac = audio()
  const hp = ac.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 7500
  hp.connect(envelope(at, 0.28, open ? 0.45 : 0.05)).connect(master)
  play(noiseBuffer(0.5), at, hp)
}

function kit() {
  const ac = audio()
  const t = ac.currentTime + 0.03
  const step = 60 / 112 / 2
  for (let i = 0; i < 16; i++) {
    const at = t + i * step
    hat(at, i === 7 || i === 15)
    if (i % 8 === 0 || i === 3 || i === 10) kick(at)
    if (i % 8 === 4) snareHit(at)
  }
  return 16 * step + 0.4
}

function snare() {
  const ac = audio()
  const t = ac.currentTime + 0.03
  for (let i = 0; i < 12; i++) snareHit(t + i * 0.07, 0.15 + i * 0.04)
  snareHit(t + 0.95, 0.9)
  return 1.4
}

function cymbal() {
  const ac = audio()
  const t = ac.currentTime + 0.03
  const hp = ac.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 5000
  hp.connect(envelope(t, 0.35, 2.6)).connect(master)
  play(noiseBuffer(2.8), t, hp)
  // Inharmonic square partials give the metallic shimmer.
  const metal = ac.createBiquadFilter()
  metal.type = 'bandpass'
  metal.frequency.value = 9000
  metal.connect(envelope(t, 0.12, 1.8)).connect(master)
  for (const ratio of [2, 3, 4.16, 5.43, 6.79, 8.21]) {
    const osc = ac.createOscillator()
    osc.type = 'square'
    osc.frequency.value = 40 * ratio * 4
    osc.connect(metal)
    osc.start(t)
    osc.stop(t + 2)
  }
  return 2.6
}

const voices = { acoustic, electric, kit, snare, cymbal }

export function useSoundcheck() {
  const playing = ref(false)
  let timer = null

  function trigger(kind) {
    const voice = voices[kind]
    if (!voice || playing.value) return
    try {
      const seconds = voice()
      playing.value = true
      timer = setTimeout(() => (playing.value = false), seconds * 1000)
    } catch {
      playing.value = false
    }
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return {
    playing,
    trigger,
    supported: typeof window !== 'undefined' && !!(window.AudioContext || window.webkitAudioContext),
  }
}
