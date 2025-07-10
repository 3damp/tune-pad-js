import { useState, useEffect, useRef } from 'react'
import styles from './App.module.css'
import {
  DEFAULT_AUDIO_PARAMS,
  DEFAULT_ENABLED_BUTTONS,
  FREQUENCIES,
  getTypeFromValue,
  NOTES,
  NUM_BEATS,
  NUM_NOTES,
} from './constants'
import Pad from './components/Pad/Pad'
import { gearIcon, pauseIcon, playIcon, seqIcon, soundIcon } from './images'
import IconButton from './components/IconButton/IconButton'
import { getLocalStorage, setLocalStorage } from './services/localStorage'
import SoundSettings from './components/SoundSettings/SoundSettings'
import SettingsPanel from './components/Settings/SettingsPanel'

type Tab = 'sequencer' | 'sound' | 'drum 1' | 'settings'

function App() {
  const [audioCtx] = useState(() => new AudioContext())
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(-1)
  const [tab, setTab] = useState<Tab>('sequencer')

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
    osc.type = getTypeFromValue(type)
    osc.frequency.value = FREQUENCIES[NOTES[index]]
    osc.connect(gain)
    gain.connect(audioCtx.destination)

    const minTime = 0.001 // Small buffer to avoid issues with very short attack times

    const now = audioCtx.currentTime
    const attackEnd = now + attackTime + minTime
    const decayEnd = attackEnd + decayTime + minTime
    const sustainVolume = sustainLevel * volume

    gain.gain.setValueAtTime(0, now) // Start at 0
    gain.gain.linearRampToValueAtTime(volume, attackEnd) // Attack: 0 -> volume
    gain.gain.linearRampToValueAtTime(sustainVolume, decayEnd) // Decay: volume -> sustainVolume
    gain.gain.linearRampToValueAtTime(0, decayEnd + releaseTime + minTime) // Release: sustainVolume -> 0

    osc.start(now)
    osc.stop(decayEnd + releaseTime + minTime)
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

  const renderTab = (tab: Tab) => {
    switch (tab) {
      case 'sound':
        return (
          <SoundSettings
            currentSettings={audioParams}
            onChange={updateAudioParams}
          />
        )
      case 'settings':
        return (
          <SettingsPanel
            currentSettings={audioParams}
            onChange={updateAudioParams}
          />
        )
      case 'sequencer':
        return (
          <Pad
            enabledButtons={enabledButtons}
            toggleButton={toggleButton}
            currentBeat={currentBeat}
          />
        )
      default:
        break
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <IconButton
          icon={isPlaying ? pauseIcon : playIcon}
          ariaLabel="Play"
          onClick={() => setIsPlaying((prev) => !prev)}
        />
      </div>
      <div className={styles.mainContent}>{renderTab(tab)}</div>
      <div className={styles.footer}>
        <button
          type="button"
          className={tab === 'sequencer' ? styles.active : ''}
          onClick={() => setTab('sequencer')}
        >
          <img src={seqIcon} alt="seq icon" />
        </button>
        <button
          type="button"
          className={tab === 'sound' ? styles.active : ''}
          onClick={() => setTab('sound')}
        >
          <img src={soundIcon} alt="sound icon" />
        </button>
        <button
          type="button"
          className={tab === 'settings' ? styles.active : ''}
          onClick={() => setTab('settings')}
        >
          <img src={gearIcon} alt="gear icon" />
        </button>
      </div>
    </div>
  )
}

export default App
