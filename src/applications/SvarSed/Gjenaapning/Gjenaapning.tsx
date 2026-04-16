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
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'
import { validateGjenaapning, ValidationGjenaapningProps } from './validation'
import commonStyles from 'assets/css/common.module.css'

type KontekstType = 'bruker' | 'arbeidsgiver' | 'refusjonskrav'

const getKontekstType = (sed: X002Sed): KontekstType => {
  if (sed.arbeidsgiver && (sed.arbeidsgiver.navn || sed.arbeidsgiver.adresse || sed.arbeidsgiver.identifikatorer?.length)) return 'arbeidsgiver'
  if (sed.refusjonskrav && (sed.refusjonskrav.antallkrav || sed.refusjonskrav.id)) return 'refusjonskrav'
  return 'bruker'
}

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
  const sed = replySed as X002Sed
  const [kontekstType, setKontekstTypeState] = useState<KontekstType>(() => getKontekstType(sed))

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationGjenaapningProps>(
      clonedValidation, namespace, validateGjenaapning, {
        replySed: sed,
        personName
      }
    )
    dispatch(setValidation(clonedValidation))
  })

  const setKontekstType = (type: KontekstType) => {
    if (type === kontekstType) return
    // Clear the previously selected context — XSD allows only one
    if (kontekstType === 'bruker') {
      dispatch(updateReplySed('bruker', undefined))
    } else if (kontekstType === 'arbeidsgiver') {
      dispatch(updateReplySed('arbeidsgiver', undefined))
    } else if (kontekstType === 'refusjonskrav') {
      dispatch(updateReplySed('refusjonskrav', undefined))
    }
    // Initialize the new context with an empty object
    if (type === 'bruker') {
      dispatch(updateReplySed('bruker', {}))
    } else if (type === 'arbeidsgiver') {
      dispatch(updateReplySed('arbeidsgiver', {}))
    } else if (type === 'refusjonskrav') {
      dispatch(updateReplySed('refusjonskrav', {}))
    }
    setKontekstTypeState(type)
  }

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

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <Heading size='xsmall'>
          {t('label:gjenaapning-kontekst')}
        </Heading>
        <RadioGroup
          value={kontekstType}
          data-testid={namespace + '-kontekstType'}
          id={namespace + '-kontekstType'}
          legend={t('label:gjenaapning-kontekst')}
          hideLegend
          onChange={(val: string) => setKontekstType(val as KontekstType)}
        >
          <VStack gap="space-4">
            <Radio className={commonStyles.radioPanel} value='bruker'>{t('label:gjenaapning-kontekst-bruker')}</Radio>
            <Radio className={commonStyles.radioPanel} value='arbeidsgiver'>{t('label:gjenaapning-kontekst-arbeidsgiver')}</Radio>
            <Radio className={commonStyles.radioPanel} value='refusjonskrav'>{t('label:gjenaapning-kontekst-refusjonskrav')}</Radio>
          </VStack>
        </RadioGroup>

        {kontekstType === 'bruker' && (
          <>
            <Heading size='xsmall'>
              {t('label:personopplysninger')}
            </Heading>
            <HGrid columns={2} gap="space-16">
              <Input
                error={undefined}
                namespace={namespace}
                id='bruker-fornavn'
                label={t('label:fornavn')}
                onChanged={(val: string) => dispatch(updateReplySed('bruker.fornavn', val.trim()))}
                value={sed.bruker?.fornavn}
              />
              <Input
                error={undefined}
                namespace={namespace}
                id='bruker-etternavn'
                label={t('label:etternavn')}
                onChanged={(val: string) => dispatch(updateReplySed('bruker.etternavn', val.trim()))}
                value={sed.bruker?.etternavn}
              />
            </HGrid>
            <HGrid columns={2} gap="space-16">
              <Input
                error={undefined}
                namespace={namespace}
                id='bruker-foedselsdato'
                label={t('label:fødselsdato')}
                onChanged={(val: string) => dispatch(updateReplySed('bruker.foedselsdato', val.trim()))}
                value={sed.bruker?.foedselsdato}
              />
              <Input
                error={undefined}
                namespace={namespace}
                id='bruker-kjoenn'
                label={t('label:kjønn')}
                onChanged={(val: string) => dispatch(updateReplySed('bruker.kjoenn', val.trim()))}
                value={sed.bruker?.kjoenn}
              />
            </HGrid>
          </>
        )}

        {kontekstType === 'arbeidsgiver' && (
          <>
            <Heading size='xsmall'>
              {t('label:arbeidsgiver')}
            </Heading>
            <HGrid columns={2} gap="space-16">
              <Input
                error={undefined}
                namespace={namespace}
                id='arbeidsgiver-navn'
                label={t('label:arbeidsgiver-navn')}
                onChanged={(val: string) => dispatch(updateReplySed('arbeidsgiver.navn', val.trim()))}
                value={sed.arbeidsgiver?.navn}
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
                onChanged={(val: string) => dispatch(updateReplySed('arbeidsgiver.adresse.bygning', val.trim()))}
                value={sed.arbeidsgiver?.adresse?.bygning}
              />
              <Input
                error={undefined}
                namespace={namespace}
                id='arbeidsgiver-gate'
                label={t('label:gateadresse')}
                onChanged={(val: string) => dispatch(updateReplySed('arbeidsgiver.adresse.gate', val.trim()))}
                value={sed.arbeidsgiver?.adresse?.gate}
              />
            </HGrid>
            <HGrid columns={2} gap="space-16">
              <Input
                error={undefined}
                namespace={namespace}
                id='arbeidsgiver-by'
                label={t('label:by')}
                onChanged={(val: string) => dispatch(updateReplySed('arbeidsgiver.adresse.by', val.trim()))}
                value={sed.arbeidsgiver?.adresse?.by}
              />
              <Input
                error={undefined}
                namespace={namespace}
                id='arbeidsgiver-postnummer'
                label={t('label:postnummer')}
                onChanged={(val: string) => dispatch(updateReplySed('arbeidsgiver.adresse.postnummer', val.trim()))}
                value={sed.arbeidsgiver?.adresse?.postnummer}
              />
            </HGrid>
            <HGrid columns={2} gap="space-16">
              <Input
                error={undefined}
                namespace={namespace}
                id='arbeidsgiver-region'
                label={t('label:region')}
                onChanged={(val: string) => dispatch(updateReplySed('arbeidsgiver.adresse.region', val.trim()))}
                value={sed.arbeidsgiver?.adresse?.region}
              />
              <div style={{ maxWidth: '400px' }}>
                <CountryDropdown
                  closeMenuOnSelect
                  data-testid={namespace + '-arbeidsgiver-landkode'}
                  countryCodeListName="verdensLand"
                  flagWave
                  id={namespace + '-arbeidsgiver-landkode'}
                  label={t('label:land')}
                  onOptionSelected={(e: Country) => dispatch(updateReplySed('arbeidsgiver.adresse.landkode', e.value3))}
                  values={sed.arbeidsgiver?.adresse?.landkode}
                />
              </div>
            </HGrid>
          </>
        )}

        {kontekstType === 'refusjonskrav' && (
          <>
            <Heading size='xsmall'>
              {t('label:refusjonskrav')}
            </Heading>
            <HGrid columns={2} gap="space-16">
              <Input
                error={undefined}
                namespace={namespace}
                id='refusjonskrav-antallkrav'
                label={t('label:refusjonskrav-antallkrav')}
                onChanged={(val: string) => dispatch(updateReplySed('refusjonskrav.antallkrav', val.trim()))}
                value={sed.refusjonskrav?.antallkrav}
              />
              <Input
                error={undefined}
                namespace={namespace}
                id='refusjonskrav-id'
                label={t('label:refusjonskrav-id')}
                onChanged={(val: string) => dispatch(updateReplySed('refusjonskrav.id', val.trim()))}
                value={sed.refusjonskrav?.id}
              />
            </HGrid>
          </>
        )}

        <Heading size='xsmall'>
          {t('label:gjenaapning-aarsak')}
        </Heading>
        <HGrid columns={"2fr 1fr"} gap="space-16" align="start">
          <RadioGroup
            value={sed.gjenaapning?.aarsakType ?? ''}
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

        {sed.gjenaapning?.aarsakType === 'annet' && (
          <Input
            error={validation[namespace + '-aarsakAnnet']?.feilmelding}
            namespace={namespace}
            id='aarsakAnnet'
            label={t('label:gjenaapning-aarsak-annet')}
            onChanged={setAarsakAnnet}
            required
            value={sed.gjenaapning?.aarsakAnnet}
          />
        )}
      </VStack>
    </Box>
  )
}

export default Gjenaapning
