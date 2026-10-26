import { Box, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import DateField from 'components/DateField/DateField'
import { State } from 'declarations/reducers'
import { U007Sed } from 'declarations/u007'
import { U009Sed } from 'declarations/u009'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateRegistrering, ValidationRegistreringProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Registrering: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-bruker-registrering`
  const sed = replySed as U007Sed | U009Sed

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationRegistreringProps>(
      clonedValidation, namespace, validateRegistrering, { replySed: sed }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setRegistreringsdato = (dato: string) => {
    dispatch(updateReplySed('registreringsdato', dato.trim() || undefined))
    if (validation[`${namespace}-registreringsdato`]) {
      dispatch(resetValidation(`${namespace}-registreringsdato`))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size="small">{label}</Heading>
        <DateField
          error={validation[`${namespace}-registreringsdato`]?.feilmelding}
          namespace={namespace}
          id="registreringsdato"
          label={t('label:u009-registreringsdato')}
          required
          onChanged={setRegistreringsdato}
          dateValue={sed.registreringsdato}
        />
      </VStack>
    </Box>
  )
}

export default Registrering
