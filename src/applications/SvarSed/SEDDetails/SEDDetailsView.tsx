import { Warning, SuccessFilled } from '@navikt/ds-icons'
import { Dd, Dl, Dt } from 'components/StyledComponents'
import { F002Sed, FSed, ReplySed, USed } from 'declarations/sed'
import Flag, { FlagList } from 'flagg-ikoner'
import CountryData from 'land-verktoy'
import { BodyLong, Detail } from '@navikt/ds-react'
import { FlexCenterDiv, FlexDiv, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { isF002Sed, isFSed, isHSed, isUSed } from 'utils/sed'

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
        {!isHSed(replySed) && (
          <>
            <Dt>
              {t('label:periode')}
            </Dt>
            <Dd>
              {(replySed as USed).anmodningsperiode && (
                <Detail>
                  {(replySed as USed).anmodningsperiode.startdato} -
                  {(replySed as USed).anmodningsperiode.sluttdato ? (replySed as USed).anmodningsperiode.sluttdato : '...'}
                </Detail>
              )}
              {(replySed as FSed).anmodningsperioder && (replySed as FSed).anmodningsperioder.map((p) => (
                <Detail key={p.startdato}>
                  {p.startdato} - {p.sluttdato ? p.sluttdato : '...'}
                </Detail>
              ))}
            </Dd>
          </>
        )}
        <Dt>{t('label:søker')}</Dt>
        <Dd>
          <FlexDiv>
            {replySed.bruker.personInfo.statsborgerskap && (
              <FlagList
                size='XS'
                type='circle'
                items={replySed.bruker.personInfo.statsborgerskap.map((s: any) => ({ country: s.land }))}
              />
            )}
            <HorizontalSeparatorDiv size='0.35' />
            <span>
              {replySed.bruker.personInfo.fornavn} {replySed.bruker.personInfo.etternavn ?? ''} ({replySed.bruker.personInfo.kjoenn})
            </span>
          </FlexDiv>
        </Dd>
        {isF002Sed(replySed) && (
          <>
            <Dt>{t('label:partner')}</Dt>
            <Dd>
              <FlexDiv>
                {(replySed as F002Sed)?.ektefelle?.personInfo?.statsborgerskap && (
                  <FlagList
                    size='XS'
                    type='circle'
                    items={(replySed as F002Sed).ektefelle?.personInfo?.statsborgerskap?.map((s: any) => ({ country: s.land }))}
                  />
                )}
                <HorizontalSeparatorDiv size='0.35' />
                <span>
                  {(replySed as F002Sed).ektefelle
                    ? (replySed as F002Sed).ektefelle?.personInfo?.fornavn + ' ' +
                    ((replySed as F002Sed).ektefelle?.personInfo?.etternavn ?? '') + ' (' +
                    ((replySed as F002Sed).ektefelle?.personInfo?.kjoenn ?? '') + ')'
                    : '-'}
                </span>
              </FlexDiv>
            </Dd>
          </>
        )}
        {isUSed(replySed) && (replySed as USed).lokaleSakIder?.map(s => (
          <React.Fragment key={s.institusjonsid}>
            <Dt>
              {t('label:motpart-sakseier')}
            </Dt>
            <Dd>
              <FlexCenterDiv>
                <Flag
                  size='XS'
                  type='circle'
                  country={s.land}
                  label={countryData.findByValue(s.land)?.label}
                />
                <HorizontalSeparatorDiv size='0.35' />
                {s.institusjonsnavn}
              </FlexCenterDiv>
            </Dd>
          </React.Fragment>
        ))}
        {isFSed(replySed) && (replySed as F002Sed).krav?.kravType && (
          <>
            <Dt>
              {t('label:type-krav')}
            </Dt>
            <Dd>
              {t('app:kravType-' + (replySed as F002Sed).krav?.kravType)}
            </Dd>
            <Dt>
              {t('label:krav-mottatt-dato')}
            </Dt>
            <Dd>
              {(replySed as F002Sed).krav?.kravMottattDato}
            </Dd>
            {(replySed as F002Sed).krav?.infoType === 'vi_bekrefter_leverte_opplysninger' && (
              <>
                <VerticalSeparatorDiv size='3' />
                <FlexDiv>
                  <SuccessFilled color='green' width={18} height={18} />
                  <HorizontalSeparatorDiv size='0.5' />
                  <BodyLong>
                    {t('app:info-confirm-information')}
                  </BodyLong>
                </FlexDiv>
              </>
            )}
            {(replySed as F002Sed).krav?.infoType === 'gi_oss_punktvise_opplysninger' && (
              <>
                <VerticalSeparatorDiv size='3' />
                <FlexDiv>
                  <Warning width={18} height={18} />
                  <HorizontalSeparatorDiv size='0.5' />
                  <BodyLong>
                    {t('app:info-point-information')}
                  </BodyLong>
                </FlexDiv>
                <VerticalSeparatorDiv />
                <FlexDiv>
                  <Blockquote>
                    {(replySed as F002Sed).krav?.infoPresisering}
                  </Blockquote>
                </FlexDiv>
              </>
            )}
          </>
        )}
      </Dl>
    </>
  )
}

export default SEDDetailsView
