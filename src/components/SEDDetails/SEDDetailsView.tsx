import { F002Sed, FSed, ReplySed, USed } from 'declarations/sed'
import { FlagList } from 'flagg-ikoner'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import FilledCheckCircle from 'assets/icons/filled-version-check-circle-2'
import { themeKeys, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
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

export interface SEDDetailsViewProps {
  replySed: ReplySed
}

const SEDDetailsView: React.FC<SEDDetailsViewProps> = ({
  replySed
}: SEDDetailsViewProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <>
      <Dl>
        <Dt>
          {t('ui:label-periode')}:
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
      <VerticalSeparatorDiv/>
      <Dl>
        <Dt>{t('ui:label-searcher')}</Dt>
        <Dd>
          <span>
            {replySed.bruker.personInfo.fornavn} {replySed.bruker.personInfo.etternavn} ({replySed.bruker.personInfo.kjoenn})
          </span>
          <FlagList
            size='S'
            type='circle'
            items={replySed.bruker.personInfo.statsborgerskap.map((s: any) => ({ country: s.land }))}
          />
        </Dd>
        <Dt>{t('ui:relationship-ektefelle')}</Dt>
        <Dd>
           <span>
             {(replySed as F002Sed).ektefelle ? (replySed as F002Sed).ektefelle.personInfo.fornavn + ' '  +
               (replySed as F002Sed).ektefelle.personInfo.etternavn +
            ' (' + (replySed as F002Sed).ektefelle.personInfo.kjoenn + ')' : '-'}
           </span>
          <FlagList
            size='S'
            type='circle'
            items={(replySed as F002Sed).ektefelle.personInfo.statsborgerskap.map((s: any) => ({ country: s.land }))}
          />
        </Dd>
      </Dl>
      <VerticalSeparatorDiv />
      <Dl>
        <Dt>
          {t('ui:label-caseOwner')}
        </Dt>
        <Dd>
          ?
        </Dd>
        <Dt>
          {t('ui:label-sender')}
        </Dt>
        <Dd>
          ?
        </Dd>
      </Dl>
      <VerticalSeparatorDiv />
      <Dl>
        <Dt>
          {t('ui:label-typeKrav')}
        </Dt>
        <Dd>
          {t('ui:kravType-' + (replySed as F002Sed).krav.kravType)}
        </Dd>
      </Dl>
      <VerticalSeparatorDiv />
      <FlexDiv>
        <FilledCheckCircle color='green' width={18} height={18}/>
        <HorizontalSeparatorDiv data-size='0.5'/>
        <Normaltekst>
          {t('ui:info-confirm-information')}
        </Normaltekst>
      </FlexDiv>
    </>
  )
}

export default SEDDetailsView
