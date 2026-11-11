import React, { CSSProperties, JSX } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './Christmas.module.css'

// Deterministic pseudo-random numbers, so the decorations look the same on every render
const random = (seed: number): (() => number) => {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rnd = random(1224)

const SNOWFLAKES: Array<CSSProperties> = Array.from({ length: 42 }, () => {
  const size = 3 + rnd() * 5
  return {
    '--x': `${(rnd() * 100).toFixed(2)}%`,
    '--size': `${size.toFixed(1)}px`,
    '--opacity': (0.45 + rnd() * 0.5).toFixed(2),
    // bigger flakes are "closer" and fall a bit faster
    '--fall-duration': `${(16 - size + rnd() * 8).toFixed(1)}s`,
    '--sway-duration': `${(3 + rnd() * 3).toFixed(1)}s`,
    '--drift': `${(8 + rnd() * 18).toFixed(0)}px`,
    // negative delay, so the snow is already falling when the page loads
    '--delay': `-${(rnd() * 20).toFixed(1)}s`
  } as CSSProperties
})

const SWAGS = 7
const SAG = 48 // control point offset of each swag, gives 24px sag in the middle
const BULB_POSITIONS = [0.2, 0.5, 0.8]

const WIRE_PATH = 'M0,4 ' + Array.from({ length: SWAGS }, (_, i) => `Q${i * 100 + 50},${4 + SAG} ${(i + 1) * 100},4`).join(' ')

const BULBS: Array<CSSProperties> = Array.from({ length: SWAGS }).flatMap((_, swag) =>
  BULB_POSITIONS.map((t) => {
    return {
      left: `${(((swag + t) / SWAGS) * 100).toFixed(3)}%`,
      // y on a quadratic bezier with endpoints at y=4 and control point at y=4+SAG
      top: `${(4 + 2 * t * (1 - t) * SAG).toFixed(1)}px`,
      '--twinkle-duration': `${(2.4 + rnd() * 2).toFixed(1)}s`,
      '--delay': `-${(rnd() * 4).toFixed(1)}s`
    } as CSSProperties
  })
)

const SPARKLES: Array<CSSProperties & Record<`--${string}`, string>> = [
  { left: '84%', top: '18%', '--size': '14px', '--delay': '0s' },
  { left: '6%', top: '36%', '--size': '10px', '--delay': '-1.6s' },
  { left: '92%', top: '66%', '--size': '9px', '--delay': '-3.1s' }
]

const STAR_PATH = 'M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z'

const Sparkle = ({ style }: { style: CSSProperties }): JSX.Element => (
  <svg className={styles.sparkle} style={style} viewBox='0 0 24 24' aria-hidden focusable='false'>
    <path d={STAR_PATH} />
  </svg>
)

// A few small, slow flakes – the header is visible on every page, so it should stay calm
const HEADER_SNOWFLAKES: Array<CSSProperties> = Array.from({ length: 16 }, () => ({
  '--x': `${(rnd() * 100).toFixed(2)}%`,
  '--size': `${(2 + rnd() * 2.5).toFixed(1)}px`,
  '--opacity': (0.5 + rnd() * 0.4).toFixed(2),
  '--fall-duration': `${(7 + rnd() * 6).toFixed(1)}s`,
  '--sway-duration': `${(2.5 + rnd() * 2.5).toFixed(1)}s`,
  '--drift': `${(4 + rnd() * 8).toFixed(0)}px`,
  '--delay': `-${(rnd() * 13).toFixed(1)}s`
} as CSSProperties))

// Santa's sleigh silhouette flying right to left: two reindeer in front (the leader with a red nose) on a 112x30 grid.
// A reindeer is drawn leaping to the right and mirrored.
const Reindeer = ({ x, lead = false }: { x: number, lead?: boolean }): JSX.Element => (
  <g transform={`translate(${x + 30} 2) scale(-1 1)`}>
    {/* far legs, slightly lighter for depth */}
    <path className={styles.reindeerFarLegs} d='M20.6 15.4C22.4 17.2 23.8 18.6 25.2 19.4M8.4 16C7 17.8 5.6 19.3 4.2 20.2' />
    <path d='M2 12.2C3.5 11 5 11 6.5 11.6C10 10.6 15 10.8 18.5 10.4C20 9 21.5 7.6 22.6 6.4C23.2 5.6 24 5.2 24.8 5.4L25.4 4.4L25.7 5.6C26.7 6 27.8 6.6 28.8 7.2C29.4 7.6 29.2 8.4 28.6 8.5C27.6 8.6 26.4 8.4 25.6 8.6C24.6 9.2 23.6 11 22.2 12.8C22 13.6 21.6 14.2 21 14.6L24.5 16.4C25.5 16.9 26.6 16.8 27.4 16.4L27.6 17C26.4 17.8 25 17.9 23.8 17.4L20.2 15.8C17 16.4 12 16.6 8.8 15.8L5.2 18.6C4.4 19.2 3.4 19.4 2.4 19.2L2.4 18.6C3.2 18.6 3.9 18.3 4.5 17.8L7.2 15.2C5.8 14.8 4.6 14 3.8 13.2C3 13.4 2.3 13.2 2 12.2Z' />
    <path className={styles.reindeerAntlers} d='M24.4 5.6C23.6 3.8 22.6 2.6 21 2M23.2 3.4C23 2.4 23.2 1.4 23.8 0.6M22 2.3C21.6 1.4 21.6 0.8 21.9 0.2M25.2 5.2C25.4 3.6 26 2.4 27.2 1.6M25.8 3.2C26.6 3 27.4 3.2 28 3.8M26.6 2.1C26.6 1.3 26.9 0.7 27.4 0.3' />
    <path className={styles.reindeerCollar} d='M20.4 9.4C21.4 10.4 22.6 10.9 23.8 10.9' />
    <circle className={styles.reindeerBell} cx='23.1' cy='11.9' r='0.8' />
    {lead && <circle className={styles.reindeerNose} cx='28.9' cy='8.1' r='1.2' />}
  </g>
)

const ChristmasSleigh = (): JSX.Element => (
  <svg className={styles.sleighSvg} viewBox='0 0 112 30' focusable='false'>
    <path className={styles.sleighHarness} d='M14 15.5H36M45 15.5L72 17' />
    <Reindeer x={0} lead />
    <Reindeer x={31} />
    {/* sack, Santa and sleigh */}
    <circle cx='79' cy='12' r='4.6' />
    <circle cx='92' cy='7.6' r='2.8' />
    <path d='M87 16Q88 9.5 92.5 10.2Q97 10.5 97.5 16Z' />
    <path className={styles.santaWhite} d='M89.6 8.2C89.4 10 90.4 11.4 91.8 11.6C91.2 10.6 90.8 9.4 90.8 8.4Z' />
    <path className={styles.santaHat} d='M89.4 6.2C89.8 3.8 91.4 1.8 93.6 1.6C95.4 1.5 96.6 2.8 97.2 4.6L96.4 5.6C95.9 4.6 95.3 4.1 94.6 4.1C95.1 4.8 95.4 5.5 95.5 6.2Z' />
    <path className={styles.santaBrim} d='M89 6.4C91.1 5.6 93.4 5.5 95.8 6.1' />
    <circle className={styles.santaWhite} cx='97.3' cy='5.2' r='1.1' />
    <path d='M73.5 23L71.5 14.5Q71.3 11.5 75 12.4L80.5 15.2H97.5L101.5 9Q103.5 7 105.5 9L103.5 23Z' />
    <path className={styles.sleighLine} d='M106 26.5H74Q68 26.5 68 21.5M78 23V26.5M98 23V26.5' />
  </svg>
)

export const ChristmasHeaderDecorations: React.FC = (): JSX.Element => (
  <div className={styles.header} aria-hidden>
    <div className={styles.snow}>
      {HEADER_SNOWFLAKES.map((style, i) => <span key={i} className={styles.flake} style={style} />)}
    </div>
    <div className={styles.sleighTrack}>
      <div className={styles.sleigh}>
        <span className={styles.stardust} />
        <ChristmasSleigh />
      </div>
    </div>
  </div>
)

export const ChristmasHeaderTitleDecoration: React.FC = (): JSX.Element => (
  <span className={styles.titleStarAnchor} aria-hidden>
    <svg className={styles.titleStar} viewBox='0 0 24 24' focusable='false'>
      <path d={STAR_PATH} />
    </svg>
  </span>
)

export const ChristmasHeroDecorations: React.FC = (): JSX.Element => (
  <div className={styles.hero} aria-hidden>
    <div className={styles.snow}>
      {SNOWFLAKES.map((style, i) => <span key={i} className={styles.flake} style={style} />)}
    </div>
    <div className={styles.garland}>
      <svg className={styles.wire} viewBox={`0 0 ${SWAGS * 100} 40`} preserveAspectRatio='none' focusable='false'>
        <path d={WIRE_PATH} vectorEffect='non-scaling-stroke' />
      </svg>
      {BULBS.map((style, i) => <span key={i} className={styles.bulb} style={style} />)}
    </div>
    <svg className={styles.drift} viewBox='0 0 1200 40' preserveAspectRatio='none' focusable='false'>
      <path className={styles.driftBack} d='M0,18 C120,6 260,26 420,14 C580,2 720,24 880,12 C1010,4 1120,18 1200,10 L1200,40 L0,40 Z' />
      <path className={styles.driftFront} d='M0,26 C160,12 300,34 480,22 C640,12 780,32 960,20 C1080,12 1150,24 1200,20 L1200,40 L0,40 Z' />
      <path className={styles.driftEdge} vectorEffect='non-scaling-stroke' d='M0,26 C160,12 300,34 480,22 C640,12 780,32 960,20 C1080,12 1150,24 1200,20' />
    </svg>
  </div>
)

export const ChristmasLogoDecoration: React.FC = (): JSX.Element => (
  <div className={styles.logoDecoration} aria-hidden>
    <span className={styles.glow} />
    {SPARKLES.map((style, i) => <Sparkle key={i} style={style} />)}
  </div>
)

export const ChristmasGreeting: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  return (
    <p className={styles.greeting}>
      {t('app:seasonal-theme-christmas-greeting')}
    </p>
  )
}
