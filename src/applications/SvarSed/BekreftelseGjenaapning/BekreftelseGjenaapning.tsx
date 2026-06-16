import { BodyShort, Box, Heading, Label, RadioGroup, VStack } from '@navikt/ds-react'
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
    if (skalGjenaapnes === 'nei') {
      dispatch(updateReplySed('gjenaapning.grunnType', 'alle_deltakerne_kan_ikke_gjenåpne_saken'))
      if (validation[namespace + '-grunnType']) {
        dispatch(resetValidation(namespace + '-grunnType'))
      }
    } else {
      dispatch(updateReplySed('gjenaapning.grunnType', ''))
    }
    if (validation[namespace + '-skalGjenaapnes']) {
      dispatch(resetValidation(namespace + '-skalGjenaapnes'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
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
          <VStack gap="space-8">
            <RadioPanel value='ja'>{t('el:option-bekreftelsegjenaapning-ja')}</RadioPanel>
            <RadioPanel value='nei'>{t('el:option-bekreftelsegjenaapning-nei')}</RadioPanel>
          </VStack>
        </RadioGroup>

        {sed.gjenaapning?.skalGjenaapnes === 'nei' && (
          <Box>
            <Label as='p' size='small'>
              {t('label:bekreftelsegjenaapning-grunn')}
            </Label>
            <BodyShort>
              {t('el:option-bekreftelsegjenaapning-grunn-01')}
            </BodyShort>
          </Box>
        )}
      </VStack>
    </Box>
  )
}

export default BekreftelseGjenaapning
