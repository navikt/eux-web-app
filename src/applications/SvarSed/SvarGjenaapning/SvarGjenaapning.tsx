import { Box, Heading, RadioGroup, Textarea, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import RadioPanel from 'components/RadioPanel/RadioPanel'
import { State } from 'declarations/reducers'
import { X003Sed } from 'declarations/x003'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, {JSX} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateSvarGjenaapning, ValidationSvarGjenaapningProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const SvarGjenaapning: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-svargjenaapning`
  const sed = replySed as X003Sed

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationSvarGjenaapningProps>(
      clonedValidation, namespace, validateSvarGjenaapning, {
        replySed: sed,
        personName
      }
    )
    dispatch(setValidation(clonedValidation))
  })

  const setErGodkjent = (erGodkjent: string) => {
    dispatch(updateReplySed('svarGjenaapning.erGodkjent', erGodkjent.trim()))
    if (validation[namespace + '-erGodkjent']) {
      dispatch(resetValidation(namespace + '-erGodkjent'))
    }
  }

  const setGrunnType = (grunnType: string) => {
    dispatch(updateReplySed('svarGjenaapning.grunnType', grunnType.trim()))
    if (grunnType !== 'annet') {
      dispatch(updateReplySed('svarGjenaapning.grunnAnnet', ''))
    }
    if (validation[namespace + '-grunnType']) {
      dispatch(resetValidation(namespace + '-grunnType'))
    }
  }

  const setGrunnAnnet = (grunnAnnet: string) => {
    dispatch(updateReplySed('svarGjenaapning.grunnAnnet', grunnAnnet.trim()))
    if (validation[namespace + '-grunnAnnet']) {
      dispatch(resetValidation(namespace + '-grunnAnnet'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <RadioGroup
          value={sed.svarGjenaapning?.erGodkjent ?? ''}
          data-testid={namespace + '-erGodkjent'}
          error={validation[namespace + '-erGodkjent']?.feilmelding}
          id={namespace + '-erGodkjent'}
          legend={t('label:svargjenaapning-er-godkjent')}
          onChange={setErGodkjent}
        >
          <VStack gap="space-8">
            <RadioPanel value='ja'>{t('el:option-svargjenaapning-godkjent')}</RadioPanel>
            <RadioPanel value='nei'>{t('el:option-svargjenaapning-avvist')}</RadioPanel>
          </VStack>
        </RadioGroup>

        <RadioGroup
          value={sed.svarGjenaapning?.grunnType ?? ''}
          data-testid={namespace + '-grunnType'}
          error={validation[namespace + '-grunnType']?.feilmelding}
          id={namespace + '-grunnType'}
          legend={t('label:svargjenaapning-grunn')}
          onChange={setGrunnType}
        >
          <VStack gap="space-8">
            <RadioPanel value='statsborgeren_er_død'>{t('el:option-svargjenaapning-grunn-01')}</RadioPanel>
            <RadioPanel value='saken_ble_arkivert'>{t('el:option-svargjenaapning-grunn-02')}</RadioPanel>
            <RadioPanel value='annet'>{t('el:option-svargjenaapning-grunn-99')}</RadioPanel>
          </VStack>
        </RadioGroup>

        {sed.svarGjenaapning?.grunnType === 'annet' && (
          <Textarea
            error={validation[namespace + '-grunnAnnet']?.feilmelding}
            id={namespace + '-grunnAnnet'}
            label={t('label:svargjenaapning-grunn-annet')}
            maxLength={255}
            resize
            value={sed.svarGjenaapning?.grunnAnnet ?? ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGrunnAnnet(e.target.value)}
          />
        )}
      </VStack>
    </Box>
  )
}

export default SvarGjenaapning
