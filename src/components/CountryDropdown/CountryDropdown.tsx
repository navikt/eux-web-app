import React from "react";
import CountrySelect from "@navikt/landvelger";
import {Country} from "@navikt/land-verktoy";
import {State} from "../../declarations/reducers";
import {ReplySed} from "../../declarations/sed";
import {useAppSelector} from "../../store";
import {CountryCodeLists, CountryCodes} from "../../declarations/types";

export interface CountryDropdownSelector {
  replySed: ReplySed | null | undefined
  countryCodes: CountryCodes | null | undefined
}

const mapState = (state: State): CountryDropdownSelector => ({
  replySed: state.svarsed.replySed,
  countryCodes: state.app.countryCodes
})

export interface CountryDropdownProps {
  dataTestId: string
  error: string | undefined
  id: string
  label: string
  hideLabel: boolean
  values: string | undefined
  onOptionSelected: (selectedCountry: Country) => void
  countryCodeList: string
}

const CountryDropdown : React.FC<CountryDropdownProps> = ({
  dataTestId,
  error,
  id,
  label,
  hideLabel,
  values,
  onOptionSelected,
  countryCodeList
}: CountryDropdownProps) => {

  const {replySed, countryCodes} = useAppSelector(mapState)
  const cdmVersion = replySed?.sedVersjon ? replySed?.sedVersjon : replySed?.sak?.cdmVersjon

  return(
    <CountrySelect
      data-testid={dataTestId}
      error={error}
      id={id}
      includeList={countryCodes ? countryCodes["v" + cdmVersion! as keyof CountryCodes][countryCodeList as keyof CountryCodeLists] : []}
      label={label}
      hideLabel={hideLabel}
      menuPortalTarget={document.body}
      onOptionSelected={onOptionSelected}
      values={values}
    />
  )


}

export default CountryDropdown
