import {
  sineWaveIcon,
  squareWaveIcon,
  sawtoothWaveIcon,
  triangleWaveIcon,
} from '../images'
import { Slider } from './Slider'
import styles from './WaveSelector.module.css'

export default function WaveSelector({
  value,
  onChange,
}: {
  value?: number
  onChange?: (value: number) => void
}) {
  return (
    <>
      <div className={styles.container}>
        <img src={sineWaveIcon} />
        <img src={squareWaveIcon} />
        <img src={triangleWaveIcon} />
        <img src={sawtoothWaveIcon} />
      </div>
      <Slider
        label={'Wave Type'}
        value={value ?? 0}
        min={0}
        max={3}
        step={1}
        onChange={(v) => onChange?.(parseInt(v))}
      />
    </>
  )
}
