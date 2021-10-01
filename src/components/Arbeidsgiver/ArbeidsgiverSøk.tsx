import Search from 'assets/icons/Search'
import _ from 'lodash'
import { Normaltekst } from 'nav-frontend-typografi'
import { FlexEndDiv, HighContrastKnapp, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface ArbeidsgiverSøkProps {
  fnr: string | undefined
  gettingArbeidsperioder: boolean
  getArbeidsperioder: () => void
  fillOutFnr ?: () => void
}

const ArbeidsgiverSøk: React.FC<ArbeidsgiverSøkProps> = ({
  fnr,
  gettingArbeidsperioder = false,
  getArbeidsperioder = () => {},
  fillOutFnr
}: ArbeidsgiverSøkProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <FlexEndDiv>
    <HighContrastKnapp
      disabled={gettingArbeidsperioder || _.isNil(fnr)}
      spinner={gettingArbeidsperioder}
      onClick={getArbeidsperioder}
    >
      <Search />
      <HorizontalSeparatorDiv size='0.5' />
      {gettingArbeidsperioder
        ? t('message:loading-searching')
        : t('el:button-search-for-x', { x: t('label:arbeidsgiver').toLowerCase() })}
    </HighContrastKnapp>

    {_.isNil(fnr) && _.isFunction(fillOutFnr) && (
      <>
        <HorizontalSeparatorDiv size='0.35'/>
      <Normaltekst>
        {t('message:error-no-fnr')}
      </Normaltekst>
      <HorizontalSeparatorDiv size='0.35'/>
      <Link to='#' onClick={() => {
        if (_.isFunction(fillOutFnr())) {
          fillOutFnr()
        }
      }}>
        {t('label:fill-fnr')}
      </Link>
      </>
    )}
  </FlexEndDiv>
  )
}

export default ArbeidsgiverSøk
