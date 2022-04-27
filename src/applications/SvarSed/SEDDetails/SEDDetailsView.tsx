import { Detail } from '@navikt/ds-react'
import Flag, { FlagList } from '@navikt/flagg-ikoner'
import { FlexCenterDiv, FlexDiv, HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import CountryData from '@navikt/land-verktoy'
import { Dd, Dl, Dt } from 'components/StyledComponents'
import { F002Sed, ReplySed, USed } from 'declarations/sed'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { isF002Sed, isUSed } from 'utils/sed'

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
      {isUSed(replySed) && (
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
          </Dd>
        </>
      )}
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
      </Dl>
    </>
  )
}

export default SEDDetailsView
