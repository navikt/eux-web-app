/// <reference types="vite-plugin-svgr/client" />
import { ExternalLinkIcon, FilesIcon } from '@navikt/aksel-icons'
import InformationIcon from 'assets/icons/InformationIconOld.svg?react'
import {BodyLong, Label, Heading, Link, Popover, Alert, Button} from '@navikt/ds-react'
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
import { toDateFormat } from 'components/DateField/DateField'
import styled from 'styled-components'

const Panel = styled(FullWidthDiv)`
  background-color: var(--a-bg-default);
  justify-content: space-between;
  display: flex;
  padding: 0.5rem 3rem;
`

const PopOverButton = styled(Button)`
  color: black;
  background-color: transparent;
  padding: 0;
  &:hover {
    background-color: transparent;
  }

  > .navds-button__icon {
    width: 20px
  }
`

const SakBanner = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const sektor : Array<Kodeverk> | undefined = useAppSelector(state => state.app.sektor)
  const currentSak: Sak | undefined = useAppSelector(state => state.svarsed.currentSak)
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
  const iconRef = useRef(null)

  let thisSektor = currentSak?.sakType.split('_')[0]
  if (thisSektor === 'H') { thisSektor = 'HZ' }
  const thisSektorName: string | undefined = _.find(sektor, s => s.kode === thisSektor)?.term

  let kind: string = 'nav-unknown-icon'
  let src = ukjent
  if (currentSak?.kjoenn === 'K') {
    kind = 'nav-woman-icon'
    src = kvinne
  } else if (currentSak?.kjoenn === 'M') {
    kind = 'nav-man-icon'
    src = mann
  }

  if (_.isNil(currentSak)) {
    return null
  }

  return (
    <Panel>
      <PileDiv>
        <Heading size='small'>
          {currentSak.sakType + ' - ' + currentSak.sakTittel}
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
          {!!currentSak.fornavn && currentSak.etternavn && (
            <>
              <Label>
                {currentSak.etternavn + ', ' + currentSak.fornavn}
              </Label>
              <HorizontalSeparatorDiv size='0.5' />
              <Link
                title={t('label:kopiere')} onClick={(e: any) => {
                  e.preventDefault()
                  e.stopPropagation()
                  dispatch(copyToClipboard(currentSak.etternavn + ', ' + currentSak.fornavn))
                }}
              >
                <FilesIcon />
              </Link>
            </>
          )}
        </FlexDiv>
        <FlexDiv>
          {currentSak.fnr && (
            <>
              {t('label:fnr.') + ': '}
              <HorizontalSeparatorDiv size='0.5' />
              <Link
                title={t('label:kopiere')} onClick={(e: any) => {
                  e.preventDefault()
                  e.stopPropagation()
                  dispatch(copyToClipboard(currentSak.fnr))
                }}
              >
                {' ' + currentSak.fnr + ' '}
                <FilesIcon />
              </Link>
            </>
          )}
          <HorizontalSeparatorDiv />
          {toDateFormat(currentSak.foedselsdato, 'DD.MM.YYYY')}
        </FlexDiv>
        {currentSak.adressebeskyttelse && currentSak.adressebeskyttelse !== "UGRADERT" &&
          <FlexDiv>
            <Alert size="small" variant='warning'>
              <span>{t('label:sensitivPerson', {gradering: currentSak.adressebeskyttelse})}</span>
            </Alert>
          </FlexDiv>
        }
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
              dispatch(copyToClipboard(currentSak.sakId))
            }}
          >
            {currentSak.sakId + ' '}
            <FilesIcon />
          </Link>
          {!!currentSak.internasjonalSakId && (
            <>
              <Popover
                open={popoverOpen}
                onClose={() => setPopoverOpen(false)}
                arrow
                anchorEl={iconRef.current}
              >
                <Popover.Content style={{ maxWidth: '600px' }}>
                  <Heading size='small'>
                    {t('label:international-id')}:
                    <HorizontalSeparatorDiv />
                    <Link
                      title={t('label:kopiere')} onClick={(e: any) => {
                        e.preventDefault()
                        e.stopPropagation()
                        dispatch(copyToClipboard(currentSak.internasjonalSakId!))
                      }}
                    >
                      {currentSak.internasjonalSakId + ' '}
                      <FilesIcon />
                    </Link>
                  </Heading>
                  {t('message:help-international-id')}
                </Popover.Content>
              </Popover>
              &nbsp;
              <PopOverButton icon={<InformationIcon/>} ref={iconRef} onClick={() => setPopoverOpen(!popoverOpen)} />
            </>
          )}
        </FlexDiv>
        <FlexDiv>
          <Link target='_blank' href={currentSak.sakUrl} rel='noreferrer'>
            <span>
              {t('label:åpne_sak_i_RINA')}
            </span>
            <HorizontalSeparatorDiv size='0.35' />
            <ExternalLinkIcon />
          </Link>
        </FlexDiv>
        {currentSak.sensitiv &&
          <FlexDiv>
            <Alert size="small" variant='warning'>
              <span>{t('label:sensitivSak')}</span>
            </Alert>
          </FlexDiv>
        }
      </PileDiv>
    </Panel>
  )
}

export default SakBanner
