import { NUM_NOTES, NUM_BEATS } from '../constants'
import styles from './Pad.module.css'

export default function Pad({
  currentBeat,
  enabledButtons,
  toggleButton,
}: {
  currentBeat: number
  enabledButtons: boolean[][]
  toggleButton: (beatIdx: number, noteIdx: number) => void
}) {
  const classNames = (beatIdx: number, noteIdx: number) => {
    const isActive = enabledButtons[beatIdx][noteIdx]
    const isCurrentBeat = currentBeat === beatIdx
    return `${styles.button} ${isActive ? styles.active : ''} ${isCurrentBeat ? styles.current : ''}`
  }

  return (
    <div className={styles.padContainer}>
      {Array(NUM_NOTES)
        .fill(0)
        .map((_, noteIdx) => {
          const reversedNoteIdx = NUM_NOTES - noteIdx - 1
          return (
            <div className={styles.buttonRow} key={reversedNoteIdx}>
              {Array(NUM_BEATS)
                .fill(0)
                .map((_, beatIdx) => (
                  <button
                    key={`${beatIdx}-${reversedNoteIdx}`}
                    className={classNames(beatIdx, reversedNoteIdx)}
                    onClick={() => toggleButton(beatIdx, reversedNoteIdx)}
                  ></button>
                ))}
            </div>
          )
        })}
    </div>
  )
}
