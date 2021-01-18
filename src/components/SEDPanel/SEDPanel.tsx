import { ReplySed } from 'declarations/types'
import Flag, { FlagList } from 'flagg-ikoner'
import CountryData from 'land-verktoy'
import { UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import { HighContrastPanel, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import { themeKeys } from 'nav-styled-component-theme'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Dd = styled.dd`
  width: 50%;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  margin-bottom: 0;
  margin-inline-start: 0;
`
const Dt = styled.dt`
  width: 50%;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  .typo-element {
    margin-left: 0.5rem;
  }
`
const Dl = styled.dl`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .odd {
    background-color: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  }
`
const FlexDiv = styled.div`
  display: flex;
`
interface SEDPanelProps {
  replySed: ReplySed
}

const SEDPanel = ({ replySed }: SEDPanelProps) => {
  const { t } = useTranslation()
  const countryData = CountryData.getCountryInstance('nb')

  return (
    <HighContrastPanel>
      <Undertittel>
        {replySed.sedType} v{replySed.sedVersjon}
      </Undertittel>
      <VerticalSeparatorDiv/>
      <UndertekstBold>
        {t('ui:label-userInSed')}:
      </UndertekstBold>
      <Dl>
        <Dt>{t('ui:label-name')}</Dt>
        <Dd>{replySed.bruker.personInfo.fornavn} {replySed.bruker.personInfo.etternavn} ({replySed.bruker.personInfo.kjoenn})</Dd>
        <Dt>{t('ui:label-birthDate')}</Dt>
        <Dd>{replySed.bruker.personInfo.foedselsdato}</Dd>
        <Dt>{t('ui:label-nationality')}</Dt>
        <Dd>
          <FlagList
            size='S'
            type='circle'
            items={replySed.bruker.personInfo.statsborgerskap.map(s => ({country: s.land}))}
            />
        </Dd>
        <Dt>
          {t('ui:label-pin')}
        </Dt>
        {replySed.bruker.personInfo.pin && (
          <Dd>
            {replySed.bruker.personInfo.pin.map(p => (
              <FlexDiv key={p.identifikator}>
              <Flag
                 label={countryData.findByValue(p.land)}
                 country={p.land}
                 size='S'
                 type='circle'
              />
              <HorizontalSeparatorDiv data-size='0.5'/>
                {p.sektor} - {p.identifikator} - {p.institusjonsid} - {p.institusjonsnavn}
              </FlexDiv>
            ))}
          </Dd>
        )}
        {replySed.bruker.personInfo.pinmangler && (
          <>
          <Dt>
              {t('ui:label-birthPlace')}
          </Dt>
          <Dd>
            <Flag
              label={countryData.findByValue(replySed.bruker.personInfo.pinmangler.foedested.land)}
              country={replySed.bruker.personInfo.pinmangler.foedested.land}
              size='S'
              type='circle'
              />
          <HorizontalSeparatorDiv data-size='0.5'/>
          {replySed.bruker.personInfo.pinmangler.foedested.by} - {replySed.bruker.personInfo.pinmangler.foedested.region}
          </Dd>
          <Dt>
            {t('ui:label-father')}
          </Dt>
          <Dd>
            {replySed.bruker.personInfo.pinmangler.far.fornavn} {replySed.bruker.personInfo.pinmangler.far.etternavnvedfoedsel}
          </Dd>
          <Dt>
          {t('ui:label-mother')}
          </Dt>
          <Dd>
          {replySed.bruker.personInfo.pinmangler.mor.fornavn} {replySed.bruker.personInfo.pinmangler.mor.etternavnvedfoedsel}
          </Dd>
          <Dt>
          {t('ui:label-nameatbirth')}
          </Dt>
          <Dd>
          {replySed.bruker.personInfo.pinmangler.fornavnvedfoedsel} {replySed.bruker.personInfo.pinmangler.etternavnvedfoedsel}
          </Dd>
         </>
        )}
      </Dl>
      <VerticalSeparatorDiv/>
      <Dl>
        <Dt>
          {t('ui:label-periode')}:
        </Dt>
        <Dd>
          {replySed.anmodningsperiode.startdato} -
          {replySed.anmodningsperiode.sluttdato ?  replySed.anmodningsperiode.sluttdato : ''}
        </Dd>
      </Dl>
      <VerticalSeparatorDiv/>
      <UndertekstBold>
        {t('ui:label-local-sakId')}:
      </UndertekstBold>
      <Dl>
        {replySed.lokaleSakIder.map(s => (
          <>
          <Dt>
            {t('ui:label-saksnummer')}
          </Dt>
          <Dd>
            {s.saksnummer}
          </Dd>
            <Dt>
              {t('ui:label-institusjon')}
            </Dt>
            <Dd>

              <Flag
                label={countryData.findByValue(s.land)}
                country={s.land}
                size='S'
                type='circle'
              />
              <HorizontalSeparatorDiv data-size='0.5'/>
              {s.institusjonsnavn} - {s.institusjonsid}
            </Dd>
          </>
      ))}
      </Dl>




    </HighContrastPanel>


  )
}

export default SEDPanel

/*
  <Dl>
    <Dt>Periode:</Dt>
    <Dd />

  </Dl>*/
