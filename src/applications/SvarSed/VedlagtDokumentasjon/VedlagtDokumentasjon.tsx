import { Box, Checkbox, Heading, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import { Options } from 'declarations/app'
import { ForhaandsdefinertDokumentType, H070Sed } from 'declarations/h070'
import { State } from 'declarations/reducers'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateVedlagtDokumentasjon, ValidationVedlagtDokumentasjonProps } from './validation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const VedlagtDokumentasjon: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-vedlagtdokumentasjon`
  const sed = replySed as H070Sed

  const dokumentTypeOptions: Options = [
    { label: t('el:option-forhaandsdefinertdokument-doedsattest'), value: 'dødsattest' },
    { label: t('el:option-forhaandsdefinertdokument-medisinsk-informasjon'), value: 'medisinsk_informasjon' },
    { label: t('el:option-forhaandsdefinertdokument-annet'), value: 'annet' }
  ]

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationVedlagtDokumentasjonProps>(
      clonedvalidation, namespace, validateVedlagtDokumentasjon, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const forhaandsdefinerteDokumenter = sed.doedsfall?.forhaandsdefinerteDokumenter ?? []

  const setForhaandsdefinertDokument = (value: ForhaandsdefinertDokumentType, checked: boolean) => {
    const updated = checked
      ? [...forhaandsdefinerteDokumenter, value]
      : forhaandsdefinerteDokumenter.filter(v => v !== value)
    dispatch(updateReplySed('doedsfall.forhaandsdefinerteDokumenter', updated.length > 0 ? updated : undefined))
    if (value === 'annet' && !checked) {
      dispatch(updateReplySed('doedsfall.annetDokument', undefined))
    }
  }

  const setAnnetDokument = (value: string) => {
    dispatch(updateReplySed('doedsfall.annetDokument', value.trim() ? value.trim() : undefined))
    if (validation[namespace + '-annetDokument']) {
      dispatch(resetValidation(namespace + '-annetDokument'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <Box
          tabIndex={0}
          id={namespace + '-forhaandsdefinerteDokumenter'}
        >
          {dokumentTypeOptions.map(f => (
            <Checkbox
              key={f.value}
              checked={forhaandsdefinerteDokumenter.indexOf(f.value as ForhaandsdefinertDokumentType) >= 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForhaandsdefinertDokument(f.value as ForhaandsdefinertDokumentType, e.target.checked)}
            >
              {f.label}
            </Checkbox>
          ))}
        </Box>

        {forhaandsdefinerteDokumenter.indexOf('annet') >= 0 && (
          <TextArea
            error={validation[namespace + '-annetDokument']?.feilmelding}
            namespace={namespace}
            id='annetDokument'
            label={t('label:annet-dokument')}
            maxLength={255}
            onChanged={setAnnetDokument}
            value={sed.doedsfall?.annetDokument ?? ''}
          />
        )}
      </VStack>
    </Box>
  )
}

export default VedlagtDokumentasjon
