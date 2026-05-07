import { Box, Heading, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import { State } from 'declarations/reducers'
import { X003Sed } from 'declarations/x003'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateSvarGjenaapning, ValidationSvarGjenaapningProps } from './validation'
import commonStyles from 'assets/css/common.module.css'

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
    <Box padding="4">
      <VStack gap="4">
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
          <VStack gap="2">
            <Radio className={commonStyles.radioPanel} value='ja'>{t('el:option-svargjenaapning-godkjent')}</Radio>
            <Radio className={commonStyles.radioPanel} value='nei'>{t('el:option-svargjenaapning-avvist')}</Radio>
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
          <VStack gap="2">
            <Radio className={commonStyles.radioPanel} value='ny_informasjon_ble_tilgjengelig'>{t('el:option-gjenaapning-01')}</Radio>
            <Radio className={commonStyles.radioPanel} value='feilaktig_informasjon_levert'>{t('el:option-gjenaapning-02')}</Radio>
            <Radio className={commonStyles.radioPanel} value='saken_ble_utilsiktet_avsluttet'>{t('el:option-gjenaapning-03')}</Radio>
            <Radio className={commonStyles.radioPanel} value='annet'>{t('el:option-gjenaapning-99')}</Radio>
          </VStack>
        </RadioGroup>

        {sed.svarGjenaapning?.grunnType === 'annet' && (
          <Input
            error={validation[namespace + '-grunnAnnet']?.feilmelding}
            namespace={namespace}
            id='grunnAnnet'
            label={t('label:svargjenaapning-grunn-annet')}
            onChanged={setGrunnAnnet}
            required
            value={sed.svarGjenaapning?.grunnAnnet}
          />
        )}
      </VStack>
    </Box>
  )
}

export default SvarGjenaapning
