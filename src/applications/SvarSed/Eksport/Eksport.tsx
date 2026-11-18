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

  const setErInnvilgetEksport = (value: JaNei) => {
    dispatch(updateReplySed('erInnvilgetEksport', value))
    // 3.2 is only filled in when there is a right to export
    if (value === 'nei') {
      dispatch(updateReplySed('eksportperiode', undefined))
      dispatch(updateReplySed('hendelser', undefined))
      dispatch(resetValidation([
        `${namespace}-sisteMuligeSluttdato`,
        `${namespace}-estimertSluttdato`,
        `${parentNamespace}-bruker-hendelser`,
        'editor-andreHendelser'
      ]))
    }
    if (validation[`${namespace}-erInnvilgetEksport`]) {
      dispatch(resetValidation(`${namespace}-erInnvilgetEksport`))
    }
  }

  const setDato = (felt: 'sisteMuligeSluttdato' | 'estimertSluttdato', dato: string) => {
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
          value={sed.erInnvilgetEksport ?? ''}
          id={`${namespace}-erInnvilgetEksport`}
          legend={t('label:u008-er-innvilget-eksport')}
          error={validation[`${namespace}-erInnvilgetEksport`]?.feilmelding}
          onChange={(value: string) => setErInnvilgetEksport(value as JaNei)}
        >
          <Radio value="ja">{t('label:ja')}</Radio>
          <Radio value="nei">{t('label:nei')}</Radio>
        </RadioGroup>
        {sed.erInnvilgetEksport === 'ja' && (
          <>
            <Heading size="xsmall" level="3">{t('label:u008-eksportperiode')}</Heading>
            <DateField
              error={validation[`${namespace}-sisteMuligeSluttdato`]?.feilmelding}
              namespace={namespace}
              id="sisteMuligeSluttdato"
              label={t('label:u008-siste-mulige-sluttdato')}
              required
              onChanged={(dato: string) => setDato('sisteMuligeSluttdato', dato)}
              dateValue={sed.eksportperiode?.sisteMuligeSluttdato}
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
