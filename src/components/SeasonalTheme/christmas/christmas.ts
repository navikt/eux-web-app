import { SeasonalTheme } from '../types'
import styles from './Christmas.module.css'
import { ChristmasGreeting, ChristmasHeaderDecorations, ChristmasHeaderTitleDecoration, ChristmasHeroDecorations, ChristmasLogoDecoration } from './ChristmasDecorations'

const christmas: SeasonalTheme = {
  id: 'christmas',
  nameKey: 'app:seasonal-theme-christmas-name',
  // 1st of December until "trettendedag jul"
  season: {
    from: { month: 12, day: 1 },
    to: { month: 1, day: 6 }
  },
  className: styles.theme,
  HeaderDecorations: ChristmasHeaderDecorations,
  HeaderTitleDecoration: ChristmasHeaderTitleDecoration,
  HeroDecorations: ChristmasHeroDecorations,
  LogoDecoration: ChristmasLogoDecoration,
  Greeting: ChristmasGreeting
}

export default christmas
