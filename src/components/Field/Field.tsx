import type { PropsWithChildren } from 'react'
import styles from './Field.module.css'

export default function Field({
  id,
  label,
  children,
}: PropsWithChildren<{ id: string; label: string }>) {
  return (
    <label htmlFor={id} className={styles.field}>
      <span>{label}</span>
      {children}
    </label>
  )
}
