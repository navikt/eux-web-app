import { Box, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateGrunnerForOverfoering, ValidationGrunnerForOverfoeringProps } from 'applications/SvarSed/GrunnerForOverfoering/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { State } from 'declarations/reducers'
import { H065Sed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const GrunnerForOverfoering: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-grunnerforoverfoering`
  const sed = replySed as H065Sed

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationGrunnerForOverfoeringProps>(
      clonedvalidation, namespace, validateGrunnerForOverfoering, {
        replySed: (replySed as H065Sed),
        personName
      }
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setGrunnerForOverfoering = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.grunnerForOverfoering', value.trim() || undefined))
    if (validation[namespace + '-grunnerForOverfoering']) {
      dispatch(resetValidation(namespace + '-grunnerForOverfoering'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <TextArea
          error={validation[namespace + '-grunnerForOverfoering']?.feilmelding}
          namespace={namespace}
          id='grunnerForOverfoering'
          label={t('label:grunner-til-overfoering')}
          maxLength={255}
          onChanged={setGrunnerForOverfoering}
          value={sed.overfoeringInfo?.grunnerForOverfoering}
          hideLabel={true}
        />
      </VStack>
    </Box>
  )
}

export default GrunnerForOverfoering
