import Search from 'assets/icons/Search'
import { Knapp } from 'nav-frontend-knapper'
import { HorizontalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

const ArbeidsgiverSøk = ({
  gettingArbeidsperioder = false,
  getArbeidsperioder = () => {}
}): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Knapp
      disabled={gettingArbeidsperioder}
      spinner={gettingArbeidsperioder}
      onClick={getArbeidsperioder}
    >
      <Search />
      <HorizontalSeparatorDiv data-size='0.5' />
      {gettingArbeidsperioder
        ? t('message:loading-searching')
        : t('el:button-search-for-x', { x: t('label:arbeidsgiver').toLowerCase() })}
    </Knapp>
  )
}

export default ArbeidsgiverSøk
