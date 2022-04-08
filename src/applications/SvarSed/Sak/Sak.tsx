import { ExternalLink, Copy } from '@navikt/ds-icons'
import { BodyLong, Heading, Link } from '@navikt/ds-react'
import { FlexDiv, FullWidthDiv, HorizontalSeparatorDiv, PileDiv } from '@navikt/hoykontrast'
import { copyToClipboard } from 'actions/app'
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

const SakFC = ({sak}: SakProps) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const sektor : Array<Kodeverk> | undefined = useSelector<State, Array<Kodeverk> | undefined>(state => state.app.sektor)

  let thisSektor = sak.sakType.split('_')[0]
  if (thisSektor === 'H') {thisSektor = 'HZ'}
  const thisSektorName: string | undefined = _.find(sektor, s => s.kode === thisSektor)?.term

  return (
    <Panel>
      <PileDiv>
        <Heading size='small'>
          {sak.sakType + ' - ' + sak.sakTittel}
        </Heading>
        <BodyLong>
          {thisSektorName ?? ''}
        </BodyLong>
      </PileDiv>
      <PileDiv>
        User
      </PileDiv>
      <PileDiv>

      </PileDiv>
      <PileDiv>
        <FlexDiv>
          <span>
            {t('label:rina-saksnummer') + ' ' + sak.sakId }
          </span>
          <HorizontalSeparatorDiv />
          <Link title={t('label:kopiere')} onClick={(e: any) => {
            e.preventDefault()
            e.stopPropagation()
            dispatch(copyToClipboard(sak.sakId))
          }}>
            <Copy/>
          </Link>

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

export default SakFC
