import { BodyLong, Tag } from '@navikt/ds-react'
import CountryData from '@navikt/land-verktoy'
import { TransparentPanel } from 'components/StyledComponents'
import { Adresse } from 'declarations/sed'
import React from 'react'
import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { useTranslation } from 'react-i18next'

interface AdresseBoxProps {
  adresse: Adresse | null | undefined
  border?: boolean
  padding?: string | number
  oneLine?: boolean
  seeType?: boolean
}

const AdresseBox = ({ adresse, border = true, padding = 1, oneLine = false, seeType = false }: AdresseBoxProps) => {
  const countryData = CountryData.getCountryInstance('nb')
  const { t } = useTranslation()
  if (!adresse) {
    return null
  }
  return (
    <TransparentPanel
      border={border} style={{
        padding: padding + 'rem',
        display: oneLine ? 'inline-flex' : 'flex',
        flexDirection: oneLine ? 'row' : 'column',
        alignItems: 'flex-start'
      }}
    >
      {seeType && !!adresse.type && (
        <>
          <Tag size='small' variant='info'>{t('label:' + adresse.type)}</Tag>
          <HorizontalSeparatorDiv size='0.5' />
        </>
      )}
      <BodyLong>
        {adresse?.gate ?? '-'}
        {adresse?.bygning ? ', ' + t('label:bygning').toLowerCase() + ' ' + adresse?.bygning : ''}
      </BodyLong>
      {oneLine && ', \u00A0'}
      <BodyLong>
        {(adresse?.postnummer ?? '') + ' ' + adresse?.by}
      </BodyLong>
      {oneLine && ', \u00A0'}
      <BodyLong>
        {adresse?.region ? adresse?.region + ', ' : ''}
        {countryData.findByValue(adresse?.land)?.label ?? adresse?.land}
      </BodyLong>
    </TransparentPanel>
  )
}

export default AdresseBox
