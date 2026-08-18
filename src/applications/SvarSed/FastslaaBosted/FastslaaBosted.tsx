import { BodyLong, Box, Heading, VStack } from '@navikt/ds-react'
import Oppholdssteder from 'applications/SvarSed/Oppholdssteder/Oppholdssteder'
import Aktivitet from 'applications/SvarSed/Aktivitet/Aktivitet'
import Familieopplysninger from 'applications/SvarSed/Familieopplysninger/Familieopplysninger'
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

  const bosted = {
    parentKey: 'anmodning.bostedOpplysninger',
    namespaceInfix: 'fastslaabosted',
    skattemessigGrunnKey: 'skattemessigeGrunn'
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <VStack gap="space-4">
          <Heading size='small'>
            {t('label:informasjon-fastslaa-bosted')}
          </Heading>
          <BodyLong>
            {t('label:informasjon-fastslaa-bosted-beskrivelse')}
          </BodyLong>
        </VStack>

        <Oppholdssteder {...childProps} label={t('label:adresser')} options={{ ...bosted, showVarighet: true }} />
        <Aktivitet {...childProps} label={t('label:personens-status-og-aktivitet')} options={{ ...bosted, inntektskildeHvisStudentMaxLength: 155 }} />
        <Familieopplysninger {...childProps} label={t('label:familiestatus')} options={{ ...bosted, antattFlyttegrunnMaxLength: 155 }} />
      </VStack>
    </Box>
  )
}

export default FastslaaBosted
