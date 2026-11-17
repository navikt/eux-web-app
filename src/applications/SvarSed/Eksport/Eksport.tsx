import { Box, Heading, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import DateField from 'components/DateField/DateField'
import { State } from 'declarations/reducers'
import { JaNei } from 'declarations/sed'
import { U008Sed } from 'declarations/u008'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateEksport, ValidationEksportProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Eksport: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-bruker-eksport`
  const sed = replySed as U008Sed

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationEksportProps>(
      clonedValidation, namespace, validateEksport, { replySed: sed }, true
    )
    dispatch(setValidation(clonedValidation))
  })

  const setVedtakOmEksport = (value: JaNei) => {
    dispatch(updateReplySed('vedtakOmEksport', value))
    // 3.2 is only filled in when there is a right to export
    if (value === 'nei') {
      dispatch(updateReplySed('eksportperiode', undefined))
      dispatch(updateReplySed('omstendigheter', undefined))
      dispatch(resetValidation([
        `${namespace}-maksSluttdato`,
        `${namespace}-estimertSluttdato`,
        `${parentNamespace}-bruker-omstendigheter`,
        'editor-andreOmstendigheter'
      ]))
    }
    if (validation[`${namespace}-vedtakOmEksport`]) {
      dispatch(resetValidation(`${namespace}-vedtakOmEksport`))
    }
  }

  const setDato = (felt: 'maksSluttdato' | 'estimertSluttdato', dato: string) => {
    dispatch(updateReplySed(`eksportperiode.${felt}`, dato.trim() || undefined))
    if (validation[`${namespace}-${felt}`]) {
      dispatch(resetValidation(`${namespace}-${felt}`))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size="small">{label}</Heading>
        <RadioGroup
          value={sed.vedtakOmEksport ?? ''}
          id={`${namespace}-vedtakOmEksport`}
          legend={t('label:u008-vedtak-om-eksport')}
          error={validation[`${namespace}-vedtakOmEksport`]?.feilmelding}
          onChange={(value: string) => setVedtakOmEksport(value as JaNei)}
        >
          <Radio value="ja">{t('label:ja')}</Radio>
          <Radio value="nei">{t('label:nei')}</Radio>
        </RadioGroup>
        {sed.vedtakOmEksport === 'ja' && (
          <>
            <Heading size="xsmall" level="3">{t('label:u008-eksportperiode')}</Heading>
            <DateField
              error={validation[`${namespace}-maksSluttdato`]?.feilmelding}
              namespace={namespace}
              id="maksSluttdato"
              label={t('label:u008-maks-sluttdato')}
              required
              onChanged={(dato: string) => setDato('maksSluttdato', dato)}
              dateValue={sed.eksportperiode?.maksSluttdato}
            />
            <DateField
              error={validation[`${namespace}-estimertSluttdato`]?.feilmelding}
              namespace={namespace}
              id="estimertSluttdato"
              label={t('label:u008-estimert-sluttdato')}
              onChanged={(dato: string) => setDato('estimertSluttdato', dato)}
              dateValue={sed.eksportperiode?.estimertSluttdato}
            />
          </>
        )}
      </VStack>
    </Box>
  )
}

export default Eksport
