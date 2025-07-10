import { useRef } from 'react'
import { NUM_NOTES, NUM_BEATS } from '../../constants'
import styles from './Pad.module.css'

export default function Pad({
  currentBeat,
  enabledButtons,
  setEnabled,
}: {
  currentBeat: number
  enabledButtons: boolean[][]
  setEnabled: (beatIdx: number, noteIdx: number, enabled: boolean) => void
}) {
  const enabling = useRef(false)
  const isMouseDown = useRef(false)
  const lastBeatMovedOnto = useRef<number | undefined>(undefined)
  const lastNoteMovedOnto = useRef<number | undefined>(undefined)

  const classNames = (beatIdx: number, noteIdx: number) => {
    const isActive = enabledButtons[beatIdx][noteIdx]
    const isCurrentBeat = currentBeat === beatIdx
    return `${styles.button} ${isActive ? styles.active : ''} ${isCurrentBeat ? styles.current : ''}`
  }

  // MOUSE
  const mouseDownHandler = (beatIndex: number, noteIndex: number) => {
    const currentValue = enabledButtons[beatIndex][noteIndex]
    enabling.current = !currentValue
    isMouseDown.current = true
    setEnabled(beatIndex, noteIndex, enabling.current)
  }
  const mouseUpHandler = () => {
    isMouseDown.current = false
  }
  const mouseEnterHandler = (beatIndex: number, noteIndex: number) => {
    if (!isMouseDown.current) return
    setEnabled(beatIndex, noteIndex, enabling.current)
  }

  // TOUCH
  const touchStartHandler = (beatIndex: number, noteIndex: number) => {
    const currentValue = enabledButtons[beatIndex][noteIndex]
    enabling.current = !currentValue
    lastBeatMovedOnto.current = beatIndex
    lastNoteMovedOnto.current = noteIndex
    setEnabled(beatIndex, noteIndex, enabling.current)
  }
  const touchMoveHandler = (e: React.TouchEvent<HTMLButtonElement>) => {
    const elem = document.elementFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    )
    if (!elem) return

    const beatAttr = elem.getAttribute('data-beat')
    const noteAttr = elem.getAttribute('data-note')
    if (beatAttr === null || noteAttr === null) return

    const beatIndex = parseInt(beatAttr)
    const noteIndex = parseInt(noteAttr)
    if (
      lastBeatMovedOnto.current === beatIndex &&
      lastNoteMovedOnto.current === noteIndex
    ) {
      return
    }

    setEnabled(beatIndex, noteIndex, enabling.current)
    lastBeatMovedOnto.current = beatIndex
    lastNoteMovedOnto.current = noteIndex
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
                .map((_, beatIdx) => {
                  return (
                    <button
                      key={`${beatIdx}-${reversedNoteIdx}`}
                      data-beat={beatIdx}
                      data-note={noteIdx}
                      className={classNames(beatIdx, noteIdx)}
                      onTouchStart={() => touchStartHandler(beatIdx, noteIdx)}
                      onTouchMove={(e) => touchMoveHandler(e)}
                      onMouseDown={() => mouseDownHandler(beatIdx, noteIdx)}
                      onMouseEnter={() => mouseEnterHandler(beatIdx, noteIdx)}
                      onMouseUp={() => mouseUpHandler()}
                    ></button>
                  )
                })}
            </div>
          )
        })}
    </div>
  )
}
