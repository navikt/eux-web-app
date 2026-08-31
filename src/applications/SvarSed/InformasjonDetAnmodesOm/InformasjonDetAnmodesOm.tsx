import { Box, BodyLong, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { H005Sed } from 'declarations/h005'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateInformasjonDetAnmodesOm, ValidationInformasjonDetAnmodesOmProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const InformasjonDetAnmodesOm: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-anmodningominformasjon`
  const sed = replySed as H005Sed

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationInformasjonDetAnmodesOmProps>(
      clonedvalidation, namespace, validateInformasjonDetAnmodesOm, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setInformasjonDetAnmodesOm = (newInfo: string) => {
    dispatch(updateReplySed('informasjonDetAnmodesOm', newInfo.trim() || undefined))
    if (validation[namespace + '-informasjonDetAnmodesOm']) {
      dispatch(resetValidation(namespace + '-informasjonDetAnmodesOm'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <VStack gap="space-4">
          <Heading size='small'>
            {label}
          </Heading>
          <BodyLong>
            {t('label:anmodning-om-informasjon-bosted-beskrivelse')}
          </BodyLong>
        </VStack>
        <TextArea
          error={validation[namespace + '-informasjonDetAnmodesOm']?.feilmelding}
          namespace={namespace}
          id='informasjonDetAnmodesOm'
          label={t('label:anmodning-om-informasjon')}
          maxLength={255}
          required
          onChanged={setInformasjonDetAnmodesOm}
          value={sed.informasjonDetAnmodesOm ?? ''}
        />
      </VStack>
    </Box>
  )
}

export default InformasjonDetAnmodesOm
