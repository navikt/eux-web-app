import { Box, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import TextArea from 'components/Forms/TextArea'
import { BostedInformasjon } from '../../../declarations/h'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateFamiliestatus, ValidationFamiliestatusProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

// Shared H_BUC_02a familiestatus section, used by both H005 (target
// «informasjonFastslaaBosted») and H006 (target «positivtSvar»). The SED-specific
// target key, namespace infix and «grunn for flytting» max length are supplied via
// `options` by the FastslaaBosted / PositivtSvar containers.
const Familiestatus: React.FC<MainFormProps> = ({
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
  const { parentKey, namespaceInfix, grunnForFlyttingMaxLength } = options
  const namespace = `${parentNamespace}-${personID}-${namespaceInfix}-familie`
  const info = _.get(replySed, parentKey) as BostedInformasjon | undefined

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationFamiliestatusProps>(
      clonedvalidation, namespace, validateFamiliestatus, {
        info,
        grunnForFlyttingMaxLength,
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
          error={validation[namespace + '-ektefelleFamiliemedlem']?.feilmelding}
          namespace={namespace}
          id='ektefelleFamiliemedlem'
          label={t('label:familiemedlem-ektefelle')}
          onChanged={(value: string) => setField('familiestatus.ektefelle.familiemedlem', 'ektefelleFamiliemedlem', value)}
          value={info?.familiestatus?.ektefelle?.familiemedlem}
        />
        <TextArea
          error={validation[namespace + '-ektefelleBosted']?.feilmelding}
          namespace={namespace}
          id='ektefelleBosted'
          label={t('label:bosted-ektefelle')}
          maxLength={255}
          onChanged={(value: string) => setField('familiestatus.ektefelle.bosted', 'ektefelleBosted', value)}
          value={info?.familiestatus?.ektefelle?.bosted}
        />

        <Input
          error={validation[namespace + '-barnFamiliemedlem']?.feilmelding}
          namespace={namespace}
          id='barnFamiliemedlem'
          label={t('label:familiemedlem-barn')}
          onChanged={(value: string) => setField('familiestatus.barn.familiemedlem', 'barnFamiliemedlem', value)}
          value={info?.familiestatus?.barn?.familiemedlem}
        />
        <TextArea
          error={validation[namespace + '-barnBosted']?.feilmelding}
          namespace={namespace}
          id='barnBosted'
          label={t('label:bosted-barn')}
          maxLength={255}
          onChanged={(value: string) => setField('familiestatus.barn.bosted', 'barnBosted', value)}
          value={info?.familiestatus?.barn?.bosted}
        />
        <Input
          error={validation[namespace + '-barnSkolekrets']?.feilmelding}
          namespace={namespace}
          id='barnSkolekrets'
          label={t('label:skolekrets-barn')}
          onChanged={(value: string) => setField('familiestatus.barn.skolekrets', 'barnSkolekrets', value)}
          value={info?.familiestatus?.barn?.skolekrets}
        />

        <TextArea
          error={validation[namespace + '-grunnForFlytting']?.feilmelding}
          namespace={namespace}
          id='grunnForFlytting'
          label={t('label:grunn-for-flytting')}
          maxLength={grunnForFlyttingMaxLength}
          onChanged={(value: string) => setField('grunnForFlytting', 'grunnForFlytting', value)}
          value={info?.grunnForFlytting}
        />
      </VStack>
    </Box>
  )
}

export default Familiestatus
