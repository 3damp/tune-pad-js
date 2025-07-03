export const NUM_BEATS = 16
export const NUM_NOTES = 16
export const BPM = 120 // Beats per minute

export const DEFAULT_ENABLED_BUTTONS: boolean[][] = Array.from(
  { length: NUM_BEATS },
  () => Array.from({ length: NUM_NOTES }, () => false)
)
for (let i = 0; i < NUM_BEATS; i += 4) {
  DEFAULT_ENABLED_BUTTONS[i][4] = true // Enable first note on every 4th beat
}
