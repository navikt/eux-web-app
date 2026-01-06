import {Box, Heading, Link, VStack} from '@navikt/ds-react'
import { Sak } from 'declarations/types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {HorizontalLineSeparator} from "../../../components/StyledComponents";

interface RelaterteRinaSakerProps {
  sak: Sak
}

const RelaterteRinaSaker = ({ sak }: RelaterteRinaSakerProps) => {
  const { t } = useTranslation()

  const gotoSak = (sakId: string) => {
    window.location.href = '/svarsed/view/sak/' + sakId
  }

  return (
      <Box background="bg-default" padding="4" borderWidth="1" borderColor="border-default" borderRadius="small">
        <VStack gap="4">
          <Heading size='small'>
            { sak.relaterteRinasakIder && sak.relaterteRinasakIder.length > 1 ? t('label:tilknyttede-saker') : t('label:tilknyttet-sak')}
          </Heading>
          <HorizontalLineSeparator />
          <Box paddingInline="4">
            {sak.relaterteRinasakIder?.map((sakId) => {
              return (<><Link href='#' onClick={() => gotoSak(sakId)}>{sakId}</Link><br/></>)
            })}
          </Box>
        </VStack>
      </Box>

  )
}

export default RelaterteRinaSaker
