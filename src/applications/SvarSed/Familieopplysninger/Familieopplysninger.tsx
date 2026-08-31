import { Box, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import { BostedOpplysninger } from '../../../declarations/h'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateFamilieopplysninger, ValidationFamilieopplysningerProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Familieopplysninger: React.FC<MainFormProps> = ({
  label,
  options,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const { parentKey, namespaceInfix, antattFlyttegrunnMaxLength } = options
  const namespace = `${parentNamespace}-${personID}-${namespaceInfix}-familie`
  const bostedOpplysninger = _.get(replySed, parentKey) as BostedOpplysninger | undefined

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationFamilieopplysningerProps>(
      clonedvalidation, namespace, validateFamilieopplysninger, {
        bostedOpplysninger,
        antattFlyttegrunnMaxLength,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setField = (target: string, id: string, value: string) => {
    dispatch(updateReplySed(`${parentKey}.${target}`, value.trim() || undefined))
    if (validation[namespace + '-' + id]) {
      dispatch(resetValidation(namespace + '-' + id))
    }
  }

  return (
    <Box padding="space-16" borderWidth="1" borderColor="neutral-subtle" borderRadius="8">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <Input
          error={validation[namespace + '-ektefelleNavn']?.feilmelding}
          namespace={namespace}
          id='ektefelleNavn'
          label={t('label:familiemedlem-ektefelle')}
          onChanged={(value: string) => setField('ektefelle.navn', 'ektefelleNavn', value)}
          value={bostedOpplysninger?.ektefelle?.navn}
        />
        <TextArea
          error={validation[namespace + '-ektefelleBosted']?.feilmelding}
          namespace={namespace}
          id='ektefelleBosted'
          label={t('label:bosted-ektefelle')}
          maxLength={255}
          onChanged={(value: string) => setField('ektefelle.bosted', 'ektefelleBosted', value)}
          value={bostedOpplysninger?.ektefelle?.bosted}
        />

        <Input
          error={validation[namespace + '-barnNavn']?.feilmelding}
          namespace={namespace}
          id='barnNavn'
          label={t('label:familiemedlem-barn')}
          onChanged={(value: string) => setField('barn.navn', 'barnNavn', value)}
          value={bostedOpplysninger?.barn?.navn}
        />
        <TextArea
          error={validation[namespace + '-barnBosted']?.feilmelding}
          namespace={namespace}
          id='barnBosted'
          label={t('label:bosted-barn')}
          maxLength={255}
          onChanged={(value: string) => setField('barn.bosted', 'barnBosted', value)}
          value={bostedOpplysninger?.barn?.bosted}
        />
        <Input
          error={validation[namespace + '-barnSkolested']?.feilmelding}
          namespace={namespace}
          id='barnSkolested'
          label={t('label:skolekrets-barn')}
          onChanged={(value: string) => setField('barn.skolested', 'barnSkolested', value)}
          value={bostedOpplysninger?.barn?.skolested}
        />

        <TextArea
          error={validation[namespace + '-antattFlyttegrunn']?.feilmelding}
          namespace={namespace}
          id='antattFlyttegrunn'
          label={t('label:grunn-for-flytting')}
          maxLength={antattFlyttegrunnMaxLength}
          onChanged={(value: string) => setField('antattFlyttegrunn', 'antattFlyttegrunn', value)}
          value={bostedOpplysninger?.antattFlyttegrunn}
        />
      </VStack>
    </Box>
  )
}

export default Familieopplysninger
