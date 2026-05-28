import { Box, Heading, RadioGroup, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import RadioPanel from 'components/RadioPanel/RadioPanel'
import { State } from 'declarations/reducers'
import { X004Sed } from 'declarations/x004'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateBekreftelseGjenaapning, ValidationBekreftelseGjenaapningProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const BekreftelseGjenaapning: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-bekreftelsegjenaapning`
  const sed = replySed as X004Sed

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationBekreftelseGjenaapningProps>(
      clonedValidation, namespace, validateBekreftelseGjenaapning, {
        replySed: sed,
        personName
      }
    )
    dispatch(setValidation(clonedValidation))
  })

  const setSkalGjenaapnes = (skalGjenaapnes: string) => {
    dispatch(updateReplySed('gjenaapning.skalGjenaapnes', skalGjenaapnes.trim()))
    if (skalGjenaapnes === 'ja') {
      dispatch(updateReplySed('gjenaapning.grunnType', ''))
    }
    if (validation[namespace + '-skalGjenaapnes']) {
      dispatch(resetValidation(namespace + '-skalGjenaapnes'))
    }
  }

  const setGrunnType = (grunnType: string) => {
    dispatch(updateReplySed('gjenaapning.grunnType', grunnType.trim()))
    if (validation[namespace + '-grunnType']) {
      dispatch(resetValidation(namespace + '-grunnType'))
    }
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='small'>
          {label}
        </Heading>

        <RadioGroup
          value={sed.gjenaapning?.skalGjenaapnes ?? ''}
          data-testid={namespace + '-skalGjenaapnes'}
          error={validation[namespace + '-skalGjenaapnes']?.feilmelding}
          id={namespace + '-skalGjenaapnes'}
          legend={t('label:bekreftelsegjenaapning-skal-gjenaapnes')}
          onChange={setSkalGjenaapnes}
        >
          <VStack gap="2">
            <RadioPanel value='ja'>{t('el:option-bekreftelsegjenaapning-ja')}</RadioPanel>
            <RadioPanel value='nei'>{t('el:option-bekreftelsegjenaapning-nei')}</RadioPanel>
          </VStack>
        </RadioGroup>

        {sed.gjenaapning?.skalGjenaapnes === 'nei' && (
          <RadioGroup
            value={sed.gjenaapning?.grunnType ?? ''}
            data-testid={namespace + '-grunnType'}
            error={validation[namespace + '-grunnType']?.feilmelding}
            id={namespace + '-grunnType'}
            legend={t('label:bekreftelsegjenaapning-grunn')}
            onChange={setGrunnType}
          >
            <VStack gap="2">
              <RadioPanel value='alle_deltakerne_kan_ikke_gjenåpne_saken'>{t('el:option-bekreftelsegjenaapning-grunn-01')}</RadioPanel>
            </VStack>
          </RadioGroup>
        )}
      </VStack>
    </Box>
  )
}

export default BekreftelseGjenaapning
