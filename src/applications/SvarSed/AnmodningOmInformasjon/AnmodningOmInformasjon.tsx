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
import { validateAnmodningOmInformasjon, ValidationAnmodningOmInformasjonProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const AnmodningOmInformasjon: React.FC<MainFormProps> = ({
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
    performValidation<ValidationAnmodningOmInformasjonProps>(
      clonedvalidation, namespace, validateAnmodningOmInformasjon, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setAnmodningOmInformasjon = (newInfo: string) => {
    dispatch(updateReplySed('anmodningOmInformasjon', newInfo.trim() || undefined))
    if (validation[namespace + '-anmodningOmInformasjon']) {
      dispatch(resetValidation(namespace + '-anmodningOmInformasjon'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>
        <BodyLong>
          {t('label:anmodning-om-informasjon-bosted-beskrivelse')}
        </BodyLong>
        <TextArea
          error={validation[namespace + '-anmodningOmInformasjon']?.feilmelding}
          namespace={namespace}
          id='anmodningOmInformasjon'
          label={t('label:anmodning-om-informasjon')}
          maxLength={255}
          required
          onChanged={setAnmodningOmInformasjon}
          value={sed.anmodningOmInformasjon ?? ''}
        />
      </VStack>
    </Box>
  )
}

export default AnmodningOmInformasjon
