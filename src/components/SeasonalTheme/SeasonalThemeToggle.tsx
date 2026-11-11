import { SparklesIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { SeasonalTheme } from './types'

export interface SeasonalThemeToggleProps {
  theme: SeasonalTheme
  enabled: boolean
  setEnabled: (enabled: boolean) => void
  className?: string
}

const SeasonalThemeToggle: React.FC<SeasonalThemeToggleProps> = ({
  theme, enabled, setEnabled, className
}: SeasonalThemeToggleProps): JSX.Element => {
  const { t } = useTranslation()
  const name = t(theme.nameKey)
  return (
    <Button
      className={className}
      variant='tertiary'
      data-color='neutral'
      size='xsmall'
      icon={<SparklesIcon aria-hidden />}
      aria-pressed={enabled}
      onClick={() => setEnabled(!enabled)}
    >
      {enabled ? t('app:seasonal-theme-hide', { name }) : t('app:seasonal-theme-show', { name })}
    </Button>
  )
}

export default SeasonalThemeToggle
