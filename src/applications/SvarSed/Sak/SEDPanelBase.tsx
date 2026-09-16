import {DownloadIcon, PencilIcon, PaperplaneIcon, QuestionmarkDiamondIcon, StarIcon, XMarkIcon} from '@navikt/aksel-icons'
import {BodyLong, Box, Detail, Heading, HelpText, HStack, Tag, VStack} from '@navikt/ds-react'
import {Fagsak, Sed} from 'declarations/types'
import classNames from 'classnames'
import _ from 'lodash'
import React, {ReactNode} from 'react'
import {useTranslation} from 'react-i18next'
import styles from './SEDPanel.module.css'

interface SEDPanelBaseProps {
  children: ReactNode
  currentFagsak?: Fagsak | null
  sed: Sed
  selected?: boolean
}

const SEDPanelBase = ({children, currentFagsak, sed, selected = false}: SEDPanelBaseProps) => {
  const {t} = useTranslation()
  const normalizedCurrentFagsak = _.cloneDeep(currentFagsak)
  delete normalizedCurrentFagsak?._id
  const hasDeviatedFagsak = !!sed.fagsak && (
    sed.fagsak.fnr !== normalizedCurrentFagsak?.fnr ||
    sed.fagsak.tema !== normalizedCurrentFagsak?.tema ||
    sed.fagsak.nr !== normalizedCurrentFagsak?.nr
  )

  return (
    <Box
      borderWidth="1"
      borderRadius="2"
      borderColor={selected ? 'success' : 'neutral'}
      padding="space-16"
      background="default"
      className={classNames(styles.sedBox, {
        [styles.deviation]: hasDeviatedFagsak
      })}
    >
      <HStack gap="space-16" wrap={false}>
        <VStack className={styles.iconDiv} align="center">
          {sed.status === 'received' && <DownloadIcon color='var(--ax-bg-accent-strong)' width='32' height='32' />}
          {sed.status === 'sent' && <PaperplaneIcon color='var(--ax-bg-success-strong)' width='32' height='32' />}
          {sed.status === 'new' && <StarIcon color='var(--ax-bg-warning-strong)' width='32' height='32' />}
          {sed.status === 'active' && <PencilIcon width='32' height='32' />}
          {sed.status === 'cancelled' && <XMarkIcon color='var(--ax-bg-danger-strong)' width='32' height='32' />}
          {!sed.status && <QuestionmarkDiamondIcon color='var(--ax-bg-neutral-strong)' width='32' height='32' />}
          <div className={styles.iconSpacer}/>
          <Detail>{t('app:status-received-' + (sed.status?.toLowerCase() ?? 'unknown'))}</Detail>
          <Detail>{sed.sistEndretDato}</Detail>
        </VStack>
        <VStack gap="space-8">
          {hasDeviatedFagsak && sed.fagsak && (
            <HStack gap="space-4">
              {sed.fagsak.fnr !== normalizedCurrentFagsak?.fnr && <Tag data-color="warning" size="xsmall" variant="moderate">{sed.fagsak.fnr}</Tag>}
              {sed.fagsak.tema !== normalizedCurrentFagsak?.tema && <Tag data-color="warning" size="xsmall" variant="moderate">{t('tema:' + sed.fagsak.tema)}</Tag>}
              {sed.fagsak.nr && sed.fagsak.nr !== normalizedCurrentFagsak?.nr && <Tag data-color="warning" size="xsmall" variant="moderate">{sed.fagsak.nr}</Tag>}
              {!sed.fagsak.nr && sed.fagsak.type && sed.fagsak.type !== normalizedCurrentFagsak?.type && <Tag data-color="warning" size="xsmall" variant="moderate">{t('journalfoering:' + sed.fagsak.type)}</Tag>}
              <HelpText className={styles.deviationHelpText} title={t('journalfoering:avvikende-journalfoering')}>
                <VStack gap="space-8">
                  <Heading size="xsmall">{t('journalfoering:avvikende-journalfoering')}</Heading>
                  <HStack gap="space-16">
                    <BodyLong size="small">
                      <div>{t('label:person')}:</div>
                      <div>{t('label:tema')}:</div>
                      <div>{t('label:fagsak')}:</div>
                    </BodyLong>
                    <BodyLong size="small">
                      <div>{sed.fagsak.fnr ?? ''}</div>
                      <div>{sed.fagsak.tema ? t('tema:' + sed.fagsak.tema) : ''}</div>
                      <div>{sed.fagsak.nr ?? (sed.fagsak.type ? t('journalfoering:' + sed.fagsak.type) : '')}</div>
                    </BodyLong>
                  </HStack>
                </VStack>
              </HelpText>
            </HStack>
          )}
          {children}
        </VStack>
      </HStack>
    </Box>
  )
}

export default SEDPanelBase
