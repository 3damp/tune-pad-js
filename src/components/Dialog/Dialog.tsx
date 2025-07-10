import { useRef, useEffect } from 'react'

export function Dialog({
  message,
  onAccept,
  onCancel,
}: {
  message: string
  onAccept: () => void
  onCancel: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    ref.current?.showModal()
  })
  return (
    <dialog ref={ref}>
      <p>{message}</p>
      <div>
        <button onClick={() => onAccept()}>Yes</button>
        <button onClick={() => onCancel()}>No</button>
      </div>
    </dialog>
  )
}
