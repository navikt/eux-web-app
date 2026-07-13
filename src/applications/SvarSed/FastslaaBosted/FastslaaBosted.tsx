import { BodyLong, Box, Heading, VStack } from '@navikt/ds-react'
import AdresserBosted from 'applications/SvarSed/AdresserBosted/AdresserBosted'
import AktivitetOgStatus from 'applications/SvarSed/AktivitetOgStatus/AktivitetOgStatus'
import BostedOgFamilie from 'applications/SvarSed/BostedOgFamilie/BostedOgFamilie'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'

const FastslaaBosted: React.FC<MainFormProps> = ({
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
            {t('label:informasjon-fastslaa-bosted')}
          </Heading>
          <BodyLong>
            {t('label:informasjon-fastslaa-bosted-beskrivelse')}
          </BodyLong>
        </VStack>

        <AdresserBosted {...childProps} label={t('label:adresser')} />
        <AktivitetOgStatus {...childProps} label={t('label:personens-status-og-aktivitet')} />
        <BostedOgFamilie {...childProps} label={t('label:bosituasjon-og-familiestatus')} />
      </VStack>
    </Box>
  )
}

export default FastslaaBosted
