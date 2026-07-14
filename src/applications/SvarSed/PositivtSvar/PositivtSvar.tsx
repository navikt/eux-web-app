import { BodyLong, Box, Heading, VStack } from '@navikt/ds-react'
import AdresserBosted from 'applications/SvarSed/AdresserBosted/AdresserBosted'
import AktivitetOgStatus from 'applications/SvarSed/AktivitetOgStatus/AktivitetOgStatus'
import Familiestatus from 'applications/SvarSed/Familiestatus/Familiestatus'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'

const PositivtSvar: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  setReplySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()

  const childProps: MainFormProps = {
    parentNamespace,
    personID,
    personName,
    replySed,
    setReplySed,
    updateReplySed
  }

  const positivt = { parentKey: 'positivtSvar', namespaceInfix: 'positivtsvar' }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <VStack gap="space-8">
          <Heading size='medium'>
            {t('label:positivt-svar')}
          </Heading>
          <BodyLong>
            {t('label:positivt-svar-beskrivelse')}
          </BodyLong>
        </VStack>

        <AdresserBosted {...childProps} label={t('label:adresser')} options={{ ...positivt, showVarighet: false }} />
        <AktivitetOgStatus {...childProps} label={t('label:personens-status-og-aktivitet')} options={{ ...positivt, inntektskildeStudenterMaxLength: 65 }} />
        <Familiestatus {...childProps} label={t('label:familiestatus')} options={{ ...positivt, grunnForFlyttingMaxLength: 255 }} />
      </VStack>
    </Box>
  )
}

export default PositivtSvar
