import { Box, Checkbox, CheckboxGroup, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateKravetsArt, ValidationKravetsArtProps } from 'applications/SvarSed/KravetsArt/validation'
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

const KravetsArt: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-kravetsart`
  const sed = replySed as H120Sed

  const etterspurtHandlingOptions = [
    { label: t('el:option-h120-etterspurthandling-informer_oss_om_estimerte_kostnader_for_medisinsk_dokumentasjon_legeundersøkelse'), value: 'informer_oss_om_estimerte_kostnader_for_medisinsk_dokumentasjon_legeundersøkelse' },
    { label: t('el:option-h120-etterspurthandling-utfør_legeundersøkelse'), value: 'utfør_legeundersøkelse' },
    { label: t('el:option-h120-etterspurthandling-send_oss_den_medisinske_informasjonen_dokumentasjonen'), value: 'send_oss_den_medisinske_informasjonen_dokumentasjonen' }
  ]

  const etterspurtDokumentasjonOptions = [
    { label: t('el:option-h120-etterspurtdokumentasjon-standard_medisinsk_rapport'), value: 'standard_medisinsk_rapport' },
    { label: t('el:option-h120-etterspurtdokumentasjon-utførlig_medisinsk_rapport'), value: 'utførlig_medisinsk_rapport' },
    { label: t('el:option-h120-etterspurtdokumentasjon-medisinsk_rapport_angående_familieytelser'), value: 'medisinsk_rapport_angående_familieytelser' },
    { label: t('el:option-h120-etterspurtdokumentasjon-bilateralt_avtalt_medisinsk_rapport'), value: 'bilateralt_avtalt_medisinsk_rapport' },
    { label: t('el:option-h120-etterspurtdokumentasjon-annen_medisinsk_dokumentasjon'), value: 'annen_medisinsk_dokumentasjon' }
  ]

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationKravetsArtProps>(
      clonedvalidation, namespace, validateKravetsArt, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setEtterspurtHandling = (values: string[]) => {
    dispatch(updateReplySed('kravetsArt.etterspurtHandling', values.length > 0 ? values : undefined))
    if (validation[namespace + '-etterspurtHandling']) {
      dispatch(resetValidation(namespace + '-etterspurtHandling'))
    }
  }

  const setEtterspurtDokumentasjon = (values: string[]) => {
    dispatch(updateReplySed('kravetsArt.etterspurtDokumentasjon', values.length > 0 ? values : undefined))
    if (!values.includes('annen_medisinsk_dokumentasjon')) {
      dispatch(updateReplySed('kravetsArt.annenDokumentasjon', undefined))
    }
    if (validation[namespace + '-etterspurtDokumentasjon']) {
      dispatch(resetValidation(namespace + '-etterspurtDokumentasjon'))
    }
  }

  const setAnnenDokumentasjon = (value: string) => {
    dispatch(updateReplySed('kravetsArt.annenDokumentasjon', value.trim() || undefined))
    if (validation[namespace + '-annenDokumentasjon']) {
      dispatch(resetValidation(namespace + '-annenDokumentasjon'))
    }
  }

  const setSpesielleKrav = (value: string) => {
    dispatch(updateReplySed('kravetsArt.spesielleKravTilDokumentasjon', value.trim() || undefined))
  }

  const hasAnnenDokumentasjon = sed.kravetsArt?.etterspurtDokumentasjon?.includes('annen_medisinsk_dokumentasjon') ?? false

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <CheckboxGroup
          legend={t('label:vi-ber-dere-om-å')}
          error={validation[namespace + '-etterspurtHandling']?.feilmelding}
          value={sed.kravetsArt?.etterspurtHandling ?? []}
          onChange={setEtterspurtHandling}
        >
          {etterspurtHandlingOptions.map(opt => (
            <Checkbox key={opt.value} value={opt.value}>
              {opt.label}
            </Checkbox>
          ))}
        </CheckboxGroup>

        <CheckboxGroup
          legend={t('label:vennligst-send-oss-følgende-informasjon')}
          value={sed.kravetsArt?.etterspurtDokumentasjon ?? []}
          onChange={setEtterspurtDokumentasjon}
        >
          {etterspurtDokumentasjonOptions.map(opt => (
            <Checkbox key={opt.value} value={opt.value}>
              {opt.label}
            </Checkbox>
          ))}
        </CheckboxGroup>

        <TextArea
          error={validation[namespace + '-annenDokumentasjon']?.feilmelding}
          namespace={namespace}
          id='annenDokumentasjon'
          label={t('label:annen-medisinsk-dokumentasjon')}
          maxLength={500}
          onChanged={setAnnenDokumentasjon}
          value={sed.kravetsArt?.annenDokumentasjon}
          required={hasAnnenDokumentasjon}
        />

        <TextArea
          error={validation[namespace + '-spesielleKravTilDokumentasjon']?.feilmelding}
          namespace={namespace}
          id='spesielleKravTilDokumentasjon'
          label={t('label:beskrivelse-spesielle-krav')}
          maxLength={500}
          onChanged={setSpesielleKrav}
          value={sed.kravetsArt?.spesielleKravTilDokumentasjon}
        />
      </VStack>
    </Box>
  )
}

export default KravetsArt
