export const NUM_BEATS = 16
export const NUM_NOTES = 16

export const WAVE_TYPE = {
  sine: 0,
  square: 1,
  sawtooth: 2,
  triangle: 3,
}

export const DEFAULT_AUDIO_PARAMS = {
  bpm: 100,
  type: WAVE_TYPE.sine,
  attackTime: 0,
  releaseTime: 0.2,
  decayTime: 0.15,
  sustainLevel: 1,
  volume: 0.1,
}

export const calculateFrequency = (semitonesFrom440: number): number => {
  const A440 = 440
  return Math.round(A440 * Math.pow(2, semitonesFrom440 / 12))
}

export const FREQUENCIES: number[] = []
for (let i = -24; i <= 24; i++) {
  FREQUENCIES.push(calculateFrequency(i))
}
export const NOTES = [
  15, 17, 19, 20, 22, 24, 26, 27, 29, 31, 32, 34, 36, 38, 39, 41,
]

export const getTypeFromValue = (value: number): OscillatorType => {
  switch (value) {
    case WAVE_TYPE.sine:
      return 'sine'
    case WAVE_TYPE.square:
      return 'square'
    case WAVE_TYPE.sawtooth:
      return 'sawtooth'
    case WAVE_TYPE.triangle:
      return 'triangle'
    default:
      return 'sine'
  }
}

export const DEFAULT_ENABLED_BUTTONS = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]
