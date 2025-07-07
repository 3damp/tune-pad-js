import { WAVE_TYPE } from '../constants'
import {
  sineWaveIcon,
  squareWaveIcon,
  sawtoothWaveIcon,
  triangleWaveIcon,
} from '../images'
import styles from './WaveSelector.module.css'

export default function WaveSelector({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className={styles.container}>
      <button
        className={value === WAVE_TYPE.sine ? styles.active : ''}
        onClick={() => {
          onChange(WAVE_TYPE.sine)
        }}
      >
        <img src={sineWaveIcon} alt="sine" />
      </button>
      <button
        className={value === WAVE_TYPE.square ? styles.active : ''}
        onClick={() => {
          onChange(WAVE_TYPE.square)
        }}
      >
        <img src={squareWaveIcon} alt="square" />
      </button>
      <button
        className={value === WAVE_TYPE.triangle ? styles.active : ''}
        onClick={() => {
          onChange(WAVE_TYPE.triangle)
        }}
      >
        <img src={triangleWaveIcon} alt="triangle" />
      </button>
      <button
        className={value === WAVE_TYPE.sawtooth ? styles.active : ''}
        onClick={() => {
          onChange(WAVE_TYPE.sawtooth)
        }}
      >
        <img src={sawtoothWaveIcon} alt="sawtooth" />
      </button>
    </div>
  )
}
