import { useState, useEffect, useRef } from 'react'
import styles from './App.module.css'
import { BPM, DEFAULT_ENABLED_BUTTONS, NUM_BEATS, NUM_NOTES } from './constants'
import Pad from './components/Pad'
import { pauseIcon, playIcon } from './images'
import IconButton from './components/IconButton'

const calculateFrequency = (semitonesFrom440: number): number => {
  const A440 = 440
  return Math.round(A440 * Math.pow(2, semitonesFrom440 / 12))
}

const FREQUENCIES: number[] = []
for (let i = -24; i <= 24; i++) {
  FREQUENCIES.push(calculateFrequency(i))
}

function App() {
  const [audioCtx] = useState(() => new AudioContext())
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(-1)
  const [enabledButtons, setEnabledButtons] = useState<boolean[][]>(
    DEFAULT_ENABLED_BUTTONS
  )
  const enabledButtonsRef = useRef(enabledButtons)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    enabledButtonsRef.current = enabledButtons
  }, [enabledButtons])

  const playSound = (index: number = 0) => {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.value = FREQUENCIES[index + 24]
    osc.connect(gain)
    gain.connect(audioCtx.destination)

    const now = audioCtx.currentTime
    gain.gain.setValueAtTime(0.2, now)
    // gain.gain.linearRampToValueAtTime(0.2, now + 0)
    // gain.gain.linearRampToValueAtTime(0, now + 0.05)
    gain.gain.setValueAtTime(0, now + 0.1)

    osc.start(now)
    osc.stop(now + 1)
    osc.onended = () => {
      osc.disconnect()
      gain.disconnect()
    }
  }

  // Beat loop
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setCurrentBeat(-1)
      return
    }
    let index = 0
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(
      () => {
        setCurrentBeat(index)
        const currentEnabled = enabledButtonsRef.current[index]
        for (let noteIndex = 0; noteIndex < NUM_NOTES; noteIndex++) {
          if (currentEnabled[noteIndex]) {
            playSound(noteIndex)
          }
        }
        index++
        if (index >= NUM_BEATS) index = 0
      },
      ((60 / BPM) * 1000) / 4
    )
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
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

  return (
    <div className={styles.container}>
      <div className={styles.buttonsContainer}>
        <IconButton
          icon={isPlaying ? pauseIcon : playIcon}
          ariaLabel="Play"
          onClick={() => setIsPlaying((prev) => !prev)}
        />
      </div>
      <Pad
        enabledButtons={enabledButtons}
        toggleButton={toggleButton}
        currentBeat={currentBeat}
      />
    </div>
  )
}

export default App
