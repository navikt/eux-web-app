import { BodyLong, Box, Heading, VStack } from '@navikt/ds-react'
import Oppholdssteder from 'applications/SvarSed/Oppholdssteder/Oppholdssteder'
import Aktivitet from 'applications/SvarSed/Aktivitet/Aktivitet'
import Familieopplysninger from 'applications/SvarSed/Familieopplysninger/Familieopplysninger'
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

  const positivt = {
    parentKey: 'positivtSvar.bostedOpplysninger',
    namespaceInfix: 'positivtsvar',
    skattemessigGrunnKey: 'skattemessigGrunn'
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

        <Oppholdssteder {...childProps} label={t('label:adresser')} options={{ ...positivt, showVarighet: false }} />
        <Aktivitet {...childProps} label={t('label:personens-status-og-aktivitet')} options={{ ...positivt, inntektskildeHvisStudentMaxLength: 65 }} />
        <Familieopplysninger {...childProps} label={t('label:familiestatus')} options={{ ...positivt, antattFlyttegrunnMaxLength: 255 }} />
      </VStack>
    </Box>
  )
}

export default PositivtSvar
