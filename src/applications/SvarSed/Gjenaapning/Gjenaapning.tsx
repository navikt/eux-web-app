import { Box, Heading, HGrid, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import CountryDropdown from 'components/CountryDropdown/CountryDropdown'
import { Country } from '@navikt/land-verktoy'
import { State } from 'declarations/reducers'
import { X002Sed } from 'declarations/sed'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateGjenaapning, ValidationGjenaapningProps } from './validation'
import commonStyles from 'assets/css/common.module.css'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Gjenaapning: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}:MainFormProps): JSX.Element => {
  const { validation } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-gjenaapning`

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationGjenaapningProps>(
      clonedValidation, namespace, validateGjenaapning, {
        replySed: (replySed as X002Sed),
        personName
      }
    )
    dispatch(setValidation(clonedValidation))
  })

  const setAarsakType = (aarsakType: string) => {
    dispatch(updateReplySed('gjenaapning.aarsakType', aarsakType.trim()))
    if (aarsakType !== 'annet') {
      dispatch(updateReplySed('gjenaapning.aarsakAnnet', ''))
    }
    if (validation[namespace + '-aarsakType']) {
      dispatch(resetValidation(namespace + '-aarsakType'))
    }
  }

  const setAarsakAnnet = (aarsakAnnet: string) => {
    dispatch(updateReplySed('gjenaapning.aarsakAnnet', aarsakAnnet.trim()))
    if (validation[namespace + '-aarsakAnnet']) {
      dispatch(resetValidation(namespace + '-aarsakAnnet'))
    }
  }

  const setArbeidsgiverNavn = (navn: string) => {
    dispatch(updateReplySed('arbeidsgiver.navn', navn.trim()))
  }

  const setArbeidsgiverBygning = (bygning: string) => {
    dispatch(updateReplySed('arbeidsgiver.adresse.bygning', bygning.trim()))
  }

  const setArbeidsgiverGate = (gate: string) => {
    dispatch(updateReplySed('arbeidsgiver.adresse.gate', gate.trim()))
  }

  const setArbeidsgiverBy = (by: string) => {
    dispatch(updateReplySed('arbeidsgiver.adresse.by', by.trim()))
  }

  const setArbeidsgiverPostnummer = (postnummer: string) => {
    dispatch(updateReplySed('arbeidsgiver.adresse.postnummer', postnummer.trim()))
  }

  const setArbeidsgiverRegion = (region: string) => {
    dispatch(updateReplySed('arbeidsgiver.adresse.region', region.trim()))
  }

  const setArbeidsgiverLandkode = (landkode: string) => {
    dispatch(updateReplySed('arbeidsgiver.adresse.landkode', landkode.trim()))
  }

  const setRefusjonskravAntallkrav = (antallkrav: string) => {
    dispatch(updateReplySed('refusjonskrav.antallkrav', antallkrav.trim()))
  }

  const setRefusjonskravId = (id: string) => {
    dispatch(updateReplySed('refusjonskrav.id', id.trim()))
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <Heading size='xsmall'>
          {t('label:gjenaapning-aarsak')}
        </Heading>
        <HGrid columns={"2fr 1fr"} gap="space-16" align="start">
          <RadioGroup
            value={(replySed as X002Sed).gjenaapning?.aarsakType ?? ''}
            data-testid={namespace + '-aarsakType'}
            error={validation[namespace + '-aarsakType']?.feilmelding}
            id={namespace + '-aarsakType'}
            legend={t('label:gjenaapning-aarsak')}
            hideLegend
            onChange={setAarsakType}
          >
            <VStack gap="space-4">
              <Radio className={commonStyles.radioPanel} value='ny_informasjon_ble_tilgjengelig'>{t('el:option-gjenaapning-01')}</Radio>
              <Radio className={commonStyles.radioPanel} value='feilaktig_informasjon_levert'>{t('el:option-gjenaapning-02')}</Radio>
              <Radio className={commonStyles.radioPanel} value='saken_ble_utilsiktet_avsluttet'>{t('el:option-gjenaapning-03')}</Radio>
              <Radio className={commonStyles.radioPanel} value='annet'>{t('el:option-gjenaapning-99')}</Radio>
            </VStack>
          </RadioGroup>
          <div />
        </HGrid>

        {(replySed as X002Sed).gjenaapning?.aarsakType === 'annet' && (
          <Input
            error={validation[namespace + '-aarsakAnnet']?.feilmelding}
            namespace={namespace}
            id='aarsakAnnet'
            label={t('label:gjenaapning-aarsak-annet')}
            onChanged={setAarsakAnnet}
            required
            value={(replySed as X002Sed).gjenaapning?.aarsakAnnet}
          />
        )}

        <Heading size='xsmall'>
          {t('label:arbeidsgiver')}
        </Heading>
        <HGrid columns={2} gap="space-16">
          <Input
            error={undefined}
            namespace={namespace}
            id='arbeidsgiver-navn'
            label={t('label:arbeidsgiver-navn')}
            onChanged={setArbeidsgiverNavn}
            value={(replySed as X002Sed).arbeidsgiver?.navn}
          />
        </HGrid>

        <Heading size='xsmall'>
          {t('label:arbeidsgiver-adresse')}
        </Heading>
        <HGrid columns={2} gap="space-16">
          <Input
            error={undefined}
            namespace={namespace}
            id='arbeidsgiver-bygning'
            label={t('label:bygning')}
            onChanged={setArbeidsgiverBygning}
            value={(replySed as X002Sed).arbeidsgiver?.adresse?.bygning}
          />
          <Input
            error={undefined}
            namespace={namespace}
            id='arbeidsgiver-gate'
            label={t('label:gateadresse')}
            onChanged={setArbeidsgiverGate}
            value={(replySed as X002Sed).arbeidsgiver?.adresse?.gate}
          />
        </HGrid>
        <HGrid columns={2} gap="space-16">
          <Input
            error={undefined}
            namespace={namespace}
            id='arbeidsgiver-by'
            label={t('label:by')}
            onChanged={setArbeidsgiverBy}
            value={(replySed as X002Sed).arbeidsgiver?.adresse?.by}
          />
          <Input
            error={undefined}
            namespace={namespace}
            id='arbeidsgiver-postnummer'
            label={t('label:postnummer')}
            onChanged={setArbeidsgiverPostnummer}
            value={(replySed as X002Sed).arbeidsgiver?.adresse?.postnummer}
          />
        </HGrid>
        <HGrid columns={2} gap="space-16">
          <Input
            error={undefined}
            namespace={namespace}
            id='arbeidsgiver-region'
            label={t('label:region')}
            onChanged={setArbeidsgiverRegion}
            value={(replySed as X002Sed).arbeidsgiver?.adresse?.region}
          />
          <div style={{ maxWidth: '400px' }}>
            <CountryDropdown
              closeMenuOnSelect
              data-testid={namespace + '-arbeidsgiver-landkode'}
              countryCodeListName="verdensLand"
              flagWave
              id={namespace + '-arbeidsgiver-landkode'}
              label={t('label:land')}
              onOptionSelected={(e: Country) => setArbeidsgiverLandkode(e.value3)}
              values={(replySed as X002Sed).arbeidsgiver?.adresse?.landkode}
            />
          </div>
        </HGrid>

        <Heading size='xsmall'>
          {t('label:refusjonskrav')}
        </Heading>
        <HGrid columns={2} gap="space-16">
          <Input
            error={undefined}
            namespace={namespace}
            id='refusjonskrav-antallkrav'
            label={t('label:refusjonskrav-antallkrav')}
            onChanged={setRefusjonskravAntallkrav}
            value={(replySed as X002Sed).refusjonskrav?.antallkrav}
          />
          <Input
            error={undefined}
            namespace={namespace}
            id='refusjonskrav-id'
            label={t('label:refusjonskrav-id')}
            onChanged={setRefusjonskravId}
            value={(replySed as X002Sed).refusjonskrav?.id}
          />
        </HGrid>
      </VStack>
    </Box>
  )
}

export default Gjenaapning
