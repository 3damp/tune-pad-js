type EnvelopeGraphProps = {
  attack: number
  decay: number
  sustain: number
  release: number
}

export default function EnvelopeGraph({
  attack,
  decay,
  sustain,
  release,
}: EnvelopeGraphProps) {
  const width = 200
  const height = 60

  const totalTime = 2

  // Calculate x positions
  const x0 = 0
  const x1 = (attack / totalTime) * width
  const x2 = ((attack + decay) / totalTime) * width
  const x3 = ((attack + decay + release) / totalTime) * width

  // Calculate y positions
  const y0 = height
  const y1 = 0
  const y2 = height - sustain * height
  const y3 = height

  return (
    <div>
      <svg
        width={width}
        height={height}
        style={{ background: '#555', borderRadius: 4 }}
      >
        <polyline
          fill="none"
          stroke="#bfff00"
          strokeWidth={2}
          points={`${x0},${y0} ${x1},${y1} ${x2},${y2} ${x3},${y3}`}
        />
      </svg>
    </div>
  )
}
