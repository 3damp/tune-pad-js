import type { DEFAULT_AUDIO_PARAMS } from '../../constants'
import { Slider } from '../Slider/Slider'
import Field from '../Field/Field'
import styles from './SettingsPanel.module.css'

export default function SettingsPanel({
  currentSettings,
  onChange,
}: {
  currentSettings: typeof DEFAULT_AUDIO_PARAMS
  onChange: (updatedSettings: Partial<typeof DEFAULT_AUDIO_PARAMS>) => void
}) {
  return (
    <div className={styles.settingsContainer}>
      <Field id="bpm" label="BPM">
        <Slider
          id="bpm"
          value={currentSettings.bpm}
          min={30}
          max={240}
          step={10}
          onChange={(value) => onChange({ bpm: parseInt(value, 10) })}
        />
      </Field>
    </div>
  )
}
