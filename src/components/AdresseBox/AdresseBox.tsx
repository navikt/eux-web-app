import { Normaltekst } from 'nav-frontend-typografi'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CountryData from 'land-verktoy'

const AdresseBox = ({adresse}: any) => {

  const countryData = CountryData.getCountryInstance('nb')
  const { t } = useTranslation()
  return (
    <>
      <Normaltekst>
        {adresse?.gate ?? '-'}
        {adresse?.bygning ? ', ' + t('label:bygning').toLowerCase() + ' ' + adresse?.bygning : ''}
      </Normaltekst>
      <Normaltekst>
        {adresse?.postnummer + ' ' + adresse?.by}
      </Normaltekst>
      <Normaltekst>
        {adresse?.region ? adresse?.region + ', ' : ''}
        {countryData.findByValue(adresse?.land)?.label ?? adresse?.land}
      </Normaltekst>
    </>
  )
}

export default AdresseBox
