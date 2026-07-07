import { Box, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import DateField from 'components/DateField/DateField'
import { H070Sed } from 'declarations/h070'
import { State } from 'declarations/reducers'
import { Adresse as IAdresse } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateMeldingOmDoedsfall, ValidationMeldingOmDoedsfallProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const MeldingOmDoedsfall: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-meldingomdoedsfall`
  const sed = replySed as H070Sed
  const doedssted: IAdresse | undefined = sed.doedssted

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationMeldingOmDoedsfallProps>(
      clonedvalidation, namespace, validateMeldingOmDoedsfall, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setDoedsdato = (dato: string) => {
    dispatch(updateReplySed('doedsdato', dato))
    if (validation[namespace + '-doedsdato']) {
      dispatch(resetValidation(namespace + '-doedsdato'))
    }
  }

  const setDoedssted = (adresse: IAdresse, whatChanged: string | undefined) => {
    dispatch(updateReplySed('doedssted', adresse))
    if (whatChanged && validation[namespace + '-doedssted-' + whatChanged]) {
      dispatch(resetValidation(namespace + '-doedssted-' + whatChanged))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>
        <DateField
          error={validation[namespace + '-doedsdato']?.feilmelding}
          namespace={namespace}
          id='doedsdato'
          label={t('label:doedsdato')}
          required
          onChanged={setDoedsdato}
          dateValue={sed.doedsdato}
        />
        <Heading size='xsmall'>
          {t('label:doedssted')}
        </Heading>
        <AdresseForm
          type={false}
          options={{ bygning: true, region: true }}
          required={['by', 'land']}
          namespace={namespace + '-doedssted'}
          adresse={doedssted}
          onAdressChanged={setDoedssted}
          validation={validation}
        />
      </VStack>
    </Box>
  )
}

export default MeldingOmDoedsfall
