import type { DEFAULT_AUDIO_PARAMS } from '../constants'
import WaveSelector from './WaveSelector'
import styles from './SoundSettings.module.css'
import { Slider } from './Slider'
import Field from './Field'
import EnvelopeGraph from './EnvelopeGraph'

export default function SoundSettings({
  currentSettings,
  onChange,
}: {
  currentSettings: typeof DEFAULT_AUDIO_PARAMS
  onChange: (updatedSettings: Partial<typeof DEFAULT_AUDIO_PARAMS>) => void
}) {
  return (
    <div className={styles.soundSettingsContainer}>
      <div>
        <Field id="type" label="Type">
          <WaveSelector
            value={currentSettings.type}
            onChange={(value) => onChange({ type: value })}
          />
        </Field>

        <Field id="volume" label="Volume">
          <Slider
            id="volume"
            value={currentSettings.volume}
            min={0}
            max={0.2}
            step={0.01}
            onChange={(value) => onChange({ volume: parseFloat(value) })}
          />
        </Field>
        <Field id="attack" label="Attack">
          <Slider
            id={'Attack'}
            value={currentSettings.attackTime}
            min={0}
            max={0.5}
            step={0.01}
            onChange={(value) => onChange({ attackTime: parseFloat(value) })}
          />
        </Field>
        <Field id="Decay" label="Decay">
          <Slider
            id={'Decay'}
            value={currentSettings.decayTime}
            min={0}
            max={0.5}
            step={0.01}
            onChange={(value) => onChange({ decayTime: parseFloat(value) })}
          />
        </Field>
        <Field id="Sustain" label="Sustain">
          <Slider
            id={'Sustain'}
            value={currentSettings.sustainLevel}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => onChange({ sustainLevel: parseFloat(value) })}
          />
        </Field>
        <Field id="Release" label="Release">
          <Slider
            id={'Release'}
            value={currentSettings.releaseTime}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => onChange({ releaseTime: parseFloat(value) })}
          />
        </Field>
      </div>
      <EnvelopeGraph
        attack={currentSettings.attackTime}
        decay={currentSettings.decayTime}
        sustain={currentSettings.sustainLevel}
        release={currentSettings.releaseTime}
      />
    </div>
  )
}
