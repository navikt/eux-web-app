import { ExternalLink, Copy, InformationFilled } from '@navikt/ds-icons'
import { BodyLong, Label, Heading, Link } from '@navikt/ds-react'
import { FlexDiv, FullWidthDiv, HorizontalSeparatorDiv, PileDiv } from '@navikt/hoykontrast'
import { copyToClipboard } from 'actions/app'
import mann from 'assets/icons/Man.png'
import ukjent from 'assets/icons/Unknown.png'
import kvinne from 'assets/icons/Woman.png'
import { State } from 'declarations/reducers'
import { Kodeverk, Sak } from 'declarations/types'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

interface SakProps {
  sak: Sak
}

const Panel = styled(FullWidthDiv)`
  background-color: var(--navds-panel-color-background);
  justify-content: space-between;
  display: flex;
  padding: 0.5rem 3rem;
`

const SakBanner = ({ sak }: SakProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const sektor : Array<Kodeverk> | undefined = useSelector<State, Array<Kodeverk> | undefined>(state => state.app.sektor)

  let thisSektor = sak.sakType.split('_')[0]
  if (thisSektor === 'H') { thisSektor = 'HZ' }
  const thisSektorName: string | undefined = _.find(sektor, s => s.kode === thisSektor)?.term

  let kind: string = 'nav-unknown-icon'
  let src = ukjent
  if (sak?.person?.kjoenn === 'K') {
    kind = 'nav-woman-icon'
    src = kvinne
  } else if (sak?.person?.kjoenn === 'M') {
    kind = 'nav-man-icon'
    src = mann
  }

  return (
    <Panel>
      <PileDiv>
        <Heading size='small'>
          {sak.sakType + ' - ' + sak.sakTittel}
        </Heading>
        <BodyLong>
          {thisSektorName ? thisSektorName + ' ' + t('label:sektor').toLowerCase() : ''}
        </BodyLong>
      </PileDiv>
      <PileDiv>
        {sak.person && (
          <>
            <FlexDiv>
              <img
                alt={kind}
                width={24}
                height={24}
                src={src}
              />
              <HorizontalSeparatorDiv />
              <Label>
                {sak.person.etternavn + ', ' + sak.person.fornavn}
              </Label>
            </FlexDiv>
            <FlexDiv>
              {t('label:fnr.') + ': '}
              <HorizontalSeparatorDiv size='0.5' />
              <Link
                title={t('label:kopiere')} onClick={(e: any) => {
                  e.preventDefault()
                  e.stopPropagation()
                  dispatch(copyToClipboard(sak.sakId))
                }}
              >
                {' ' + sak.person.fnr + ' '}
                <Copy />
              </Link>
              <HorizontalSeparatorDiv />
              {sak.person.foedselsdato}
            </FlexDiv>
          </>

        )}
      </PileDiv>
      <PileDiv>
        <FlexDiv>
          <span>
            {t('label:rina-saksnummer')}
          </span>
          <HorizontalSeparatorDiv />
          <Link
            title={t('label:kopiere')} onClick={(e: any) => {
              e.preventDefault()
              e.stopPropagation()
              dispatch(copyToClipboard(sak.sakId))
            }}
          >
            {sak.sakId + ' '}
            <Copy />
          </Link>
          <HorizontalSeparatorDiv />
          <InformationFilled />
        </FlexDiv>
        <FlexDiv>
          <Link target='_blank' href={sak.sakUrl} rel='noreferrer'>
            <span>
              {t('label:åpne_sak_i_RINA')}
            </span>
            <HorizontalSeparatorDiv size='0.35' />
            <ExternalLink />
          </Link>
        </FlexDiv>
      </PileDiv>
    </Panel>
  )
}

export default SakBanner