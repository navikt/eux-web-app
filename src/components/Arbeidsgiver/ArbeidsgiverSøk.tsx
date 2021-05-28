import Search from 'assets/icons/Search'
import { HighContrastKnapp, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

const ArbeidsgiverSøk = ({
  gettingArbeidsperioder = false,
  getArbeidsperioder = () => {}
}): JSX.Element => {
  const { t } = useTranslation()
  return (
    <HighContrastKnapp
      disabled={gettingArbeidsperioder}
      spinner={gettingArbeidsperioder}
      onClick={getArbeidsperioder}
    >
      <Search />
      <HorizontalSeparatorDiv size='0.5' />
      {gettingArbeidsperioder
        ? t('message:loading-searching')
        : t('el:button-search-for-x', { x: t('label:arbeidsgiver').toLowerCase() })}
    </HighContrastKnapp>
  )
}

export default ArbeidsgiverSøk
