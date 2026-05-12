import { Box, Heading, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import { X002Sed } from 'declarations/x002'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateGjenaapning, ValidationGjenaapningProps } from './validation'
import commonStyles from 'assets/css/common.module.css'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Gjenaapning: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-gjenaapning`
  const sed = replySed as X002Sed

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationGjenaapningProps>(
      clonedValidation, namespace, validateGjenaapning, {
        replySed: sed,
        personName
      }
    )
    dispatch(setValidation(clonedValidation))
  })

  const setAarsakType = (aarsakType: string) => {
    dispatch(updateReplySed('gjenaapning.aarsakType', aarsakType.trim()))
    if (aarsakType !== 'annet') {
      dispatch(updateReplySed('gjenaapning.aarsakAnnet', ''))
    }
    if (validation[namespace + '-aarsakType']) {
      dispatch(resetValidation(namespace + '-aarsakType'))
    }
  }

  const setAarsakAnnet = (aarsakAnnet: string) => {
    dispatch(updateReplySed('gjenaapning.aarsakAnnet', aarsakAnnet.trim()))
    if (validation[namespace + '-aarsakAnnet']) {
      dispatch(resetValidation(namespace + '-aarsakAnnet'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <RadioGroup
          value={sed.gjenaapning?.aarsakType ?? ''}
          data-testid={namespace + '-aarsakType'}
          error={validation[namespace + '-aarsakType']?.feilmelding}
          id={namespace + '-aarsakType'}
          legend={t('label:gjenaapning-aarsak')}
          hideLegend
          onChange={setAarsakType}
        >
          <VStack gap="space-4">
            <Radio className={commonStyles.radioPanel} value='ny_informasjon_ble_tilgjengelig'>{t('el:option-gjenaapning-01')}</Radio>
            <Radio className={commonStyles.radioPanel} value='feilaktig_informasjon_levert'>{t('el:option-gjenaapning-02')}</Radio>
            <Radio className={commonStyles.radioPanel} value='saken_ble_utilsiktet_avsluttet'>{t('el:option-gjenaapning-03')}</Radio>
            <Radio className={commonStyles.radioPanel} value='annet'>{t('el:option-gjenaapning-99')}</Radio>
          </VStack>
        </RadioGroup>

        {sed.gjenaapning?.aarsakType === 'annet' && (
          <Textarea
            error={validation[namespace + '-aarsakAnnet']?.feilmelding}
            id={namespace + '-aarsakAnnet'}
            label={t('label:gjenaapning-aarsak-annet')}
            maxLength={255}
            resize
            value={sed.gjenaapning?.aarsakAnnet ?? ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAarsakAnnet(e.target.value)}
          />
        )}
      </VStack>
    </Box>
  )
}

export default Gjenaapning
