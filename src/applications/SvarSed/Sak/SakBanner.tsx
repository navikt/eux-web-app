import { ExternalLink, Copy, InformationFilled } from '@navikt/ds-icons'
import { BodyLong, Label, Heading, Link, Popover } from '@navikt/ds-react'
import { FlexDiv, FullWidthDiv, HorizontalSeparatorDiv, PileDiv } from '@navikt/hoykontrast'
import { copyToClipboard } from 'actions/app'
import mann from 'assets/icons/Man.png'
import ukjent from 'assets/icons/Unknown.png'
import kvinne from 'assets/icons/Woman.png'
import { Kodeverk, Sak } from 'declarations/types'
import _ from 'lodash'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
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
  const dispatch = useAppDispatch()
  const sektor : Array<Kodeverk> | undefined = useAppSelector(state => state.app.sektor)
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
  const iconRef = useRef(null)

  let thisSektor = sak.sakType.split('_')[0]
  if (thisSektor === 'H') { thisSektor = 'HZ' }
  const thisSektorName: string | undefined = _.find(sektor, s => s.kode === thisSektor)?.term

  let kind: string = 'nav-unknown-icon'
  let src = ukjent
  if (sak?.kjoenn === 'K') {
    kind = 'nav-woman-icon'
    src = kvinne
  } else if (sak?.kjoenn === 'M') {
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
        <FlexDiv>
          <img
            alt={kind}
            width={24}
            height={24}
            src={src}
          />
          <HorizontalSeparatorDiv />
          <Label>
            {sak.etternavn + ', ' + sak.fornavn}
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
            {' ' + sak.fnr + ' '}
            <Copy />
          </Link>
          <HorizontalSeparatorDiv />
          {sak.foedselsdato}
        </FlexDiv>
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
          <Popover
            open={popoverOpen}
            onClose={() => setPopoverOpen(false)}
            arrow
            anchorEl={iconRef.current}
            placement='auto'
          >
            <Popover.Content style={{ maxWidth: '600px' }}>
              <Heading size='small'>
                {t('label:international-id')}:
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
              </Heading>
              {t('message:help-international-id')}
            </Popover.Content>
          </Popover>
          <InformationFilled
            style={{ cursor: 'pointer' }}
            ref={iconRef}
            onClick={() => setPopoverOpen(!popoverOpen)}
          />
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
