import { HGrid, Loader, Select, VStack } from '@navikt/ds-react'
import { Country } from '@navikt/land-verktoy'
import { getInstitusjoner, releaseInstitusjoner } from 'actions/sak'
import CountryDropdown from 'components/CountryDropdown/CountryDropdown'
import { State } from 'declarations/reducers'
import { Institusjon } from 'declarations/types'
import _ from 'lodash'
import React, { JSX, useEffect, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

interface InstitutionSelectorSelector {
  institusjonRequests: State['sak']['institusjonRequests']
}

const mapState = (state: State): InstitutionSelectorSelector => ({
  institusjonRequests: state.sak.institusjonRequests
})

export interface InstitutionSelectorProps {
  namespace: string
  // Base id; the fields get ids `${namespace}-${id}-landkode` and `${namespace}-${id}-id`
  id: string
  bucType: string | undefined
  landkode: string | undefined
  countryCodeListName?: string
  value: string | undefined
  // Shown as the selected option if `value` is not in the fetched list (e.g. a SED saved with another country)
  valueNavn?: string
  landkodeLabel?: string
  label?: string
  landkodeError?: string
  error?: string
  required?: boolean
  // Fixed-country mode: only the institution select is rendered, `landkode` is used as given
  hideCountrySelector?: boolean
  onLandkodeChanged: (landkode: string) => void
  onInstitutionSelected: (institusjon: Institusjon | undefined) => void
}

const InstitutionSelector: React.FC<InstitutionSelectorProps> = ({
  namespace,
  id,
  bucType,
  landkode,
  countryCodeListName = 'euEftaLand',
  value,
  valueNavn,
  landkodeLabel,
  label,
  landkodeError,
  error,
  required,
  hideCountrySelector = false,
  onLandkodeChanged,
  onInstitutionSelected
}: InstitutionSelectorProps): JSX.Element => {
  const { institusjonRequests } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const consumerId = useId()
  const landkodeId = `${namespace}-${id}-landkode`
  const institusjonId = `${namespace}-${id}-id`

  useEffect(() => {
    if (bucType && landkode) {
      dispatch(getInstitusjoner(bucType, landkode, consumerId))
      return () => {
        dispatch(releaseInstitusjoner(bucType, landkode, consumerId))
      }
    }
  }, [bucType, landkode, consumerId, dispatch])

  const request = bucType && landkode ? institusjonRequests[`${bucType}:${landkode}`] : undefined
  const gettingInstitusjoner = !!request?.loading
  const institusjoner: Array<Institusjon> = _.orderBy(request?.institusjoner ?? [], 'navn')
  const valueMissingFromList: boolean = !!value && !gettingInstitusjoner &&
    !institusjoner.some((i: Institusjon) => i.institusjonsID === value)

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    if (!request?.institusjoner || gettingInstitusjoner) {
      return
    }
    const selectedId = event.target.value
    const institusjon = institusjoner.find((i: Institusjon) => i.institusjonsID === selectedId)
    if (!selectedId || institusjon) {
      onInstitutionSelected(institusjon)
    }
  }

  const institusjonSelect = (
    <VStack gap="space-8">
      <Select
        data-testid={institusjonId}
        id={institusjonId}
        disabled={!bucType || !landkode || !request?.institusjoner || gettingInstitusjoner}
        error={error}
        label={(label ?? t('label:institusjon')) + (required ? ' *' : '')}
        onChange={onChange}
        value={value ?? ''}
      >
        <option value=''>{t('label:velg')}</option>
        {valueMissingFromList && (
          <option value={value} disabled>{valueNavn ?? value}</option>
        )}
        {institusjoner.map((i: Institusjon) => (
          <option value={i.institusjonsID} key={i.institusjonsID}>
            {i.navn}
          </option>
        ))}
      </Select>
      {gettingInstitusjoner && <Loader size="small" />}
    </VStack>
  )

  if (hideCountrySelector) {
    return institusjonSelect
  }

  return (
    <HGrid columns={2} gap="space-16" align="start">
      <CountryDropdown
        // CountrySelect passes `undefined` to react-select when empty, which keeps the previous
        // selection; remount when the country is cleared so the dropdown is actually reset
        key={landkode ? 'landkode-selected' : 'landkode-empty'}
        closeMenuOnSelect
        data-testid={landkodeId}
        id={landkodeId}
        countryCodeListName={countryCodeListName}
        label={landkodeLabel ?? t('label:land')}
        required={required}
        error={landkodeError}
        onOptionSelected={(country: Country) => onLandkodeChanged(country.value3)}
        flagWave
        values={landkode ?? null}
      />
      {institusjonSelect}
    </HGrid>
  )
}

export default InstitutionSelector
