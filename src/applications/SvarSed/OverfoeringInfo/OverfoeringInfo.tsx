import { Box, Checkbox, Heading, HStack, Radio, RadioGroup, Spacer, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateOverfoeringInfo, ValidationOverfoeringInfoProps } from 'applications/SvarSed/OverfoeringInfo/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import DateField from 'components/DateField/DateField'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import ErrorLabel from 'components/Forms/ErrorLabel'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { H065DokumenterVedlagtType, H065Sed } from 'declarations/h065'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import commonStyles from 'assets/css/common.module.css'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const OverfoeringInfo: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-overfoeringinfo`
  const sed = replySed as H065Sed

  const tilTypeOptions: Options = [
    { label: t('el:option-overfoeringinfo-til-kompetent_institusjon'), value: 'kompetent_institusjon' },
    { label: t('el:option-overfoeringinfo-til-bostedsinstitusjon'), value: 'bostedsinstitusjon' },
    { label: t('el:option-overfoeringinfo-til-kontaktinstitusjon'), value: 'kontaktinstitusjon' }
  ]

  const informasjonAngaarYtelseTypeOptions: Options = [
    { label: t('el:option-overfoeringinfo-ytelse-lovvalg'), value: 'lovvalg' },
    { label: t('el:option-overfoeringinfo-ytelse-sykdom'), value: 'sykdom' },
    { label: t('el:option-overfoeringinfo-ytelse-familieytelser'), value: 'familieytelser' },
    { label: t('el:option-overfoeringinfo-ytelse-pensjon'), value: 'pensjon' },
    { label: t('el:option-overfoeringinfo-ytelse-dagpenger'), value: 'dagpenger' },
    { label: t('el:option-overfoeringinfo-ytelse-yrkesskade'), value: 'yrkesskade' },
    { label: t('el:option-overfoeringinfo-ytelse-andre'), value: 'andre' }
  ]

  const annenKorrespondanseTypeOptions: Options = [
    { label: t('el:option-overfoeringinfo-korrespondanse-motregning_av_innskudd'), value: 'motregning_av_innskudd' },
    { label: t('el:option-overfoeringinfo-korrespondanse-andre'), value: 'andre' }
  ]

  const dokumenterVedlagtTypeOptions: Options = [
    { label: t('el:option-overfoeringinfo-dokument-soeknad'), value: 'søknad' },
    { label: t('el:option-overfoeringinfo-dokument-vedtak'), value: 'vedtak' },
    { label: t('el:option-overfoeringinfo-dokument-medisinsk_rapport'), value: 'medisinsk_rapport' },
    { label: t('el:option-overfoeringinfo-dokument-annet'), value: 'annet' }
  ]

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationOverfoeringInfoProps>(
      clonedvalidation, namespace, validateOverfoeringInfo, {
        replySed: (replySed as H065Sed),
        personName
      }
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setErBrukerSoekeren = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.erBrukerSoekeren', value))
    if (validation[namespace + '-erBrukerSoekeren']) {
      dispatch(resetValidation(namespace + '-erBrukerSoekeren'))
    }
  }

  const setMottaksdato = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.mottaksdato', value.trim()))
    if (validation[namespace + '-mottaksdato']) {
      dispatch(resetValidation(namespace + '-mottaksdato'))
    }
  }

  const setGrunnerForOverfoering = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.grunnerForOverfoering', value.trim() || undefined))
    if (validation[namespace + '-grunnerForOverfoering']) {
      dispatch(resetValidation(namespace + '-grunnerForOverfoering'))
    }
  }

  const setTilType = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.til.type', value.trim()))
    if (validation[namespace + '-til-type']) {
      dispatch(resetValidation(namespace + '-til-type'))
    }
  }

  const setTilInstitusjonId = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.til.institusjon.id', value.trim()))
    if (validation[namespace + '-til-institusjon-id']) {
      dispatch(resetValidation(namespace + '-til-institusjon-id'))
    }
  }

  const setTilInstitusjonNavn = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.til.institusjon.navn', value.trim()))
    if (validation[namespace + '-til-institusjon-navn']) {
      dispatch(resetValidation(namespace + '-til-institusjon-navn'))
    }
  }

  const setInformasjonAngaarYtelseType = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.informasjonAngaarYtelse.type', value.trim()))
    if (value !== 'andre') {
      dispatch(updateReplySed('overfoeringInfo.informasjonAngaarYtelse.andre', undefined))
    }
    if (validation[namespace + '-informasjonAngaarYtelse-type']) {
      dispatch(resetValidation(namespace + '-informasjonAngaarYtelse-type'))
    }
  }

  const setInformasjonAngaarYtelseAndre = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.informasjonAngaarYtelse.andre', value.trim() || undefined))
    if (validation[namespace + '-informasjonAngaarYtelse-andre']) {
      dispatch(resetValidation(namespace + '-informasjonAngaarYtelse-andre'))
    }
  }

  const setAnnenKorrespondanseType = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.annenKorrespondanse.type', value.trim()))
    if (value !== 'andre') {
      dispatch(updateReplySed('overfoeringInfo.annenKorrespondanse.andre', undefined))
    }
    if (validation[namespace + '-annenKorrespondanse-type']) {
      dispatch(resetValidation(namespace + '-annenKorrespondanse-type'))
    }
  }

  const setAnnenKorrespondanseAndre = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.annenKorrespondanse.andre', value.trim() || undefined))
    if (validation[namespace + '-annenKorrespondanse-andre']) {
      dispatch(resetValidation(namespace + '-annenKorrespondanse-andre'))
    }
  }

  const setDokumenterVedlagtType = (value: H065DokumenterVedlagtType, checked: boolean) => {
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

        <RadioGroup
          value={sed.overfoeringInfo?.erBrukerSoekeren ?? ''}
          data-no-border
          data-testid={namespace + '-erBrukerSoekeren'}
          error={validation[namespace + '-erBrukerSoekeren']?.feilmelding}
          id={namespace + '-erBrukerSoekeren'}
          legend={t('label:er-bruker-soekeren')}
          name={namespace + '-erBrukerSoekeren'}
          onChange={setErBrukerSoekeren}
        >
          <HStack gap="space-16">
            <Radio className={commonStyles.radioPanel} value='ja'>
              {t('label:ja')}
            </Radio>
            <Radio className={commonStyles.radioPanel} value='nei'>
              {t('label:nei')}
            </Radio>
            <Spacer />
            <Spacer />
          </HStack>
        </RadioGroup>

        <HStack>
          <DateField
            error={validation[namespace + '-mottaksdato']?.feilmelding}
            id='mottaksdato'
            namespace={namespace}
            label={t('label:mottaksdato')}
            onChanged={setMottaksdato}
            dateValue={sed.overfoeringInfo?.mottaksdato}
          />
        </HStack>

        <TextArea
          error={validation[namespace + '-grunnerForOverfoering']?.feilmelding}
          namespace={namespace}
          id='grunnerForOverfoering'
          label={t('label:grunner-for-overfoering')}
          onChanged={setGrunnerForOverfoering}
          value={sed.overfoeringInfo?.grunnerForOverfoering}
        />

        <Heading size='xsmall'>
          {t('label:til')}
        </Heading>

        <Select
          data-testid={namespace + '-til-type'}
          error={validation[namespace + '-til-type']?.feilmelding}
          id={namespace + '-til-type'}
          label={t('label:til-type')}
          menuPortalTarget={document.body}
          onChange={(o: unknown) => setTilType((o as Option).value)}
          options={tilTypeOptions}
          value={_.find(tilTypeOptions, o => o.value === sed.overfoeringInfo?.til?.type)}
          defaultValue={_.find(tilTypeOptions, o => o.value === sed.overfoeringInfo?.til?.type)}
        />

        <HStack gap="space-16">
          <Input
            error={validation[namespace + '-til-institusjon-id']?.feilmelding}
            namespace={namespace}
            id='til-institusjon-id'
            label={t('label:institusjon-id')}
            onChanged={setTilInstitusjonId}
            value={sed.overfoeringInfo?.til?.institusjon?.id}
          />
          <Input
            error={validation[namespace + '-til-institusjon-navn']?.feilmelding}
            namespace={namespace}
            id='til-institusjon-navn'
            label={t('label:institusjon-navn')}
            onChanged={setTilInstitusjonNavn}
            value={sed.overfoeringInfo?.til?.institusjon?.navn}
          />
        </HStack>

        <Heading size='xsmall'>
          {t('label:informasjon-angaar-ytelse')}
        </Heading>

        <Select
          data-testid={namespace + '-informasjonAngaarYtelse-type'}
          error={validation[namespace + '-informasjonAngaarYtelse-type']?.feilmelding}
          id={namespace + '-informasjonAngaarYtelse-type'}
          label={t('label:informasjon-angaar-ytelse-type')}
          menuPortalTarget={document.body}
          onChange={(o: unknown) => setInformasjonAngaarYtelseType((o as Option).value)}
          options={informasjonAngaarYtelseTypeOptions}
          value={_.find(informasjonAngaarYtelseTypeOptions, o => o.value === sed.overfoeringInfo?.informasjonAngaarYtelse?.type)}
          defaultValue={_.find(informasjonAngaarYtelseTypeOptions, o => o.value === sed.overfoeringInfo?.informasjonAngaarYtelse?.type)}
        />

        {sed.overfoeringInfo?.informasjonAngaarYtelse?.type === 'andre' && (
          <TextArea
            error={validation[namespace + '-informasjonAngaarYtelse-andre']?.feilmelding}
            namespace={namespace}
            id='informasjonAngaarYtelse-andre'
            label={t('label:informasjon-angaar-ytelse-andre')}
            onChanged={setInformasjonAngaarYtelseAndre}
            value={sed.overfoeringInfo?.informasjonAngaarYtelse?.andre}
          />
        )}

        <Heading size='xsmall'>
          {t('label:annen-korrespondanse')}
        </Heading>

        <Select
          data-testid={namespace + '-annenKorrespondanse-type'}
          error={validation[namespace + '-annenKorrespondanse-type']?.feilmelding}
          id={namespace + '-annenKorrespondanse-type'}
          label={t('label:annen-korrespondanse-type')}
          menuPortalTarget={document.body}
          onChange={(o: unknown) => setAnnenKorrespondanseType((o as Option).value)}
          options={annenKorrespondanseTypeOptions}
          value={_.find(annenKorrespondanseTypeOptions, o => o.value === sed.overfoeringInfo?.annenKorrespondanse?.type)}
          defaultValue={_.find(annenKorrespondanseTypeOptions, o => o.value === sed.overfoeringInfo?.annenKorrespondanse?.type)}
        />

        {sed.overfoeringInfo?.annenKorrespondanse?.type === 'andre' && (
          <TextArea
            error={validation[namespace + '-annenKorrespondanse-andre']?.feilmelding}
            namespace={namespace}
            id='annenKorrespondanse-andre'
            label={t('label:annen-korrespondanse-andre')}
            onChanged={setAnnenKorrespondanseAndre}
            value={sed.overfoeringInfo?.annenKorrespondanse?.andre}
          />
        )}

        <Heading size='xsmall'>
          {t('label:dokumenter-vedlagt')}
        </Heading>

        <Box
          tabIndex={0}
          id={namespace + '-dokumenterVedlagt-type'}
        >
          {dokumenterVedlagtTypeOptions.map(f => (
            <Checkbox
              key={f.value}
              checked={dokumenterVedlagtTypes.indexOf(f.value as H065DokumenterVedlagtType) >= 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDokumenterVedlagtType(f.value as H065DokumenterVedlagtType, e.target.checked)}
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
            label={t('label:dokumenter-vedlagt-annet')}
            onChanged={setDokumenterVedlagtAnnet}
            value={sed.overfoeringInfo?.dokumenterVedlagt?.annet?.[0] ?? ''}
          />
        )}
      </VStack>
    </Box>
  )
}

export default OverfoeringInfo
