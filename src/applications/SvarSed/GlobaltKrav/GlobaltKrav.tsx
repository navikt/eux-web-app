import { Box, Heading, HGrid, VStack } from '@navikt/ds-react'
import { resetValidation, setValidation } from 'actions/validation'
import { validateGlobaltKrav, ValidationGlobaltKravProps } from 'applications/SvarSed/GlobaltKrav/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import Input from 'components/Forms/Input'
import { State } from 'declarations/reducers'
import { H021Sed } from 'declarations/h021'
import CountrySelect from '@navikt/landvelger'
import { Currency } from '@navikt/land-verktoy'
import { ALLOWED_CURRENCIES } from 'constants/currencies'
import { sanitizeAmount } from 'utils/amount'
import useUnmount from 'hooks/useUnmount'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import performValidation from 'utils/performValidation'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const GlobaltKrav: React.FC<MainFormProps> = ({
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
  const namespace = `${parentNamespace}-${personID}-globaltkrav`
  const sed = replySed as H021Sed

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

        <HGrid columns={2} gap="space-16" align="start">
          <Input
            error={validation[namespace + '-kreditorinstitusjon-id']?.feilmelding}
            id='kreditorinstitusjon-id'
            label={t('label:institusjonens-id')}
            namespace={namespace}
            onChanged={(value: string) => setKreditorProp('id', value.trim())}
            required
            value={sed.refusjonskrav?.kreditorinstitusjon?.id || ''}
          />
          <Input
            error={validation[namespace + '-kreditorinstitusjon-navn']?.feilmelding}
            id='kreditorinstitusjon-navn'
            label={t('label:institusjonens-navn')}
            namespace={namespace}
            onChanged={(value: string) => setKreditorProp('navn', value.trim())}
            required
            value={sed.refusjonskrav?.kreditorinstitusjon?.navn || ''}
          />
        </HGrid>

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

        <Input
          error={validation[namespace + '-totaltAntallFakturaer']?.feilmelding}
          id='totaltAntallFakturaer'
          label={t('label:totalt-antall-fakturaer')}
          namespace={namespace}
          onChanged={setTotaltAntallFakturaer}
          required
          value={sed.refusjonskrav?.totaltAntallFakturaer || ''}
        />

        <Heading size='xsmall'>
          {t('label:utbetaling')}
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
          <CountrySelect
            ariaLabel={t('label:valuta')}
            closeMenuOnSelect
            error={validation[namespace + '-kravTotalbeloep-valuta']?.feilmelding}
            id={namespace + '-kravTotalbeloep-valuta'}
            label={t('label:valuta')}
            locale='nb'
            menuPortalTarget={document.body}
            onOptionSelected={(currency: Currency) => setBeloepValuta('kravTotalbeloep', 'valuta', currency.value)}
            type='currency'
            includeList={ALLOWED_CURRENCIES}
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
          <CountrySelect
            ariaLabel={t('label:valuta')}
            closeMenuOnSelect
            error={validation[namespace + '-avvistKravTotalbeloep-valuta']?.feilmelding}
            id={namespace + '-avvistKravTotalbeloep-valuta'}
            label={t('label:valuta')}
            locale='nb'
            menuPortalTarget={document.body}
            onOptionSelected={(currency: Currency) => setBeloepValuta('avvistKravTotalbeloep', 'valuta', currency.value)}
            type='currency'
            includeList={ALLOWED_CURRENCIES}
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
          <CountrySelect
            ariaLabel={t('label:valuta')}
            closeMenuOnSelect
            error={validation[namespace + '-utbetalingTotalbeloep-valuta']?.feilmelding}
            id={namespace + '-utbetalingTotalbeloep-valuta'}
            label={t('label:valuta')}
            locale='nb'
            menuPortalTarget={document.body}
            onOptionSelected={(currency: Currency) => setBeloepValuta('utbetalingTotalbeloep', 'valuta', currency.value)}
            type='currency'
            includeList={ALLOWED_CURRENCIES}
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
