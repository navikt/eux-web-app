import React from 'react'
import { useTranslation } from 'react-i18next'
import CountryData from 'land-verktoy'
import { Panel, BodyLong } from '@navikt/ds-react'

const AdresseBox = ({ adresse, border = true }: any) => {
  const countryData = CountryData.getCountryInstance('nb')
  const { t } = useTranslation()
  return (
    <Panel border={border}>
      <BodyLong>
        {adresse?.gate ?? '-'}
        {adresse?.bygning ? ', ' + t('label:bygning').toLowerCase() + ' ' + adresse?.bygning : ''}
      </BodyLong>
      <BodyLong>
        {adresse?.postnummer + ' ' + adresse?.by}
      </BodyLong>
      <BodyLong>
        {adresse?.region ? adresse?.region + ', ' : ''}
        {countryData.findByValue(adresse?.land)?.label ?? adresse?.land}
      </BodyLong>
    </Panel>
  )
}

export default AdresseBox
