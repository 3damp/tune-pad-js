import { useState, useEffect, useRef } from 'react'
import styles from './App.module.css'

const calculateFrequency = (semitonesFrom440: number): number => {
    const A440 = 440
    return Math.round(A440 * Math.pow(2, semitonesFrom440 / 12))
}

const FREQUENCIES: number[] = []
for (let i = -24; i <= 24; i++) {
    FREQUENCIES.push(calculateFrequency(i))
}

const NUM_BEATS = 16
const NUM_NOTES = 16
const BPM = 120 // Beats per minute

function App() {
    const [audioCtx] = useState(() => new AudioContext())
    const [enabled, setEnabled] = useState<boolean[][]>(
        Array(NUM_BEATS)
            .fill(0)
            .map(() => Array(NUM_NOTES).fill(false))
    )
    const enabledRef = useRef(enabled)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Keep enabledRef in sync with enabled
    useEffect(() => {
        enabledRef.current = enabled
    }, [enabled])

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
        let index = 0
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = setInterval(
            () => {
                const currentEnabled = enabledRef.current[index]
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
    }, []) // Only run once

    const toggleButton = (beatIdx: number, noteIdx: number) => {
        setEnabled((prev) => {
            const newEnabled = prev.map((row) => [...row])
            newEnabled[beatIdx][noteIdx] = !newEnabled[beatIdx][noteIdx]
            return newEnabled
        })
    }

    return (
        <div className={styles.container}>
            {Array(NUM_NOTES)
                .fill(0)
                .map((_, noteIdx) => {
                    const reversedNoteIdx = NUM_NOTES - noteIdx - 1
                    return (
                        <div
                            className={styles.buttonRow}
                            key={reversedNoteIdx}
                        >
                            {Array(NUM_BEATS)
                                .fill(0)
                                .map((_, beatIdx) => (
                                    <button
                                        key={`${beatIdx}-${reversedNoteIdx}`}
                                        className={`${styles.button} ${enabled[beatIdx][reversedNoteIdx] ? styles.active : ''}`}
                                        onClick={() =>
                                            toggleButton(
                                                beatIdx,
                                                reversedNoteIdx
                                            )
                                        }
                                    ></button>
                                ))}
                        </div>
                    )
                })}
        </div>
    )
}

export default App
