import { useState, useEffect, useRef } from 'react'
import styles from './App.module.css'
import { DEFAULT_ENABLED_BUTTONS, NUM_BEATS, NUM_NOTES } from './constants'
import Pad from './components/Pad'
import { pauseIcon, playIcon } from './images'
import IconButton from './components/IconButton'
import { Slider } from './components/Slider'
import { getLocalStorage, setLocalStorage } from './services/localStorage'

const calculateFrequency = (semitonesFrom440: number): number => {
  const A440 = 440
  return Math.round(A440 * Math.pow(2, semitonesFrom440 / 12))
}

const FREQUENCIES: number[] = []
for (let i = -24; i <= 24; i++) {
  FREQUENCIES.push(calculateFrequency(i))
}
const NOTES = [15, 17, 19, 20, 22, 24, 26, 27, 29, 31, 32, 34, 36, 38, 39, 41]

const DEFAULT_AUDIO_PARAMS = {
  bpm: 100,
  type: 'sine' as OscillatorType,
  attackTime: 0.05,
  releaseTime: 0.1,
  decayTime: 0.05,
  sustainLevel: 0.5,
  volume: 0.1,
}

function App() {
  const [audioCtx] = useState(() => new AudioContext())
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(-1)

  const [audioParams, setAudioParams] = useState(
    getLocalStorage('audioParams', DEFAULT_AUDIO_PARAMS)
  )
  const audioParamsRef = useRef(audioParams)
  const [enabledButtons, setEnabledButtons] = useState<boolean[][]>(
    getLocalStorage('enabledButtons', DEFAULT_ENABLED_BUTTONS)
  )
  const enabledButtonsRef = useRef(enabledButtons)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    enabledButtonsRef.current = enabledButtons
    setLocalStorage('enabledButtons', enabledButtons)
  }, [enabledButtons])
  useEffect(() => {
    audioParamsRef.current = audioParams
    setLocalStorage('audioParams', audioParams)
  }, [audioParams])

  const playSound = (index: number = 0) => {
    const {
      volume = DEFAULT_AUDIO_PARAMS.volume,
      attackTime = DEFAULT_AUDIO_PARAMS.attackTime,
      decayTime = DEFAULT_AUDIO_PARAMS.decayTime,
      sustainLevel = DEFAULT_AUDIO_PARAMS.sustainLevel,
      releaseTime = DEFAULT_AUDIO_PARAMS.releaseTime,
      type = DEFAULT_AUDIO_PARAMS.type,
    } = audioParamsRef.current

    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = type
    osc.frequency.value = FREQUENCIES[NOTES[index]]
    osc.connect(gain)
    gain.connect(audioCtx.destination)

    const now = audioCtx.currentTime
    const attackEnd = now + attackTime
    const decayEnd = attackEnd + decayTime
    const sustainVolume = sustainLevel * volume

    gain.gain.setValueAtTime(0, now) // Start at 0
    gain.gain.linearRampToValueAtTime(volume, attackEnd) // Attack: 0 -> volume
    gain.gain.linearRampToValueAtTime(sustainVolume, decayEnd) // Decay: volume -> sustainVolume
    // gain.gain.setValueAtTime(sustainVolume, decayEnd) // Hold at sustain
    gain.gain.linearRampToValueAtTime(0, decayEnd + releaseTime) // Release: sustainVolume -> 0

    osc.start(now)
    osc.stop(decayEnd + releaseTime)
    osc.onended = () => {
      osc.disconnect()
      gain.disconnect()
    }
  }

  // Beat loop with setTimeout for smooth BPM changes
  useEffect(() => {
    if (!isPlaying) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setCurrentBeat(-1)
      return
    }
    let beat = 0
    const playNextBeat = () => {
      const { bpm } = audioParamsRef.current

      setCurrentBeat(beat)
      const currentEnabled = enabledButtonsRef.current[beat]
      for (let noteIndex = 0; noteIndex < NUM_NOTES; noteIndex++) {
        if (currentEnabled[noteIndex]) {
          playSound(noteIndex)
        }
      }
      beat = (beat + 1) % NUM_BEATS
      timeoutRef.current = setTimeout(playNextBeat, ((60 / bpm) * 1000) / 4)
    }
    playNextBeat()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying])

  const toggleButton = (beatIdx: number, noteIdx: number) => {
    setEnabledButtons((prev) => {
      const newEnabled = prev.map((row) => [...row])
      newEnabled[beatIdx][noteIdx] = !newEnabled[beatIdx][noteIdx]
      return newEnabled
    })
  }

  const updateAudioParams = (
    newParams: Partial<typeof DEFAULT_AUDIO_PARAMS>
  ) => {
    setAudioParams((prev) => ({
      ...prev,
      ...newParams,
    }))
  }

  return (
    <div className={styles.container}>
      <div className={styles.buttonsContainer}>
        <Slider
          label={'BPM'}
          value={audioParams.bpm}
          min={30}
          max={240}
          step={10}
          onChange={(value) => updateAudioParams({ bpm: parseInt(value, 10) })}
        />
        <Slider
          label={'Volume'}
          value={audioParams.volume}
          min={0}
          max={0.2}
          step={0.01}
          onChange={(value) => updateAudioParams({ volume: parseFloat(value) })}
        />
        <Slider
          label={'Attack'}
          value={audioParams.attackTime}
          min={0.01}
          max={0.5}
          step={0.01}
          onChange={(value) =>
            updateAudioParams({ attackTime: parseFloat(value) })
          }
        />
        <Slider
          label={'Decay'}
          value={audioParams.decayTime}
          min={0.01}
          max={0.5}
          step={0.01}
          onChange={(value) =>
            updateAudioParams({ decayTime: parseFloat(value) })
          }
        />
        <Slider
          label={'Sustain'}
          value={audioParams.sustainLevel}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) =>
            updateAudioParams({ sustainLevel: parseFloat(value) })
          }
        />
        <Slider
          label={'Release'}
          value={audioParams.releaseTime}
          min={0.01}
          max={0.5}
          step={0.01}
          onChange={(value) =>
            updateAudioParams({ releaseTime: parseFloat(value) })
          }
        />
        <br />
        <br />
        <IconButton
          icon={isPlaying ? pauseIcon : playIcon}
          ariaLabel="Play"
          onClick={() => setIsPlaying((prev) => !prev)}
        />
      </div>
      <div className={styles.padContainer}>
        <Pad
          enabledButtons={enabledButtons}
          toggleButton={toggleButton}
          currentBeat={currentBeat}
        />
      </div>
    </div>
  )
}

export default App
