import { FSed, ReplySed, USed } from 'declarations/sed.d'
import Flag, { FlagList } from 'flagg-ikoner'
import CountryData from 'land-verktoy'
import { UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import { themeKeys, HighContrastPanel, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
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

  return replySed && (
    <HighContrastPanel>
      <Undertittel>
        {replySed.sedType} v{replySed.sedVersjon}
      </Undertittel>
      <VerticalSeparatorDiv />
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
            items={replySed.bruker.personInfo.statsborgerskap.map(s => ({ country: s.land }))}
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
                  country={p.land!}
                  size='S'
                  type='circle'
                />
                <HorizontalSeparatorDiv data-size='0.5' />
                <div>
                  {p.sektor} - {p.identifikator} - {p.institusjonsid} - {p.institusjonsnavn}
                </div>
              </FlexDiv>
            ))}
          </Dd>
        )}
        {replySed.bruker.personInfo.pinMangler && (
          <>
            <Dt>
              {t('ui:label-birthPlace')}
            </Dt>
            <Dd>
              <Flag
                label={countryData.findByValue(replySed.bruker.personInfo.pinMangler.foedested.land)}
                country={replySed.bruker.personInfo.pinMangler.foedested.land}
                size='S'
                type='circle'
              />
              <HorizontalSeparatorDiv data-size='0.5' />
              {replySed.bruker.personInfo.pinMangler.foedested.by} - {replySed.bruker.personInfo.pinMangler.foedested.region}
            </Dd>
            <Dt>
              {t('ui:label-father')}
            </Dt>
            <Dd>
              {replySed.bruker.personInfo.pinMangler.far.fornavn} {replySed.bruker.personInfo.pinMangler.far.etternavnVedFoedsel}
            </Dd>
            <Dt>
              {t('ui:label-mother')}
            </Dt>
            <Dd>
              {replySed.bruker.personInfo.pinMangler.mor.fornavn} {replySed.bruker.personInfo.pinMangler.mor.etternavnVedFoedsel}
            </Dd>
            <Dt>
              {t('ui:label-nameatbirth')}
            </Dt>
            <Dd>
              {replySed.bruker.personInfo.pinMangler.fornavnVedFoedsel} {replySed.bruker.personInfo.pinMangler.etternavnVedFoedsel}
            </Dd>
          </>
        )}
      </Dl>
      <VerticalSeparatorDiv />
      <Dl>
        <Dt>
          {t('ui:label-periode')}:
        </Dt>
        {(replySed as USed).anmodningsperiode && (
          <Dd>
            {(replySed as USed).anmodningsperiode.startdato} -
            {(replySed as USed).anmodningsperiode.sluttdato ? (replySed as USed).anmodningsperiode.sluttdato : ''}
          </Dd>
        )}
        {(replySed as FSed).anmodningsperioder && (replySed as FSed).anmodningsperioder.map(p => (
          <Dd key={p.startdato}>
            {p.startdato} -
            {p.sluttdato ? p.sluttdato : ''}
          </Dd>
        ))}
      </Dl>
      <VerticalSeparatorDiv />
      <UndertekstBold>
        {t('ui:label-local-sakId')}:
      </UndertekstBold>
      <Dl>
        {(replySed as USed).lokaleSakIder && (replySed as USed).lokaleSakIder.map(s => (
          <div key={s.saksnummer}>
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
              <HorizontalSeparatorDiv data-size='0.5' />
              {s.institusjonsnavn} - {s.institusjonsid}
            </Dd>
          </div>
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

  </Dl> */
