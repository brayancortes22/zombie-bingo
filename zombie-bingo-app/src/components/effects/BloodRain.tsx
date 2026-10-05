import React, { useMemo } from 'react'

export const BloodRain: React.FC = () => {
  const drops = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${(i * 3.6 + Math.random() * 3).toFixed(1)}%`,
      duration: `${(1.2 + Math.random() * 1.8).toFixed(2)}s`,
      delay: `${(Math.random() * 2).toFixed(2)}s`,
      height: `${Math.floor(40 + Math.random() * 50)}px`,
      width: `${Math.floor(1 + Math.random() * 2)}px`,
    }))
  }, [])

  return (
    <div className="rain-container">
      {drops.map((d) => (
        <div
          key={d.id}
          className="raindrop"
          style={{
            left: d.left,
            height: d.height,
            width: d.width,
            animationDuration: d.duration,
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  )
}
