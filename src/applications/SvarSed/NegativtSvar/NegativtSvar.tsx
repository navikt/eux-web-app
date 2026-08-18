import { Box, BodyLong, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import { NegativtSvar as INegativtSvar, H006Sed } from 'declarations/h006'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateNegativtSvar, ValidationNegativtSvarProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const NegativtSvar: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-negativtsvar`
  const sed = replySed as H006Sed
  const negativtSvar: INegativtSvar | undefined = sed.negativtSvar

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationNegativtSvarProps>(
      clonedvalidation, namespace, validateNegativtSvar, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setField = (id: string, value: string) => {
    dispatch(updateReplySed(`negativtSvar.${id}`, value.trim() || undefined))
    if (validation[namespace + '-' + id]) {
      dispatch(resetValidation(namespace + '-' + id))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>
        <BodyLong>
          {t('label:negativt-svar-beskrivelse')}
        </BodyLong>
        <Input
          error={validation[namespace + '-opplysningerSomIkkeKanOversendes']?.feilmelding}
          namespace={namespace}
          id='opplysningerSomIkkeKanOversendes'
          label={t('label:kunne-ikke-videresende-informasjon')}
          onChanged={(value: string) => setField('opplysningerSomIkkeKanOversendes', value)}
          value={negativtSvar?.opplysningerSomIkkeKanOversendes}
        />
        <TextArea
          error={validation[namespace + '-grunn']?.feilmelding}
          namespace={namespace}
          id='grunn'
          label={t('label:negativt-svar-grunner')}
          maxLength={255}
          onChanged={(value: string) => setField('grunn', value)}
          value={negativtSvar?.grunn}
        />
      </VStack>
    </Box>
  )
}

export default NegativtSvar
