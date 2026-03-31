import {Box, Heading, HStack, Loader, Spacer, VStack} from '@navikt/ds-react'
import {Sak} from 'declarations/types'
import React from 'react'
import { useTranslation } from 'react-i18next'

import commonStyles from 'assets/css/common.module.css'
import {useAppSelector} from "store"
import {State} from "declarations/reducers"

interface SedUnderJournalfoeringEllerUkjentStatusProps {
  sak: Sak
}

interface SedUnderJournalfoeringEllerUkjentStatusSelector {
  refreshingSaks: boolean
}

const mapState = (state: State): SedUnderJournalfoeringEllerUkjentStatusSelector => ({
  refreshingSaks: state.loading.refreshingSaks
})

const SedUnderJournalfoeringEllerUkjentStatus = ({ sak }: SedUnderJournalfoeringEllerUkjentStatusProps) => {
  const { t } = useTranslation()
  const { refreshingSaks } = useAppSelector(mapState)

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
        {refreshingSaks &&
          <HStack>
            <Spacer/>
            {t('label:sjekker-status')} &nbsp; <Loader/>
            <Spacer/>
          </HStack>
        }
      </VStack>
    </Box>
  );
}

export default SedUnderJournalfoeringEllerUkjentStatus
