import { FilesIcon, ExternalLinkIcon } from '@navikt/aksel-icons'
import {Alert, BodyLong, HStack, Link, Spacer, LinkCard} from '@navikt/ds-react'

import { Sak } from 'declarations/types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './SakPanel.module.css'

interface SakPanelProps {
  sak: Sak
  onSelected: () => void
  onCopy: () => void
}

const SakPanel = ({
  sak,
  onSelected,
  onCopy
}: SakPanelProps) => {
  const { t } = useTranslation()
  return (

    <LinkCard
      aria-label={sak.sakType + ' - ' + sak.sakTittel}
      onClick={onSelected}
      className={styles.sakPanel}
      arrow={false}
    >
      <LinkCard.Title>
        {sak.sakType + ' - ' + sak.sakTittel}
      </LinkCard.Title>
      <LinkCard.Description>
        <HStack gap="2">
          <BodyLong>
            {t('label:motpart')}:
          </BodyLong>
          <BodyLong>
            {sak?.motpart?.join(', ') ?? '-'}
          </BodyLong>
        </HStack>
        <HStack width="100%">
          <BodyLong>
            {t('label:sist-oppdatert') + ': ' + sak.sistEndretDato}
          </BodyLong>
          <Spacer/>
          <HStack align="center" gap="4">
            <span>
              {t('label:saksnummer') + ': '}
            </span>
            <Link
              target='_blank'
              href={sak.sakUrl}
              rel='noreferrer'
              onClick={(e) => e.stopPropagation()}
            >
              <HStack gap="4" align="center">
                <span>
                  {sak?.sakId}
                </span>
                <ExternalLinkIcon />
              </HStack>
            </Link>
            <Link
              title={t('label:kopiere')} onClick={(e: any) => {
                e.preventDefault()
                e.stopPropagation()
                onCopy()
              }}
            >
              <FilesIcon />
            </Link>
          </HStack>
        </HStack>
        {sak.sensitiv && (
          <Alert size="small" variant='warning'>
            <span>{t('label:sensitivSak')}</span>
          </Alert>
        )}
      </LinkCard.Description>
    </LinkCard>
  )
}

export default SakPanel
