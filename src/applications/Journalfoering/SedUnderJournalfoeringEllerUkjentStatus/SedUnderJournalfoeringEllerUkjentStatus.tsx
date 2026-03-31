import {Box, Heading, HStack, Tag, VStack} from '@navikt/ds-react'
import {Sak} from 'declarations/types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { JournalfoeringStatus } from 'hooks/useSakEvents'

import commonStyles from 'assets/css/common.module.css'

interface SedUnderJournalfoeringEllerUkjentStatusProps {
  sak: Sak
  journalfoeringStatus?: JournalfoeringStatus
}

const getStatusTagVariant = (status: JournalfoeringStatus): 'info' | 'success' | 'warning' | 'neutral' => {
  switch (status) {
    case 'JOURNALFOERT':
    case 'FERDIGSTILT':
      return 'success'
    case 'MANUELL_JOURNALFOERING':
      return 'warning'
    case 'UNDER_JOURNALFOERING':
      return 'info'
    default:
      return 'neutral'
  }
}

const SedUnderJournalfoeringEllerUkjentStatus = ({ sak, journalfoeringStatus }: SedUnderJournalfoeringEllerUkjentStatusProps) => {
  const { t } = useTranslation()

  return (
    <Box background="default" padding="space-16" borderWidth="1" borderColor="neutral" borderRadius="2">
      <VStack gap="space-16">
        <Heading size='small'>
          {t('label:under-journalfoering-ukjent-status')}
        </Heading>
        <div className={commonStyles.horizontalLineSeparator} />
        {sak.sedUnderJournalfoeringEllerUkjentStatus && sak.sedUnderJournalfoeringEllerUkjentStatus.length > 0 &&
          <ul>
            {sak.sedUnderJournalfoeringEllerUkjentStatus.map((sedTitle, index) => {
              return (<li key={index}>{sedTitle}</li>)
            })}
          </ul>
        }
        {journalfoeringStatus &&
          <HStack justify="end">
            <Tag variant={getStatusTagVariant(journalfoeringStatus)} size="small">
              {t(`label:journalfoering-status-${journalfoeringStatus}`)}
            </Tag>
          </HStack>
        }
      </VStack>
    </Box>
  );
}

export default SedUnderJournalfoeringEllerUkjentStatus
