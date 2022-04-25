import React from 'react'
import { useTranslation } from 'react-i18next'
import CountryData from '@navikt/land-verktoy'
import { Panel, BodyLong } from '@navikt/ds-react'

const AdresseBox = ({ adresse, border = true, padding = 1, oneLine = false }: any) => {
  const countryData = CountryData.getCountryInstance('nb')
  const { t } = useTranslation()
  return (
    <Panel border={border} style={{ padding: padding + 'rem', display: oneLine ? 'inline-flex' : 'flex' }}>
      <BodyLong>
        {adresse?.gate ?? '-'}
        {adresse?.bygning ? ', ' + t('label:bygning').toLowerCase() + ' ' + adresse?.bygning : ''}
      </BodyLong>
      {oneLine && ', \u00A0'}
      <BodyLong>
        {adresse?.postnummer + ' ' + adresse?.by}
      </BodyLong>
      {oneLine && ', \u00A0'}
      <BodyLong>
        {adresse?.region ? adresse?.region + ', ' : ''}
        {countryData.findByValue(adresse?.land)?.label ?? adresse?.land}
      </BodyLong>
    </Panel>
  )
}

export default AdresseBox
