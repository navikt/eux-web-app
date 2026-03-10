import { Box, Checkbox, Heading, HStack, Radio, RadioGroup, Spacer, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateOverfoeringInfo, ValidationOverfoeringInfoProps } from 'applications/SvarSed/OverfoeringInfo/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import DateField from 'components/DateField/DateField'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import ErrorLabel from 'components/Forms/ErrorLabel'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { H065Sed } from 'declarations/sed'
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

  const informasjonAngaarYtelseTypeOptions: Options = [
    { label: t('el:option-overfoeringinfo-ytelse-lovvalg'), value: 'lovvalg' },
    { label: t('el:option-overfoeringinfo-ytelse-sykepenger_kontantytelse'), value: 'sykepenger_kontantytelse' },
    { label: t('el:option-overfoeringinfo-ytelse-naturalytelser'), value: 'naturalytelser' },
    { label: t('el:option-overfoeringinfo-ytelse-kontantytelse_for_arbeidsulykke_eller_yrkessykdom'), value: 'kontantytelse_for_arbeidsulykke_eller_yrkessykdom' },
    { label: t('el:option-overfoeringinfo-ytelse-naturalytelse_knyttet_til_yrkesskade_eller_yrkessykdom'), value: 'naturalytelse_knyttet_til_yrkesskade_eller_yrkessykdom' },
    { label: t('el:option-overfoeringinfo-ytelse-foreldrepenger_til_mor_far'), value: 'foreldrepenger_til_mor_far' },
    { label: t('el:option-overfoeringinfo-ytelse-ytelse_til_langvarig_pleie'), value: 'ytelse_til_langvarig_pleie' },
    { label: t('el:option-overfoeringinfo-ytelse-ufoerepensjon'), value: 'ufoerepensjon' },
    { label: t('el:option-overfoeringinfo-ytelse-alderspensjon'), value: 'alderspensjon' },
    { label: t('el:option-overfoeringinfo-ytelse-etterlattepensjon'), value: 'etterlattepensjon' },
    { label: t('el:option-overfoeringinfo-ytelse-gravferdsstoenad'), value: 'gravferdsstoenad' },
    { label: t('el:option-overfoeringinfo-ytelse-dagpenger'), value: 'dagpenger' },
    { label: t('el:option-overfoeringinfo-ytelse-foertidspensjon'), value: 'foertidspensjon' },
    { label: t('el:option-overfoeringinfo-ytelse-familieytelse'), value: 'familieytelse' },
    { label: t('el:option-overfoeringinfo-ytelse-spesiell_innskuddsfri_kontantytelse'), value: 'spesiell_innskuddsfri_kontantytelse' },
    { label: t('el:option-overfoeringinfo-ytelse-annen_ytelse'), value: 'annen_ytelse' }
  ]

  const annenKorrespondanseTypeOptions: Options = [
    { label: t('el:option-overfoeringinfo-korrespondanse-motregning_av_innskudd'), value: 'motregning_av_innskudd' },
    { label: t('el:option-overfoeringinfo-korrespondanse-motregning_av_ytelser'), value: 'motregning_av_ytelser' },
    { label: t('el:option-overfoeringinfo-korrespondanse-tilbakekreving'), value: 'tilbakekreving' },
    { label: t('el:option-overfoeringinfo-korrespondanse-annet'), value: 'annet' }
  ]

  const dokumenterVedlagtTypeOptions: Options = [
    { label: t('el:option-overfoeringinfo-dokument-soeknad'), value: 'soeknad' },
    { label: t('el:option-overfoeringinfo-dokument-doedsattest'), value: 'doedsattest' },
    { label: t('el:option-overfoeringinfo-dokument-fakturaer'), value: 'fakturaer' },
    { label: t('el:option-overfoeringinfo-dokument-ligningsattest'), value: 'ligningsattest' },
    { label: t('el:option-overfoeringinfo-dokument-krav'), value: 'krav' },
    { label: t('el:option-overfoeringinfo-dokument-medisinsk_dokumentasjon'), value: 'medisinsk_dokumentasjon' },
    { label: t('el:option-overfoeringinfo-dokument-arbeidsattest'), value: 'arbeidsattest' },
    { label: t('el:option-overfoeringinfo-dokument-foedselsattest'), value: 'foedselsattest' },
    { label: t('el:option-overfoeringinfo-dokument-ekteskapsattest'), value: 'ekteskapsattest' },
    { label: t('el:option-overfoeringinfo-dokument-vitnemaal'), value: 'vitnemaal' },
    { label: t('el:option-overfoeringinfo-dokument-medisinsk_rapport'), value: 'medisinsk_rapport' },
    { label: t('el:option-overfoeringinfo-dokument-legeattest'), value: 'legeattest' },
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

  const setInformasjonAngaarYtelseType = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.informasjonAngaarYtelse.type', value.trim()))
    if (value !== 'annen_ytelse') {
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
    if (value !== 'annet') {
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

  const setMottaksdato = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.mottaksdato', value.trim()))
    if (validation[namespace + '-mottaksdato']) {
      dispatch(resetValidation(namespace + '-mottaksdato'))
    }
  }

  const setErBrukerSoekeren = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.erBrukerSoekeren', value))
    if (validation[namespace + '-erBrukerSoekeren']) {
      dispatch(resetValidation(namespace + '-erBrukerSoekeren'))
    }
  }

  const setGrunnerForOverfoering = (value: string) => {
    dispatch(updateReplySed('overfoeringInfo.grunnerForOverfoering', value.trim() || undefined))
    if (validation[namespace + '-grunnerForOverfoering']) {
      dispatch(resetValidation(namespace + '-grunnerForOverfoering'))
    }
  }

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

        {/* 3.1 Krav/dokumentasjon/informasjon angår */}
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

        {sed.overfoeringInfo?.informasjonAngaarYtelse?.type === 'annen_ytelse' && (
          <TextArea
            error={validation[namespace + '-informasjonAngaarYtelse-andre']?.feilmelding}
            namespace={namespace}
            id='informasjonAngaarYtelse-andre'
            label={t('label:informasjon-angaar-ytelse-andre')}
            onChanged={setInformasjonAngaarYtelseAndre}
            value={sed.overfoeringInfo?.informasjonAngaarYtelse?.andre}
          />
        )}

        {/* 3.2 Annen korrespondanse */}
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

        {sed.overfoeringInfo?.annenKorrespondanse?.type === 'annet' && (
          <TextArea
            error={validation[namespace + '-annenKorrespondanse-andre']?.feilmelding}
            namespace={namespace}
            id='annenKorrespondanse-andre'
            label={t('label:annen-korrespondanse-andre')}
            onChanged={setAnnenKorrespondanseAndre}
            value={sed.overfoeringInfo?.annenKorrespondanse?.andre}
          />
        )}

        {/* 3.4 Dato for mottak */}
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

        {/* 3.5 Personen er søkeren */}
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

        {/* 4. Grunner til overføring */}
        <Heading size='xsmall'>
          {t('label:grunner-for-overfoering')}
        </Heading>

        <TextArea
          error={validation[namespace + '-grunnerForOverfoering']?.feilmelding}
          namespace={namespace}
          id='grunnerForOverfoering'
          label={t('label:grunner-for-overfoering')}
          maxLength={255}
          onChanged={setGrunnerForOverfoering}
          value={sed.overfoeringInfo?.grunnerForOverfoering}
        />

        {/* 5. Følgende dokument(er) er vedlagt */}
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
            label={t('label:dokumenter-vedlagt-annet')}
            maxLength={255}
            onChanged={setDokumenterVedlagtAnnet}
            value={sed.overfoeringInfo?.dokumenterVedlagt?.annet?.[0] ?? ''}
          />
        )}
      </VStack>
    </Box>
  )
}

export default OverfoeringInfo
