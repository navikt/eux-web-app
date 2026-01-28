import {Box, Heading, Radio, RadioGroup, VStack} from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import { State } from 'declarations/reducers'
import { X011Sed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateAvvis, ValidationAvvisProps } from './validation'
import commonstyles from "assets/css/common.module.css"

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Avvis: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-avvis`

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAvvisProps>(
      clonedvalidation, namespace, validateAvvis, {
        replySed: (replySed as X011Sed),
        personName
      }
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setBegrunnelseType = (begrunnelseType: string) => {
    dispatch(updateReplySed('begrunnelseType', begrunnelseType.trim()))
    if (begrunnelseType !== '99') {
      dispatch(updateReplySed('begrunnelseAnnen', ''))
    }
    if (validation[namespace + '-begrunnelseType']) {
      dispatch(resetValidation(namespace + '-begrunnelseType'))
    }
  }

  const setBegrunnelseAnnen = (begrunnelseAnnen: string) => {
    dispatch(updateReplySed('begrunnelseAnnen', begrunnelseAnnen.trim()))
    if (validation[namespace + '-begrunnelseAnnen']) {
      dispatch(resetValidation(namespace + '-begrunnelseAnnen'))
    }
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>
        <span>ID: {(replySed as X011Sed)?.avvisSedId}</span>
          <RadioGroup
            value={(replySed as X011Sed).begrunnelseType}
            data-no-border
            data-testid={namespace + '-begrunnelseType'}
            error={validation[namespace + '-begrunnelseType']?.feilmelding}
            id={namespace + '-begrunnelseType'}
            legend={t('label:begrunnelse')}
            required
            name={namespace + '-begrunnelseType'}
            onChange={setBegrunnelseType}
          >
            <VStack gap="1" width="75%">
              <Radio className={commonstyles.radioPanel} value='personen_finnes_ikke_i_våre_registre'>{t('el:option-avvis-01')}</Radio>
              <Radio className={commonstyles.radioPanel} value='ikke_kompetent_institusjon_i_saken_og_ikke_i_stand_til_å_videresende'>{t('el:option-avvis-02')}</Radio>
              <Radio className={commonstyles.radioPanel} value='etterspurt_obligatorisk_informasjon_finnes_ikke'>{t('el:option-avvis-03')}</Radio>
              <Radio className={commonstyles.radioPanel} value='annet'>{t('el:option-avvis-99')}</Radio>
            </VStack>
          </RadioGroup>
        {(replySed as X011Sed).begrunnelseType === 'annet' && (
          <Input
            error={validation[namespace + '-begrunnelseAnnen']?.feilmelding}
            namespace={namespace}
            id='begrunnelseAnnen'
            label={t('label:begrunnelseAnnen')}
            hideLabel
            onChanged={setBegrunnelseAnnen}
            required
            value={(replySed as X011Sed).begrunnelseAnnen}
          />
        )}
      </VStack>
    </Box>
  )
}

export default Avvis
