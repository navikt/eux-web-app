import { Box, Checkbox, CheckboxGroup, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateFamilieytelseSpoersmaal, ValidationFamilieytelseSpoersmaalProps } from 'applications/SvarSed/FamilieytelseSpoersmaal/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { State } from 'declarations/reducers'
import { H120Sed } from 'declarations/h120'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const FamilieytelseSpoersmaal: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-familieytelsespoersmaal`
  const sed = replySed as H120Sed

  const familieEtterspurtDokumentasjonOptions = [
    { label: t('el:option-h120-familiedokumentasjon-grad_av_selvhjulpenhet'), value: 'grad_av_selvhjulpenhet' },
    { label: t('el:option-h120-familiedokumentasjon-grad_av_hjelpebehov'), value: 'grad_av_hjelpebehov' },
    { label: t('el:option-h120-familiedokumentasjon-årsak_til_uførhet'), value: 'årsak_til_uførhet' },
    { label: t('el:option-h120-familiedokumentasjon-uføretidspunkt_eller_endring_i_uføregrad'), value: 'uføretidspunkt_eller_endring_i_uføregrad' },
    { label: t('el:option-h120-familiedokumentasjon-fysiske_og_mentale_evner'), value: 'fysiske_og_mentale_evner' },
    { label: t('el:option-h120-familiedokumentasjon-grad_av_mentale_og_fysiske_evner'), value: 'grad_av_mentale_og_fysiske_evner' },
    { label: t('el:option-h120-familiedokumentasjon-dato_når_dette_beløpet_ble_nådd'), value: 'dato_når_dette_beløpet_ble_nådd' },
    { label: t('el:option-h120-familiedokumentasjon-er_dette_beløpet_permanent'), value: 'er_dette_beløpet_permanent' },
    { label: t('el:option-h120-familiedokumentasjon-trengs_ny_undersøkelse_hvis_ja_når'), value: 'trengs_ny_undersøkelse_hvis_ja_når' },
    { label: t('el:option-h120-familiedokumentasjon-prognose'), value: 'prognose' },
    { label: t('el:option-h120-familiedokumentasjon-grad_av_inntektsevne'), value: 'grad_av_inntektsevne' }
  ]

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationFamilieytelseSpoersmaalProps>(
      clonedvalidation, namespace, validateFamilieytelseSpoersmaal, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setEtterspurtDokumentasjon = (values: string[]) => {
    dispatch(updateReplySed('familie.etterspurtDokumentasjon', values.length > 0 ? values : undefined))
    if (validation[namespace + '-etterspurtDokumentasjon']) {
      dispatch(resetValidation(namespace + '-etterspurtDokumentasjon'))
    }
  }

  const setAnnenDokumentasjon = (value: string) => {
    dispatch(updateReplySed('familie.annenDokumentasjon', value.trim() || undefined))
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <CheckboxGroup
          legend={t('label:etterspurt-dokumentasjon-familieytelser')}
          error={validation[namespace + '-etterspurtDokumentasjon']?.feilmelding}
          value={sed.familie?.etterspurtDokumentasjon ?? []}
          onChange={setEtterspurtDokumentasjon}
        >
          {familieEtterspurtDokumentasjonOptions.map(opt => (
            <Checkbox key={opt.value} value={opt.value}>
              {opt.label}
            </Checkbox>
          ))}
        </CheckboxGroup>

        <TextArea
          error={validation[namespace + '-annenDokumentasjon']?.feilmelding}
          namespace={namespace}
          id='annenDokumentasjon'
          label={t('label:annen-dokumentasjon-familieytelser')}
          maxLength={500}
          onChanged={setAnnenDokumentasjon}
          value={sed.familie?.annenDokumentasjon}
        />
      </VStack>
    </Box>
  )
}

export default FamilieytelseSpoersmaal
