import { BodyLong, Box, Heading, VStack } from '@navikt/ds-react'
import AdresserPositivtSvar from 'applications/SvarSed/AdresserPositivtSvar/AdresserPositivtSvar'
import AktivitetOgStatusPositivtSvar from 'applications/SvarSed/AktivitetOgStatusPositivtSvar/AktivitetOgStatusPositivtSvar'
import FamiliestatusPositivtSvar from 'applications/SvarSed/FamiliestatusPositivtSvar/FamiliestatusPositivtSvar'
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

        <AdresserPositivtSvar {...childProps} label={t('label:adresser')} />
        <AktivitetOgStatusPositivtSvar {...childProps} label={t('label:personens-status-og-aktivitet')} />
        <FamiliestatusPositivtSvar {...childProps} label={t('label:familiestatus')} />
      </VStack>
    </Box>
  )
}

export default PositivtSvar
