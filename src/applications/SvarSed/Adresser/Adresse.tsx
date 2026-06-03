import { Box, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import { Adresse as IAdresse } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react';
import { useTranslation } from 'react-i18next'
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateAdresse, ValidationAdresseProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Adresse: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  formValue
}: MainFormProps): JSX.Element => {
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const target = `${personID}.adresse`
  const adresse: IAdresse | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-${formValue ?? 'adresse'}`

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAdresseProps>(
      clonedvalidation, namespace, validateAdresse, {
        adresse,
        checkAdresseType: false,
        optional: true,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setAdresse = (adresse: IAdresse, whatChanged: string | undefined) => {
    dispatch(updateReplySed(target, adresse))
    if (whatChanged && validation[namespace + '-' + whatChanged]) {
      dispatch(resetValidation(namespace + '-' + whatChanged))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>
        <AdresseForm
          type={false}
          options={{ bygning: true, region: true }}
          required={['by', 'land']}
          namespace={namespace}
          adresse={adresse}
          onAdressChanged={setAdresse}
          validation={validation}
        />
      </VStack>
    </Box>
  )
}

export default Adresse
