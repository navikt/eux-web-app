import {Box, Heading, Link, VStack} from '@navikt/ds-react'
import { Sak } from 'declarations/types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import commonStyles from 'assets/css/common.module.css'

interface RelaterteRinaSakerProps {
  sak: Sak
}

const RelaterteRinaSaker = ({ sak }: RelaterteRinaSakerProps) => {
  const { t } = useTranslation()

  const gotoSak = (sakId: string) => {
    window.location.href = '/svarsed/view/sak/' + sakId
  }

  return (
    <Box background="default" padding="space-16" borderWidth="1" borderColor="neutral" borderRadius="2">
      <VStack gap="space-16">
        <Heading size='small'>
          { sak.relaterteRinasakIder && sak.relaterteRinasakIder.length > 1 ? t('label:tilknyttede-saker') : t('label:tilknyttet-sak')}
        </Heading>
        <div className={commonStyles.horizontalLineSeparator} />
        <Box paddingInline="space-16">
          {sak.relaterteRinasakIder?.map((sakId) => {
            return (<><Link href='#' onClick={() => gotoSak(sakId)}>{sakId}</Link><br/></>)
          })}
        </Box>
      </VStack>
    </Box>
  );
}

export default RelaterteRinaSaker
