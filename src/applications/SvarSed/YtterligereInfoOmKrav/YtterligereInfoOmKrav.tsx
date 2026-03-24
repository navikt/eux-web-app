import { Box, Heading, HStack, Radio, RadioGroup, Spacer, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateYtterligereInfoOmKrav, ValidationYtterligereInfoOmKravProps } from 'applications/SvarSed/YtterligereInfoOmKrav/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import DateField from 'components/DateField/DateField'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { H065Sed } from 'declarations/h065'
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

const YtterligereInfoOmKrav: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-ytterligereinfoomkrav`
  const sed = replySed as H065Sed

  const informasjonAngaarYtelseTypeOptions: Options = [
    { label: t('el:option-overfoeringinfo-ytelse-lovvalg'), value: 'lovvalg' },
    { label: t('el:option-overfoeringinfo-ytelse-sykepenger_kontantytelse'), value: 'sykepenger_kontantytelse' },
    { label: t('el:option-overfoeringinfo-ytelse-naturalytelser'), value: 'naturalytelser' },
    { label: t('el:option-overfoeringinfo-ytelse-kontantytelse_for_arbeidsulykke_eller_yrkessykdom'), value: 'kontantytelse_for_arbeidsulykke_eller_yrkessykdom' },
    { label: t('el:option-overfoeringinfo-ytelse-naturalytelse_knyttet_til_yrkesskade_eller_yrkessykdom'), value: 'naturalytelse_knyttet_til_yrkesskade_eller_yrkessykdom' },
    { label: t('el:option-overfoeringinfo-ytelse-foreldrepenger_til_mor_far'), value: 'foreldrepenger_til_mor_far' },
    { label: t('el:option-overfoeringinfo-ytelse-ytelse_til_langvarig_pleie'), value: 'ytelse_til_langtidspleie' },
    { label: t('el:option-overfoeringinfo-ytelse-ufoerepensjon'), value: 'uførepensjon' },
    { label: t('el:option-overfoeringinfo-ytelse-alderspensjon'), value: 'alderspensjon' },
    { label: t('el:option-overfoeringinfo-ytelse-etterlattepensjon'), value: 'etterlattepensjon' },
    { label: t('el:option-overfoeringinfo-ytelse-gravferdsstoenad'), value: 'gravferdsstønad' },
    { label: t('el:option-overfoeringinfo-ytelse-dagpenger'), value: 'dagpenger' },
    { label: t('el:option-overfoeringinfo-ytelse-foertidspensjon'), value: 'førtidspensjon' },
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

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationYtterligereInfoOmKravProps>(
      clonedvalidation, namespace, validateYtterligereInfoOmKrav, {
        replySed: (replySed as H065Sed),
        personName
      }, true
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
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <Select
          data-testid={namespace + '-informasjonAngaarYtelse-type'}
          error={validation[namespace + '-informasjonAngaarYtelse-type']?.feilmelding}
          id={namespace + '-informasjonAngaarYtelse-type'}
          label={t('label:krav-dokumentasjon-informasjon-angaar')}
          menuPortalTarget={document.body}
          onChange={(o: unknown) => setInformasjonAngaarYtelseType((o as Option).value)}
          options={informasjonAngaarYtelseTypeOptions}
          required
          value={_.find(informasjonAngaarYtelseTypeOptions, o => o.value === sed.overfoeringInfo?.informasjonAngaarYtelse?.type)}
          defaultValue={_.find(informasjonAngaarYtelseTypeOptions, o => o.value === sed.overfoeringInfo?.informasjonAngaarYtelse?.type)}
        />

        {sed.overfoeringInfo?.informasjonAngaarYtelse?.type === 'annen_ytelse' && (
          <TextArea
            error={validation[namespace + '-informasjonAngaarYtelse-andre']?.feilmelding}
            namespace={namespace}
            id='informasjonAngaarYtelse-andre'
            label={t('label:annen-ytelse')}
            maxLength={155}
            onChanged={setInformasjonAngaarYtelseAndre}
            value={sed.overfoeringInfo?.informasjonAngaarYtelse?.andre}
          />
        )}

        <Select
          data-testid={namespace + '-annenKorrespondanse-type'}
          id={namespace + '-annenKorrespondanse-type'}
          label={t('label:annen-korrespondanse')}
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
            label={t('label:annen-korrespondanse-detaljer')}
            maxLength={65}
            onChanged={setAnnenKorrespondanseAndre}
            value={sed.overfoeringInfo?.annenKorrespondanse?.andre}
          />
        )}

        <HStack>
          <DateField
            error={validation[namespace + '-mottaksdato']?.feilmelding}
            id='mottaksdato'
            namespace={namespace}
            label={t('label:dato-for-mottak')}
            onChanged={setMottaksdato}
            required
            dateValue={sed.overfoeringInfo?.mottaksdato}
          />
        </HStack>

        <RadioGroup
          value={sed.overfoeringInfo?.erBrukerSoekeren ?? ''}
          data-no-border
          data-testid={namespace + '-erBrukerSoekeren'}
          id={namespace + '-erBrukerSoekeren'}
          legend={t('label:personen-er-soekeren')}
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
      </VStack>
    </Box>
  )
}

export default YtterligereInfoOmKrav
