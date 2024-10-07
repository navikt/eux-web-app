import React from "react";
import CountrySelect, {CountrySelectProps} from "@navikt/landvelger";
import {State} from "../../declarations/reducers";
import {ReplySed} from "../../declarations/sed";
import {useAppSelector} from "../../store";
import {CountryCodeLists, CountryCodes, SimpleCountry} from "../../declarations/types";

export interface CountryDropdownSelector {
  replySed: ReplySed | null | undefined
  countryCodes: CountryCodes | null | undefined
}

const mapState = (state: State): CountryDropdownSelector => ({
  replySed: state.svarsed.replySed,
  countryCodes: state.app.countryCodes
})

export interface CountryDropdownProps extends CountrySelectProps<any>{
  dataTestId?: string
  countryCodeListName?: string
  excludeNorway?: boolean
  cdmVersion?: string
}

const CountryDropdown : React.FC<CountryDropdownProps> = ({
  countryCodeListName,
  dataTestId,
  excludeNorway = false,
  cdmVersion,
  ...rest
}: CountryDropdownProps) => {

  const {replySed, countryCodes} = useAppSelector(mapState)
  const cdm = cdmVersion ? cdmVersion : replySed?.sak?.cdmVersjon
  const version = cdm ? "v" + cdm : undefined

  let includeList = countryCodeListName && countryCodes && version ? countryCodes[version as keyof CountryCodes][countryCodeListName as keyof CountryCodeLists] : rest.includeList

  if(countryCodeListName && excludeNorway){
    includeList = includeList?.filter((country: SimpleCountry) => country.landkode !== 'NO')
  } else {!countryCodeListName && excludeNorway} {
    includeList = includeList?.filter((it: string) => it !== 'NO')
  }

  return(
    <CountrySelect
      {...rest}
      menuPortalTarget={document.body}
      data-testid={dataTestId}
      includeList={includeList}
    />
  )


}

export default CountryDropdown
