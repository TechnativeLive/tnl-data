import { clamp } from '@mantine/hooks'
import styles from './bar-reveal.module.css'
import clsx from 'clsx'

export function BarReveal({
  show,
  bars,
  skew = -12,
  text,
  color,
  background = 'bg-gradient-to-r from-orange-4 to-orange-6',
  maximumDelay = 100,
}: {
  show: boolean
  bars: number
  skew?: number
  text: string
  color?: string
  background?: string
  maximumDelay?: number
}) {
  const clampedSkew = clamp(skew, -45, 45)

  return (
    <div
      className={clsx(
        styles.container,
        'pointer-events-none opacity-0 absolute inset-0 z-50 skew-x-[calc(var(--skew)*1deg)]',
      )}
      style={{
        '--skew': clampedSkew,
      }}
    >
      <div
        className={clsx(
          styles[show ? 'bar-reveal-in' : 'bar-reveal-out'],
          'absolute h-full w-[110%] right-[105%] flex flex-col items-center',
        )}
      >
        {Array.from({ length: bars }).map((_, i) => {
          const animationDelay = `${Math.random() * maximumDelay}ms`
          return (
            <div
              key={i}
              className={clsx(background, 'h-[23%] -mt-px w-full')}
              style={{ animationDelay }}
            />
          )
        })}
        <div className={clsx(color, 'absolute inset-0 grid place-content-center tracking-wider')}>
          {text}
        </div>
      </div>
    </div>
  )
}
