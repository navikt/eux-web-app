import { Box, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import { validateAdresse, ValidationAdresseProps } from 'applications/SvarSed/Adresser/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import { Adresse } from 'declarations/sed'
import { U007Sed } from 'declarations/u007'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const SisteAdresseIKompetentLand: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-bruker-sisteadresseikompetentland`
  const adresse: Adresse | undefined = (replySed as U007Sed).sisteAdresseIKompetentLand

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationAdresseProps>(
      clonedValidation, namespace, validateAdresse, {
        adresse,
        checkAdresseType: false,
        personName
      }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setAdresse = (nyAdresse: Adresse, whatChanged: string | undefined) => {
    dispatch(updateReplySed('sisteAdresseIKompetentLand', nyAdresse))
    if (whatChanged && validation[`${namespace}-${whatChanged}`]) {
      dispatch(resetValidation(`${namespace}-${whatChanged}`))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size="small">{label}</Heading>
        <AdresseForm
          type={false}
          options={{ bygning: true, region: true }}
          required={['by', 'land']}
          countryCodeListName="euEftaLand"
          namespace={namespace}
          adresse={adresse}
          onAdressChanged={setAdresse}
          validation={validation}
        />
      </VStack>
    </Box>
  )
}

export default SisteAdresseIKompetentLand
