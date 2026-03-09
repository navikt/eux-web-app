import {BodyLong, Box, Tag} from '@navikt/ds-react'
import CountryData from '@navikt/land-verktoy'
import { Adresse } from 'declarations/sed'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {State} from "../../declarations/reducers";
import {useAppSelector} from "../../store";

interface AdresseBoxProps {
  adresse: Adresse | null | undefined
  border?: boolean
  padding?: string | number
  oneLine?: boolean
  seeType?: boolean
}

export interface AdresseBoxSelector {
  countryCodeMap: {key?: string} | null | undefined
}

const mapState = (state: State): AdresseBoxSelector => ({
  countryCodeMap: state.app.countryCodeMap
})

const AdresseBox = ({ adresse, border = true, padding = 1, oneLine = false, seeType = false }: AdresseBoxProps) => {
  const { countryCodeMap } = useAppSelector(mapState)
  const countryData = CountryData.getCountryInstance('nb')
  const country = countryData.findByValue3(adresse?.landkode)
  const { t } = useTranslation()
  if (!adresse) {
    return null
  }
  return (
    <Box
      borderWidth={border ? "1" : "0"}
      borderColor="neutral"
      borderRadius="2"
      style={{
        padding: padding + 'rem',
        display: oneLine ? 'inline-flex' : 'flex',
        flexDirection: oneLine ? 'row' : 'column',
        alignItems: 'flex-start'
      }}
    >
      {seeType && !!adresse.type && (
        <>
          <Tag data-color="info" size='small' variant="outline">{t('label:' + adresse.type)}</Tag>
          {oneLine && <>&nbsp;&nbsp;</>}
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
        {country ? country.label : countryCodeMap && adresse?.landkode ? countryCodeMap[adresse?.landkode as keyof typeof countryCodeMap] : adresse?.landkode}
      </BodyLong>
    </Box>
  );
}

export default AdresseBox
