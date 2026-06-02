import { Box, Heading, HGrid, HStack, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateAWODSpoersmaal, ValidationAWODSpoersmaalProps } from 'applications/SvarSed/AWODSpoersmaal/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import CountryDropdown from 'components/CountryDropdown/CountryDropdown'
import DateField from 'components/DateField/DateField'
import Input from 'components/Forms/Input'
import Select from 'components/Forms/Select'
import TextArea from 'components/Forms/TextArea'
import { Option, Options } from 'declarations/app'
import { State } from 'declarations/reducers'
import { H120Sed } from 'declarations/h120'
import { Country } from '@navikt/land-verktoy'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX } from 'react';
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const AWODSpoersmaal: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-awodspoersmaal`
  const sed = replySed as H120Sed

  const awodTypeOptions: Options = [
    { label: t('el:option-h120-awodtype-arbeidsulykke'), value: 'arbeidsulykke' },
    { label: t('el:option-h120-awodtype-yrkessykdom'), value: 'yrkessykdom' }
  ]

  const brukerStatusOptions: Options = [
    { label: t('el:option-h120-brukerstatus-arbeidstaker'), value: 'arbeidstaker' },
    { label: t('el:option-h120-brukerstatus-selvstendig_næringsdrivende'), value: 'selvstendig_næringsdrivende' },
    { label: t('el:option-h120-brukerstatus-offentlig_ansatt'), value: 'offentlig_ansatt' },
    { label: t('el:option-h120-brukerstatus-grensearbeider'), value: 'grensearbeider' },
    { label: t('el:option-h120-brukerstatus-annet'), value: 'annet' }
  ]

  const identifikatorTypeOptions: Options = [
    { label: t('el:option-h120-arbeidsgiveridentifikator-registrering'), value: 'registrering' },
    { label: t('el:option-h120-arbeidsgiveridentifikator-trygd'), value: 'trygd' },
    { label: t('el:option-h120-arbeidsgiveridentifikator-skatt'), value: 'skatt' },
    { label: t('el:option-h120-arbeidsgiveridentifikator-ukjent'), value: 'ukjent' }
  ]

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationAWODSpoersmaalProps>(
      clonedvalidation, namespace, validateAWODSpoersmaal, {
        replySed: sed,
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setType = (value: string) => {
    dispatch(updateReplySed('yrkesskade.type', value.trim()))
    if (validation[namespace + '-type']) {
      dispatch(resetValidation(namespace + '-type'))
    }
  }

  const setDato = (value: string) => {
    dispatch(updateReplySed('yrkesskade.dato', value.trim()))
  }

  const setBrukerStatus = (value: string) => {
    dispatch(updateReplySed('yrkesskade.brukerStatus', value.trim()))
    if (value !== 'annet') {
      dispatch(updateReplySed('yrkesskade.brukerStatusAnnet', undefined))
    }
  }

  const setBrukerStatusAnnet = (value: string) => {
    dispatch(updateReplySed('yrkesskade.brukerStatusAnnet', value.trim() || undefined))
  }

  const setSykdomKode = (value: string) => {
    dispatch(updateReplySed('yrkesskade.sykdomKode', value.trim() || undefined))
  }

  const setSykdomKodingssystem = (value: string) => {
    dispatch(updateReplySed('yrkesskade.sykdomKodingssystem', value.trim() || undefined))
  }

  const setKonsekvensEllerBeskrivelse = (value: string) => {
    dispatch(updateReplySed('yrkesskade.konsekvensEllerBeskrivelse', value.trim() || undefined))
  }

  const setArbeidsgiverNavn = (value: string) => {
    dispatch(updateReplySed('yrkesskade.arbeidsgiver.navn', value.trim() || undefined))
  }

  const setArbeidsgiverGate = (value: string) => {
    dispatch(updateReplySed('yrkesskade.arbeidsgiver.adresse.gate', value.trim() || undefined))
  }

  const setArbeidsgiverBygning = (value: string) => {
    dispatch(updateReplySed('yrkesskade.arbeidsgiver.adresse.bygning', value.trim() || undefined))
  }

  const setArbeidsgiverPostnummer = (value: string) => {
    dispatch(updateReplySed('yrkesskade.arbeidsgiver.adresse.postnummer', value.trim() || undefined))
  }

  const setArbeidsgiverBy = (value: string) => {
    dispatch(updateReplySed('yrkesskade.arbeidsgiver.adresse.by', value.trim() || undefined))
  }

  const setArbeidsgiverRegion = (value: string) => {
    dispatch(updateReplySed('yrkesskade.arbeidsgiver.adresse.region', value.trim() || undefined))
  }

  const setArbeidsgiverLandkode = (value: string) => {
    dispatch(updateReplySed('yrkesskade.arbeidsgiver.adresse.landkode', value.trim() || undefined))
  }

  const setIdentifikatorType = (value: string) => {
    dispatch(updateReplySed('yrkesskade.arbeidsgiver.identifikator[0].type', value.trim() || undefined))
  }

  const setIdentifikatorId = (value: string) => {
    dispatch(updateReplySed('yrkesskade.arbeidsgiver.identifikator[0].id', value.trim() || undefined))
  }

  const awod = sed.yrkesskade
  const adresse = awod?.arbeidsgiver?.adresse
  const hasAnyAdresseField = !!(
    adresse?.gate?.trim() || adresse?.bygning?.trim() || adresse?.postnummer?.trim() ||
    adresse?.by?.trim() || adresse?.region?.trim() || adresse?.landkode?.trim()
  )

  const identifikator = awod?.arbeidsgiver?.identifikator?.[0]
  const hasAnyIdentifikatorField = !!(identifikator?.type?.trim() || identifikator?.id?.trim())

  const hasAnyAWODField = !!(
    awod?.type || awod?.dato?.trim() || awod?.brukerStatus ||
    awod?.brukerStatusAnnet?.trim() || awod?.sykdomKode?.trim() ||
    awod?.sykdomKodingssystem?.trim() || awod?.konsekvensEllerBeskrivelse?.trim() ||
    awod?.arbeidsgiver?.navn?.trim() || hasAnyAdresseField || hasAnyIdentifikatorField
  )

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <Select
          data-testid={namespace + '-type'}
          error={validation[namespace + '-type']?.feilmelding}
          id={namespace + '-type'}
          label={t('label:denne-seden-gjelder') + (hasAnyAWODField ? ' *' : '')}
          menuPortalTarget={document.body}
          onChange={(o: unknown) => setType((o as Option).value)}
          options={awodTypeOptions}
          value={_.find(awodTypeOptions, o => o.value === sed.yrkesskade?.type)}
          defaultValue={_.find(awodTypeOptions, o => o.value === sed.yrkesskade?.type)}
        />

        <HStack>
          <DateField
            error={validation[namespace + '-dato']?.feilmelding}
            id='dato'
            namespace={namespace}
            label={t('label:dato-for-ulykken-sykdommen') + (hasAnyAWODField ? ' *' : '')}
            onChanged={setDato}
            dateValue={sed.yrkesskade?.dato}
          />
        </HStack>

        <Select
          data-testid={namespace + '-brukerStatus'}
          id={namespace + '-brukerStatus'}
          label={t('label:status-beroert-person')}
          menuPortalTarget={document.body}
          onChange={(o: unknown) => setBrukerStatus((o as Option).value)}
          options={brukerStatusOptions}
          value={_.find(brukerStatusOptions, o => o.value === sed.yrkesskade?.brukerStatus)}
          defaultValue={_.find(brukerStatusOptions, o => o.value === sed.yrkesskade?.brukerStatus)}
        />

        {sed.yrkesskade?.brukerStatus === 'annet' && (
          <TextArea
            error={validation[namespace + '-brukerStatusAnnet']?.feilmelding}
            namespace={namespace}
            id='brukerStatusAnnet'
            label={t('label:angi-status-annet')}
            maxLength={65}
            onChanged={setBrukerStatusAnnet}
            value={sed.yrkesskade?.brukerStatusAnnet}
          />
        )}

        <HGrid columns={2} gap="space-16">
          <Input
            error={validation[namespace + '-sykdomKode']?.feilmelding}
            namespace={namespace}
            id='sykdomKode'
            label={t('label:kode-arbeidsulykke-yrkessykdom')}
            onChanged={setSykdomKode}
            value={sed.yrkesskade?.sykdomKode}
          />
          <Input
            error={validation[namespace + '-sykdomKodingssystem']?.feilmelding}
            namespace={namespace}
            id='sykdomKodingssystem'
            label={t('label:kodingssystem')}
            onChanged={setSykdomKodingssystem}
            value={sed.yrkesskade?.sykdomKodingssystem}
          />
        </HGrid>

        <TextArea
          error={validation[namespace + '-konsekvensEllerBeskrivelse']?.feilmelding}
          namespace={namespace}
          id='konsekvensEllerBeskrivelse'
          label={t('label:konsekvenser-eller-beskrivelse')}
          maxLength={255}
          onChanged={setKonsekvensEllerBeskrivelse}
          value={sed.yrkesskade?.konsekvensEllerBeskrivelse}
        />

        <Heading size='xsmall'>
          {t('label:arbeidsgiver')}
        </Heading>
        <Input
          error={validation[namespace + '-arbeidsgiverNavn']?.feilmelding}
          namespace={namespace}
          id='arbeidsgiverNavn'
          label={t('label:arbeidsgiver-navn') + (hasAnyAWODField ? ' *' : '')}
          onChanged={setArbeidsgiverNavn}
          value={sed.yrkesskade?.arbeidsgiver?.navn}
        />
        <HGrid columns={2} gap="space-16" align="start">
          <Input
            error={validation[namespace + '-identifikatorId']?.feilmelding}
            namespace={namespace}
            id='identifikatorId'
            label={t('label:arbeidsgiver-identifikator-id') + (hasAnyIdentifikatorField ? ' *' : '')}
            onChanged={setIdentifikatorId}
            value={sed.yrkesskade?.arbeidsgiver?.identifikator?.[0]?.id}
          />
          <Select
            data-testid={namespace + '-identifikatorType'}
            error={validation[namespace + '-identifikatorType']?.feilmelding}
            id={namespace + '-identifikatorType'}
            label={t('label:arbeidsgiver-identifikator-type') + (hasAnyIdentifikatorField ? ' *' : '')}
            menuPortalTarget={document.body}
            onChange={(o: unknown) => setIdentifikatorType((o as Option).value)}
            options={identifikatorTypeOptions}
            value={_.find(identifikatorTypeOptions, o => o.value === sed.yrkesskade?.arbeidsgiver?.identifikator?.[0]?.type)}
            defaultValue={_.find(identifikatorTypeOptions, o => o.value === sed.yrkesskade?.arbeidsgiver?.identifikator?.[0]?.type)}
          />
        </HGrid>
        <HGrid columns={"2fr 1fr"} gap="space-16">
          <Input
            error={undefined}
            namespace={namespace}
            id='arbeidsgiverGate'
            label={t('label:gateadresse')}
            onChanged={setArbeidsgiverGate}
            value={sed.yrkesskade?.arbeidsgiver?.adresse?.gate}
          />
          <Input
            error={undefined}
            namespace={namespace}
            id='arbeidsgiverBygning'
            label={t('label:bygning')}
            onChanged={setArbeidsgiverBygning}
            value={sed.yrkesskade?.arbeidsgiver?.adresse?.bygning}
          />
        </HGrid>
        <HGrid columns={4} gap="space-16" align="start">
          <Input
            error={undefined}
            namespace={namespace}
            id='arbeidsgiverPostnummer'
            label={t('label:postnr')}
            onChanged={setArbeidsgiverPostnummer}
            value={sed.yrkesskade?.arbeidsgiver?.adresse?.postnummer}
          />
          <Input
            error={validation[namespace + '-arbeidsgiverBy']?.feilmelding}
            namespace={namespace}
            id='arbeidsgiverBy'
            label={t('label:by') + (hasAnyAdresseField ? ' *' : '')}
            onChanged={setArbeidsgiverBy}
            value={sed.yrkesskade?.arbeidsgiver?.adresse?.by}
          />
          <Input
            error={undefined}
            namespace={namespace}
            id='arbeidsgiverRegion'
            label={t('label:region')}
            onChanged={setArbeidsgiverRegion}
            value={sed.yrkesskade?.arbeidsgiver?.adresse?.region}
          />
          <div style={{ maxWidth: '400px' }}>
            <CountryDropdown
              closeMenuOnSelect
              countryCodeListName='verdensLand'
              data-testid={namespace + '-arbeidsgiverLand'}
              error={validation[namespace + '-arbeidsgiverLand']?.feilmelding}
              flagWave
              id={namespace + '-arbeidsgiverLand'}
              label={t('label:land') + (hasAnyAdresseField ? ' *' : '')}
              menuPortalTarget={document.body}
              onOptionSelected={(e: Country) => setArbeidsgiverLandkode(e.value3)}
              values={sed.yrkesskade?.arbeidsgiver?.adresse?.landkode}
            />
          </div>
        </HGrid>
      </VStack>
    </Box>
  )
}

export default AWODSpoersmaal
