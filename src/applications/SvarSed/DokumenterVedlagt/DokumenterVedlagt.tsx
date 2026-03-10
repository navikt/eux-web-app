import { Box, Checkbox, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateDokumenterVedlagt, ValidationDokumenterVedlagtProps } from 'applications/SvarSed/DokumenterVedlagt/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import ErrorLabel from 'components/Forms/ErrorLabel'
import { Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { H065Sed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const DokumenterVedlagt: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-dokumentervedlagt`
  const sed = replySed as H065Sed

  const dokumenterVedlagtTypeOptions: Options = [
    { label: t('el:option-overfoeringinfo-dokument-soeknad'), value: 'søknad' },
    { label: t('el:option-overfoeringinfo-dokument-doedsattest'), value: 'dødsattest' },
    { label: t('el:option-overfoeringinfo-dokument-fakturaer'), value: 'fakturaer' },
    { label: t('el:option-overfoeringinfo-dokument-ligningsattest'), value: 'ligningsattest' },
    { label: t('el:option-overfoeringinfo-dokument-krav'), value: 'krav' },
    { label: t('el:option-overfoeringinfo-dokument-medisinsk_dokumentasjon'), value: 'medisinsk_dokumentasjon' },
    { label: t('el:option-overfoeringinfo-dokument-arbeidsattest'), value: 'arbeidsattest' },
    { label: t('el:option-overfoeringinfo-dokument-foedselsattest'), value: 'foedselsattest' },
    { label: t('el:option-overfoeringinfo-dokument-ekteskapsattest'), value: 'ekteskapsattest' },
    { label: t('el:option-overfoeringinfo-dokument-vitnemaal'), value: 'vitnemål' },
    { label: t('el:option-overfoeringinfo-dokument-medisinsk_rapport'), value: 'medisinsk_rapport' },
    { label: t('el:option-overfoeringinfo-dokument-legeattest'), value: 'legeattest' },
    { label: t('el:option-overfoeringinfo-dokument-annet'), value: 'annet' }
  ]

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationDokumenterVedlagtProps>(
      clonedvalidation, namespace, validateDokumenterVedlagt, {
        replySed: (replySed as H065Sed),
        personName
      }
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setDokumenterVedlagtType = (value: string, checked: boolean) => {
    const current = sed.overfoeringInfo?.dokumenterVedlagt?.type ?? []
    const updated = checked ? [...current, value] : current.filter(v => v !== value)
    dispatch(updateReplySed('overfoeringInfo.dokumenterVedlagt.type', updated.length > 0 ? updated : undefined))
    if (validation[namespace + '-dokumenterVedlagt-type']) {
      dispatch(resetValidation(namespace + '-dokumenterVedlagt-type'))
    }
  }

  const setDokumenterVedlagtAnnet = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.dokumenterVedlagt.annet', value.trim() ? [value.trim()] : undefined))
    if (validation[namespace + '-dokumenterVedlagt-annet']) {
      dispatch(resetValidation(namespace + '-dokumenterVedlagt-annet'))
    }
  }

  const dokumenterVedlagtTypes = sed.overfoeringInfo?.dokumenterVedlagt?.type ?? []

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <Box
          tabIndex={0}
          id={namespace + '-dokumenterVedlagt-type'}
        >
          {dokumenterVedlagtTypeOptions.map(f => (
            <Checkbox
              key={f.value}
              checked={dokumenterVedlagtTypes.indexOf(f.value) >= 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDokumenterVedlagtType(f.value, e.target.checked)}
            >
              {f.label}
            </Checkbox>
          ))}
        </Box>
        <ErrorLabel error={validation[namespace + '-dokumenterVedlagt-type']?.feilmelding} />

        {dokumenterVedlagtTypes.indexOf('annet') >= 0 && (
          <TextArea
            error={validation[namespace + '-dokumenterVedlagt-annet']?.feilmelding}
            namespace={namespace}
            id='dokumenterVedlagt-annet'
            label={t('label:annet-dokument')}
            maxLength={255}
            onChanged={setDokumenterVedlagtAnnet}
            value={sed.overfoeringInfo?.dokumenterVedlagt?.annet?.[0] ?? ''}
          />
        )}
      </VStack>
    </Box>
  )
}

export default DokumenterVedlagt
