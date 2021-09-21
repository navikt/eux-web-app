import GreenCircle from 'assets/icons/GreenCircle'
import Warning from 'assets/icons/Warning'
import { Dd, Dl, Dt } from 'components/StyledComponents'
import { F002Sed, FSed, ReplySed, USed } from 'declarations/sed'
import Flag, { FlagList } from 'flagg-ikoner'
import CountryData from 'land-verktoy'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import { FlexCenterDiv, FlexDiv, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { isF002Sed, isFSed, isUSed } from 'utils/sed'

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
              {replySed.bruker.personInfo.fornavn} {replySed.bruker.personInfo.etternavn} ({replySed.bruker.personInfo.kjoenn})
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
                    items={(replySed as F002Sed).ektefelle.personInfo.statsborgerskap.map((s: any) => ({ country: s.land }))}
                  />
                )}
                <HorizontalSeparatorDiv size='0.35' />
                <span>
                  {(replySed as F002Sed).ektefelle
                    ? (replySed as F002Sed).ektefelle.personInfo.fornavn + ' ' +
                   (replySed as F002Sed).ektefelle.personInfo.etternavn +
                ' (' + (replySed as F002Sed).ektefelle.personInfo.kjoenn + ')'
                    : '-'}
                </span>
              </FlexDiv>
            </Dd>
          </>
        )}
      </Dl>
      <VerticalSeparatorDiv />
      {isUSed(replySed) && (replySed as USed).lokaleSakIder?.map(s => (
        <div key={s.institusjonsnavn}>
          <Dl>
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
          </Dl>
          <VerticalSeparatorDiv />
        </div>
      ))}
      {isFSed(replySed) && (replySed as F002Sed).krav?.kravType && (
        <div>
          <Dl>
            <Dt>
              {t('label:type-krav')}
            </Dt>
            <Dd>
              {t('app:kravType-' + (replySed as F002Sed).krav.kravType)}
            </Dd>
          </Dl>
          <Dl>
            <Dt>
              {t('label:krav-mottatt-dato')}
            </Dt>
            <Dd>
              {(replySed as F002Sed).krav.kravMottattDato}
            </Dd>
          </Dl>
          {(replySed as F002Sed).krav?.infoType === 'vi_bekrefter_leverte_opplysninger' && (
            <FlexDiv>
              <GreenCircle width={18} height={18} />
              <HorizontalSeparatorDiv size='0.5' />
              <Normaltekst>
                {t('app:info-confirm-information')}
              </Normaltekst>
            </FlexDiv>
          )}
          {(replySed as F002Sed).krav?.infoType === 'gi_oss_punktvise_opplysninger' && (
            <>
              <FlexDiv>
                <Warning width={18} height={18} />
                <HorizontalSeparatorDiv size='0.5' />
                <Normaltekst>
                  {t('app:info-point-information')}
                </Normaltekst>
              </FlexDiv>
              <VerticalSeparatorDiv />
              <FlexDiv>
                <Blockquote>
                  {(replySed as F002Sed).krav?.infoPresisering}
                </Blockquote>
              </FlexDiv>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default SEDDetailsView
