import { Box, Heading, HGrid, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateGlobaltKrav, ValidationGlobaltKravProps } from 'applications/SvarSed/GlobaltKrav/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import InstitutionSelector from 'components/InstitutionSelector/InstitutionSelector'
import { State } from 'declarations/reducers'
import { H021Sed, KreditorInstitusjon } from 'declarations/h021'
import { CountryCodes, Institusjon as IRInstitusjon } from 'declarations/types'
import CurrencyDropdown from 'components/CurrencyDropdown/CurrencyDropdown'
import { Currency } from 'components/land-verktoy'
import { sanitizeAmount } from 'utils/amount'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React, { JSX, useState } from 'react';
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getLandkodeFromInstitusjonsId } from 'utils/institusjon'
import performValidation from 'utils/performValidation'

interface GlobaltKravSelector extends MainFormSelector {
  countryCodes: CountryCodes | null | undefined
  cdmVersjonApp: string | undefined
}

const mapState = (state: State): GlobaltKravSelector => ({
  validation: state.validation.status,
  countryCodes: state.app.countryCodes,
  cdmVersjonApp: state.app.cdmVersjon
})

const GlobaltKrav: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation, countryCodes, cdmVersjonApp } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${personID}-globaltkrav`
  const sed = replySed as H021Sed
  const kreditorinstitusjon: KreditorInstitusjon | undefined = sed.refusjonskrav?.kreditorinstitusjon
  const cdmVersjon: string | undefined = sed.sak?.cdmVersjon ?? cdmVersjonApp
  // Country picked before an institution is chosen
  const [_valgtLandkode, _setValgtLandkode] = useState<string | undefined>(undefined)
  const kreditorLandkode: string | undefined = kreditorinstitusjon?.id
    ? kreditorinstitusjon.__landkode ?? getLandkodeFromInstitusjonsId(kreditorinstitusjon.id, countryCodes, cdmVersjon)
    : _valgtLandkode

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationGlobaltKravProps>(
      clonedvalidation, namespace, validateGlobaltKrav, {
        replySed: (replySed as H021Sed),
        personName
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setKreditorProp = (prop: string, value: string | undefined) => {
    dispatch(updateReplySed('refusjonskrav.kreditorinstitusjon.' + prop, value))
    if (validation[namespace + '-kreditorinstitusjon-' + prop]) {
      dispatch(resetValidation(namespace + '-kreditorinstitusjon-' + prop))
    }
  }

  // Only id, navn and __landkode change; references and amounts are kept
  const updateKreditorInstitusjon = (institusjon: IRInstitusjon | undefined, landkode: string | undefined) => {
    const newKreditor: KreditorInstitusjon = {
      ..._.omit(kreditorinstitusjon, '__landkode'),
      id: institusjon?.institusjonsID,
      navn: institusjon?.navn
    }
    if (institusjon) {
      newKreditor.__landkode = landkode
    }
    dispatch(updateReplySed('refusjonskrav.kreditorinstitusjon', newKreditor))
    dispatch(resetValidation(namespace + '-kreditorinstitusjon-id'))
    dispatch(resetValidation(namespace + '-kreditorinstitusjon-navn'))
  }

  const setKreditorLandkode = (landkode: string) => {
    _setValgtLandkode(landkode)
    updateKreditorInstitusjon(undefined, undefined)
  }

  const setKreditorInstitusjon = (institusjon: IRInstitusjon | undefined) => {
    if (!institusjon) {
      _setValgtLandkode(kreditorLandkode)
    }
    updateKreditorInstitusjon(institusjon, kreditorLandkode)
  }

  const setDebitorProp = (prop: string, value: string | undefined) => {
    dispatch(updateReplySed('refusjonskrav.debitorinstitusjon.' + prop, value))
    if (validation[namespace + '-debitorinstitusjon-' + prop]) {
      dispatch(resetValidation(namespace + '-debitorinstitusjon-' + prop))
    }
  }

  const setTotaltAntallFakturaer = (value: string) => {
    dispatch(updateReplySed('refusjonskrav.totaltAntallFakturaer', value.trim()))
    if (validation[namespace + '-totaltAntallFakturaer']) {
      dispatch(resetValidation(namespace + '-totaltAntallFakturaer'))
    }
  }

  const setBeloepValuta = (path: string, prop: string, value: string | undefined) => {
    dispatch(updateReplySed(`refusjonskrav.kreditorinstitusjon.${path}.${prop}`, value))
    if (validation[namespace + `-${path}-${prop}`]) {
      dispatch(resetValidation(namespace + `-${path}-${prop}`))
    }
  }

  const setBetalingsreferanse = (value: string) => {
    dispatch(updateReplySed('refusjonskrav.kreditorinstitusjon.betalingsreferanse', value.trim()))
    if (validation[namespace + '-betalingsreferanse']) {
      dispatch(resetValidation(namespace + '-betalingsreferanse'))
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='small'>
          {label}
        </Heading>

        <Heading size='xsmall'>
          {t('label:kreditorinstitusjon')}
        </Heading>

        <InstitutionSelector
          namespace={namespace}
          id='kreditorinstitusjon'
          bucType={sed.sak?.sakType}
          landkode={kreditorLandkode}
          value={kreditorinstitusjon?.id || undefined}
          valueNavn={kreditorinstitusjon?.navn}
          error={
            validation[namespace + '-kreditorinstitusjon-id']?.feilmelding ??
            validation[namespace + '-kreditorinstitusjon-navn']?.feilmelding
          }
          required
          onLandkodeChanged={setKreditorLandkode}
          onInstitutionSelected={setKreditorInstitusjon}
        />

        <HGrid columns={2} gap="space-16" align="start">
          <Input
            error={validation[namespace + '-kreditorinstitusjon-globalReferanse']?.feilmelding}
            id='kreditorinstitusjon-globalReferanse'
            label={t('label:global-referanse-kreditor')}
            namespace={namespace}
            onChanged={(value: string) => setKreditorProp('globalReferanse', value.trim())}
            required
            value={sed.refusjonskrav?.kreditorinstitusjon?.globalReferanse || ''}
          />
          <Input
            error={validation[namespace + '-debitorinstitusjon-globalReferanse']?.feilmelding}
            id='debitorinstitusjon-globalReferanse'
            label={t('label:global-referanse-debitor')}
            namespace={namespace}
            onChanged={(value: string) => setDebitorProp('globalReferanse', value.trim())}
            required
            value={sed.refusjonskrav?.debitorinstitusjon?.globalReferanse || ''}
          />
        </HGrid>

        <HGrid columns={2} gap="space-16" align="start">
          <Input
            error={validation[namespace + '-totaltAntallFakturaer']?.feilmelding}
            id='totaltAntallFakturaer'
            label={t('label:totalt-antall-fakturaer')}
            namespace={namespace}
            onChanged={setTotaltAntallFakturaer}
            required
            value={sed.refusjonskrav?.totaltAntallFakturaer || ''}
          />
        </HGrid>
        <div  />
        <Heading size='xsmall'>
          {t('label:utbetaling')} ({t('label:i-kreditorens-valuta')})
        </Heading>
        <HGrid columns={2} gap="space-16" align="start">
          <Input
            error={validation[namespace + '-kravTotalbeloep-beloep']?.feilmelding}
            id='kravTotalbeloep-beloep'
            label={t('label:krav-totalbeloep')}
            namespace={namespace}
            onChanged={(value: string) => setBeloepValuta('kravTotalbeloep', 'beloep', sanitizeAmount(value))}
            required
            value={sed.refusjonskrav?.kreditorinstitusjon?.kravTotalbeloep?.beloep || ''}
          />
          <CurrencyDropdown
            ariaLabel={t('label:valuta')}
            closeMenuOnSelect
            currencyCodeListName="euEftaValuta"
            error={validation[namespace + '-kravTotalbeloep-valuta']?.feilmelding}
            id={namespace + '-kravTotalbeloep-valuta'}
            label={t('label:valuta')}
            locale='nb'
            onOptionSelected={(currency: Currency) => setBeloepValuta('kravTotalbeloep', 'valuta', currency.value)}
            includeHistoricCurrencies
            sort={"noeuFirst"}
            required
            values={sed.refusjonskrav?.kreditorinstitusjon?.kravTotalbeloep?.valuta}
          />
        </HGrid>

        <HGrid columns={2} gap="space-16" align="start">
          <Input
            error={validation[namespace + '-avvistKravTotalbeloep-beloep']?.feilmelding}
            id='avvistKravTotalbeloep-beloep'
            label={t('label:avvist-krav-totalbeloep')}
            namespace={namespace}
            onChanged={(value: string) => setBeloepValuta('avvistKravTotalbeloep', 'beloep', sanitizeAmount(value))}
            value={sed.refusjonskrav?.kreditorinstitusjon?.avvistKravTotalbeloep?.beloep || ''}
          />
          <CurrencyDropdown
            ariaLabel={t('label:valuta')}
            closeMenuOnSelect
            currencyCodeListName="euEftaValuta"
            error={validation[namespace + '-avvistKravTotalbeloep-valuta']?.feilmelding}
            id={namespace + '-avvistKravTotalbeloep-valuta'}
            label={t('label:valuta')}
            locale='nb'
            onOptionSelected={(currency: Currency) => setBeloepValuta('avvistKravTotalbeloep', 'valuta', currency.value)}
            includeHistoricCurrencies
            sort={"noeuFirst"}
            values={sed.refusjonskrav?.kreditorinstitusjon?.avvistKravTotalbeloep?.valuta}
          />
        </HGrid>

        <HGrid columns={2} gap="space-16" align="start">
          <Input
            error={validation[namespace + '-utbetalingTotalbeloep-beloep']?.feilmelding}
            id='utbetalingTotalbeloep-beloep'
            label={t('label:utbetaling-totalbeloep')}
            namespace={namespace}
            onChanged={(value: string) => setBeloepValuta('utbetalingTotalbeloep', 'beloep', sanitizeAmount(value))}
            required
            value={sed.refusjonskrav?.kreditorinstitusjon?.utbetalingTotalbeloep?.beloep || ''}
          />
          <CurrencyDropdown
            ariaLabel={t('label:valuta')}
            closeMenuOnSelect
            currencyCodeListName="euEftaValuta"
            error={validation[namespace + '-utbetalingTotalbeloep-valuta']?.feilmelding}
            id={namespace + '-utbetalingTotalbeloep-valuta'}
            label={t('label:valuta')}
            locale='nb'
            onOptionSelected={(currency: Currency) => setBeloepValuta('utbetalingTotalbeloep', 'valuta', currency.value)}
            includeHistoricCurrencies
            sort={"noeuFirst"}
            required
            values={sed.refusjonskrav?.kreditorinstitusjon?.utbetalingTotalbeloep?.valuta}
          />
        </HGrid>

        <Input
          error={validation[namespace + '-betalingsreferanse']?.feilmelding}
          id='betalingsreferanse'
          label={t('label:betalingsref')}
          namespace={namespace}
          onChanged={setBetalingsreferanse}
          value={sed.refusjonskrav?.kreditorinstitusjon?.betalingsreferanse || ''}
        />
      </VStack>
    </Box>
  )
}

export default GlobaltKrav
