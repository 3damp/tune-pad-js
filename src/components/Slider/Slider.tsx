import styles from './Slider.module.css'

export function Slider({
  id,
  value,
  min,
  max,
  step,
  onChange,
}: {
  id: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: string) => void
}) {
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.slider}
    />
  )
}
