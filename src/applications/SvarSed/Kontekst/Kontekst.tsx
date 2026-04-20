import { Box, Heading, HGrid, HStack, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { setValidation } from 'actions/validation'
import Input from 'components/Forms/Input'
import DateField from 'components/DateField/DateField'
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
import { validateKontekst, ValidationKontekstProps } from './validation'
import commonStyles from 'assets/css/common.module.css'

type KontekstType = 'bruker' | 'arbeidsgiver' | 'refusjonskrav'

const getKontekstType = (sed: X002Sed): KontekstType => {
  if (sed.arbeidsgiver !== undefined) return 'arbeidsgiver'
  if (sed.refusjonskrav !== undefined) return 'refusjonskrav'
  return 'bruker'
}

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Kontekst: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-kontekst`
  const sed = replySed as X002Sed
  const [kontekstType, setKontekstTypeState] = useState<KontekstType>(() => getKontekstType(sed))

  useUnmount(() => {
    const clonedValidation = _.cloneDeep(validation)
    performValidation<ValidationKontekstProps>(
      clonedValidation, namespace, validateKontekst, {
        replySed: sed,
        personName
      }
    )
    dispatch(setValidation(clonedValidation))
  })

  const isBrukerEmpty = !sed.bruker?.fornavn && !sed.bruker?.etternavn && !sed.bruker?.foedselsdato && !sed.bruker?.kjoenn

  const setKontekstType = (type: KontekstType) => {
    if (type === kontekstType) return
    // Clear the non-selected contexts — XSD allows only one.
    // Never clear bruker here — it's needed by the MainForm menu.
    // bruker is stripped at submit time in stripX002Context when another context is active.
    if (type === 'bruker') {
      dispatch(updateReplySed('arbeidsgiver', undefined))
      dispatch(updateReplySed('refusjonskrav', undefined))
      // Pre-fill bruker from RinaSak person data if empty
      if (isBrukerEmpty && sed.sak) {
        dispatch(updateReplySed('bruker', {
          fornavn: sed.sak.fornavn ?? '',
          etternavn: sed.sak.etternavn ?? '',
          foedselsdato: sed.sak.foedselsdato ?? '',
          kjoenn: sed.sak.kjoenn ?? ''
        }))
      }
    } else if (type === 'arbeidsgiver') {
      dispatch(updateReplySed('refusjonskrav', undefined))
      dispatch(updateReplySed('arbeidsgiver', {}))
    } else if (type === 'refusjonskrav') {
      dispatch(updateReplySed('arbeidsgiver', undefined))
      dispatch(updateReplySed('refusjonskrav', {}))
    }
    setKontekstTypeState(type)
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
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
            <HGrid columns={3} gap="space-16">
              <Input
                error={validation[namespace + '-bruker-fornavn']?.feilmelding}
                namespace={namespace}
                id='bruker-fornavn'
                label={t('label:fornavn')}
                onChanged={(val: string) => dispatch(updateReplySed('bruker.fornavn', val.trim()))}
                required
                value={sed.bruker?.fornavn ?? ''}
              />
              <Input
                error={validation[namespace + '-bruker-etternavn']?.feilmelding}
                namespace={namespace}
                id='bruker-etternavn'
                label={t('label:etternavn')}
                onChanged={(val: string) => dispatch(updateReplySed('bruker.etternavn', val.trim()))}
                required
                value={sed.bruker?.etternavn ?? ''}
              />
              <DateField
                error={validation[namespace + '-bruker-foedselsdato']?.feilmelding}
                id='bruker-foedselsdato'
                label={t('label:fødselsdato')}
                namespace={namespace}
                onChanged={(val: string) => dispatch(updateReplySed('bruker.foedselsdato', val.trim()))}
                dateValue={sed.bruker?.foedselsdato ?? ''}
              />
            </HGrid>
            <RadioGroup
              value={sed.bruker?.kjoenn}
              data-no-border
              data-testid={namespace + '-bruker-kjoenn'}
              error={validation[namespace + '-bruker-kjoenn']?.feilmelding}
              id={namespace + '-bruker-kjoenn'}
              legend={t('label:kjønn')}
              name={namespace + '-bruker-kjoenn'}
              onChange={(val: string) => dispatch(updateReplySed('bruker.kjoenn', val.trim()))}
            >
              <HGrid columns={3} gap="space-16">
                <Radio className={commonStyles.radioPanel} value='M'>{t('label:mann')}</Radio>
                <Radio className={commonStyles.radioPanel} value='K'>{t('label:kvinne')}</Radio>
                <Radio className={commonStyles.radioPanel} value='U'>{t('label:ukjent')}</Radio>
              </HGrid>
            </RadioGroup>
          </>
        )}

        {kontekstType === 'arbeidsgiver' && (
          <>
            <Heading size='xsmall'>
              {t('label:arbeidsgiver')}
            </Heading>
            <HGrid columns={2} gap="space-16">
              <Input
                error={validation[namespace + '-arbeidsgiver-navn']?.feilmelding}
                namespace={namespace}
                id='arbeidsgiver-navn'
                label={t('label:arbeidsgiver-navn')}
                onChanged={(val: string) => dispatch(updateReplySed('arbeidsgiver.navn', val.trim()))}
                required
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
                error={validation[namespace + '-arbeidsgiver-by']?.feilmelding}
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
                  error={validation[namespace + '-arbeidsgiver-landkode']?.feilmelding}
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
                error={validation[namespace + '-refusjonskrav-antallkrav']?.feilmelding}
                namespace={namespace}
                id='refusjonskrav-antallkrav'
                label={t('label:refusjonskrav-antallkrav')}
                onChanged={(val: string) => dispatch(updateReplySed('refusjonskrav.antallkrav', val.trim()))}
                required
                value={sed.refusjonskrav?.antallkrav}
              />
              <Input
                error={validation[namespace + '-refusjonskrav-id']?.feilmelding}
                namespace={namespace}
                id='refusjonskrav-id'
                label={t('label:refusjonskrav-id')}
                onChanged={(val: string) => dispatch(updateReplySed('refusjonskrav.id', val.trim()))}
                required
                value={sed.refusjonskrav?.id}
              />
            </HGrid>
          </>
        )}
      </VStack>
    </Box>
  )
}

export default Kontekst
