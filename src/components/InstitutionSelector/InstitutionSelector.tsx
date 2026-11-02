import { HGrid, Loader, Select, VStack } from '@navikt/ds-react'
import { Country } from '@navikt/land-verktoy'
import { getInstitusjoner } from 'actions/sak'
import CountryDropdown from 'components/CountryDropdown/CountryDropdown'
import { State } from 'declarations/reducers'
import { Institusjon } from 'declarations/types'
import _ from 'lodash'
import React, { JSX, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

interface InstitutionSelectorSelector {
  institusjonList: State['sak']['institusjonList']
  gettingInstitusjoner: State['loading']['gettingInstitusjoner']
}

const mapState = (state: State): InstitutionSelectorSelector => ({
  institusjonList: state.sak.institusjonList,
  gettingInstitusjoner: state.loading.gettingInstitusjoner
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
  onLandkodeChanged,
  onInstitutionSelected
}: InstitutionSelectorProps): JSX.Element => {
  const { institusjonList, gettingInstitusjoner } = useAppSelector(mapState)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const landkodeId = `${namespace}-${id}-landkode`
  const institusjonId = `${namespace}-${id}-id`

  useEffect(() => {
    if (bucType && landkode) {
      dispatch(getInstitusjoner(bucType, landkode))
    }
  }, [bucType, landkode])

  const institusjoner: Array<Institusjon> = landkode ? _.orderBy(institusjonList ?? [], 'navn') : []
  const valueMissingFromList: boolean = !!value && !gettingInstitusjoner &&
    !institusjoner.some((i: Institusjon) => i.institusjonsID === value)

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedId = event.target.value
    onInstitutionSelected(institusjoner.find((i: Institusjon) => i.institusjonsID === selectedId))
  }

  return (
    <HGrid columns={2} gap="space-16" align="start">
      <CountryDropdown
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
      <VStack gap="space-8">
        <Select
          data-testid={institusjonId}
          id={institusjonId}
          disabled={!bucType || !landkode || gettingInstitusjoner}
          error={error}
          label={(label ?? t('label:institusjon')) + (required ? ' *' : '')}
          onChange={onChange}
          value={value ?? ''}
        >
          <option value=''>{t('label:velg')}</option>
          {valueMissingFromList && (
            <option value={value}>{valueNavn ?? value}</option>
          )}
          {institusjoner.map((i: Institusjon) => (
            <option value={i.institusjonsID} key={i.institusjonsID}>
              {i.navn}
            </option>
          ))}
        </Select>
        {gettingInstitusjoner && <Loader size="small" />}
      </VStack>
    </HGrid>
  )
}

export default InstitutionSelector
