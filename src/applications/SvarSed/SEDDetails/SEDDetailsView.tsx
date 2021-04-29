import FilledCheckCircle from 'assets/icons/CheckCircle'
import Warning from 'assets/icons/Warning'
import { F002Sed, FSed, ReplySed, USed } from 'declarations/sed'
import Flag, { FlagList } from 'flagg-ikoner'
import CountryData from 'land-verktoy'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import { HorizontalSeparatorDiv, themeKeys, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Dd = styled.dd`
  width: 60%;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  margin-bottom: 0;
  margin-inline-start: 0;
`
const Dt = styled.dt`
  width: 40%;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
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
const Blockquote = styled.blockquote`
  border-left: 2px solid gray;
  padding-left: 1rem;
  margin-inline-start: 1rem;
  margin-inline-end: 0rem;
  font-style: italic;
`
export interface SEDDetailsViewProps {
  replySed: ReplySed
}

const SEDDetailsView: React.FC<SEDDetailsViewProps> = ({
  replySed
}: SEDDetailsViewProps): JSX.Element => {
  const { t } = useTranslation()
  const countryData = CountryData.getCountryInstance('nb')
  return (
    <>
      <Dl>
        <Dt>
          {t('label:periode')}
        </Dt>
        <Dd>
          {(replySed as USed).anmodningsperiode && (
            <UndertekstBold>
              {(replySed as USed).anmodningsperiode.startdato} -
              {(replySed as USed).anmodningsperiode.sluttdato ? (replySed as USed).anmodningsperiode.sluttdato : '...'}
            </UndertekstBold>
          )}
          {(replySed as FSed).anmodningsperioder && (replySed as FSed).anmodningsperioder.map((p) => (
            <UndertekstBold key={p.startdato}>
              {p.startdato} - {p.sluttdato ? p.sluttdato : '...'}
            </UndertekstBold>
          ))}
        </Dd>
      </Dl>
      <VerticalSeparatorDiv />
      <Dl>
        <Dt>{t('label:søker')}</Dt>
        <Dd>
          <span>
            {replySed.bruker.personInfo.fornavn} {replySed.bruker.personInfo.etternavn} ({replySed.bruker.personInfo.kjoenn})
          </span>
          {replySed.bruker.personInfo.statsborgerskap && (
            <FlagList
              size='S'
              type='circle'
              items={replySed.bruker.personInfo.statsborgerskap.map((s: any) => ({ country: s.land }))}
            />
          )}
        </Dd>
        {replySed.sedType.startsWith('F') && (
          <>
            <Dt>{t('label:partner')}</Dt>
            <Dd>
              <span>
                {(replySed as F002Sed).ektefelle
                  ? (replySed as F002Sed).ektefelle.personInfo.fornavn + ' ' +
                   (replySed as F002Sed).ektefelle.personInfo.etternavn +
                ' (' + (replySed as F002Sed).ektefelle.personInfo.kjoenn + ')'
                  : '-'}
              </span>
              {(replySed as F002Sed).ektefelle.personInfo.statsborgerskap && (
                <FlagList
                  size='S'
                  type='circle'
                  items={(replySed as F002Sed).ektefelle.personInfo.statsborgerskap.map((s: any) => ({ country: s.land }))}
                />
              )}
            </Dd>
          </>
        )}
      </Dl>
      <VerticalSeparatorDiv />
      {replySed.sedType.startsWith('U') && (replySed as USed).lokaleSakIder.map(s => (
        <div key={s.institusjonsnavn}>
          <Dl>
            <Dt>
              {t('label:motpart-sakseier')}
            </Dt>
            <Dd>
              <FlexDiv>
                <Flag
                  size='XS'
                  type='circle'
                  country={s.land}
                  label={countryData.findByValue(s.land)?.label}
                />
                <HorizontalSeparatorDiv data-size='0.35' />
                {countryData.findByValue(s.land)?.label}
              </FlexDiv>
            </Dd>
          </Dl>
          <Dl>
            <Dt>
              {t('label:avsenderinstitusjon')}
            </Dt>
            <Dd>
              {s.institusjonsnavn}
            </Dd>
          </Dl>
        </div>
      ))}
      <VerticalSeparatorDiv />
      {replySed.sedType.startsWith('F') && (
        <>
          <Dl>
            <Dt>
              {t('label:type-krav')}
            </Dt>
            <Dd>
              {t('app:kravType-' + (replySed as F002Sed).krav.kravType)}
            </Dd>
          </Dl>
        </>
      )}
      <VerticalSeparatorDiv />
      <FlexDiv>
        <FilledCheckCircle color='green' width={18} height={18} />
        <HorizontalSeparatorDiv data-size='0.5' />
        <Normaltekst>
          {t('app:info-confirm-information')}
        </Normaltekst>
      </FlexDiv>
      <VerticalSeparatorDiv />
      <FlexDiv>
        <Warning width={18} height={18} />
        <HorizontalSeparatorDiv data-size='0.5' />
        <Normaltekst>
          {t('app:info-point-information')}
        </Normaltekst>
      </FlexDiv>
      <FlexDiv>
        <Blockquote>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed ac quam quis libero sagittis faucibus. Duis posuere neque sem,
          sed efficitur libero ultrices a. Curabitur ut nisl ultricies, gravida
          diam et, faucibus metus. Donec fringilla tristique est.
        </Blockquote>
      </FlexDiv>
    </>
  )
}

export default SEDDetailsView
