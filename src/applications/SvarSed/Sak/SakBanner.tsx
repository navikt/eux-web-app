/// <reference types="vite-plugin-svgr/client" />
import { ExternalLinkIcon, FilesIcon } from '@navikt/aksel-icons'
import InformationIcon from 'assets/icons/InformationIconOld.svg?react'
import {BodyLong, Label, Heading, Link, Popover, Alert, Box, HStack, Spacer, VStack, Button, Tag} from '@navikt/ds-react'
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
import styles from './SakBanner.module.css'

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

  let cdmVariant: any = ""
  switch (currentSak.cdmVersjon){
    case '4.2':
      cdmVariant = "alt3-moderate"
      break
    case '4.3':
      cdmVariant = "alt2-moderate"
      break
    case '4.4':
      cdmVariant = "alt1-moderate"
      break
    default:
      cdmVariant = "neutral-moderate"
      break
  }

  return (
    <Box background="bg-default" paddingBlock="4" paddingInline="16">
      <HStack gap="4" align="start">
        <VStack>
          <Heading size='small'>
            {currentSak.sakType + ' - ' + currentSak.sakTittel}
          </Heading>
          <BodyLong>
            {thisSektorName ? thisSektorName + ' ' + t('label:sektor').toLowerCase() : ''}
          </BodyLong>
        </VStack>
        <Spacer/>
        <VStack>
          <HStack gap="4">
            <img
              alt={kind}
              width={24}
              height={24}
              src={src}
            />
            {!!currentSak.fornavn && currentSak.etternavn && (
              <HStack gap="2">
                <Label>
                  {currentSak.etternavn + ', ' + currentSak.fornavn}
                </Label>
                <Link
                  title={t('label:kopiere')} onClick={(e: any) => {
                    e.preventDefault()
                    e.stopPropagation()
                    dispatch(copyToClipboard(currentSak.etternavn + ', ' + currentSak.fornavn))
                  }}
                >
                  <FilesIcon />
                </Link>
              </HStack>
            )}
          </HStack>
          <HStack gap="2">
            {currentSak.fnr && (
              <>
                {t('label:fnr.') + ': '}
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
            {toDateFormat(currentSak.foedselsdato, 'DD.MM.YYYY')}
          </HStack>
          {currentSak.adressebeskyttelse && currentSak.adressebeskyttelse !== "UGRADERT" &&
            <Alert size="small" variant='warning'>
              <span>{t('label:sensitivPerson', {gradering: currentSak.adressebeskyttelse})}</span>
            </Alert>
          }
        </VStack>
        <Spacer/>
        <VStack>
          {currentSak && currentSak.cdmVersjon &&
            <Box>
              <Tag size="small" variant={cdmVariant}>CDM: {currentSak.cdmVersjon}</Tag>
            </Box>
          }
          <HStack gap="2">
            <HStack gap="4">
              <span>
                {t('label:rina-saksnummer')}
              </span>
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
            </HStack>
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
                      &nbsp;
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
                <Button icon={<InformationIcon/>} ref={iconRef} onClick={() => setPopoverOpen(!popoverOpen)} className={styles.popOverButton}/>
              </>
            )}
          </HStack>
          <HStack gap="2">
            <Link target='_blank' href={currentSak.sakUrl} rel='noreferrer'>
              <span>
                {t('label:åpne_sak_i_RINA')}
              </span>
              <ExternalLinkIcon />
            </Link>
          </HStack>
          {currentSak.sensitiv &&
            <Alert size="small" variant='warning'>
              <span>{t('label:sensitivSak')}</span>
            </Alert>
          }
        </VStack>
      </HStack>
    </Box>
  )
}

export default SakBanner
