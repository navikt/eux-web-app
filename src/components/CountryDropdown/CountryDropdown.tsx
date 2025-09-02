import React from "react";
import CountrySelect, {CountrySelectProps} from "@navikt/landvelger";
import {State} from "../../declarations/reducers";
import {ReplySed} from "../../declarations/sed";
import {useAppSelector} from "../../store";
import {CountryCodeLists, CountryCodes, SimpleCountry} from "../../declarations/types";

export interface CountryDropdownSelector {
  replySed: ReplySed | null | undefined
  countryCodes: CountryCodes | null | undefined
  cdmVersjonApp: string | undefined
}

const mapState = (state: State): CountryDropdownSelector => ({
  replySed: state.svarsed.replySed,
  countryCodes: state.app.countryCodes,
  cdmVersjonApp: state.app.cdmVersjon

})

export interface CountryDropdownProps extends CountrySelectProps<any>{
  dataTestId?: string
  countryCodeListName?: string
  excludeNorway?: boolean
  menuPortalTarget?: HTMLElement | null
}

const CountryDropdown : React.FC<CountryDropdownProps> = ({
  countryCodeListName,
  dataTestId,
  excludeNorway = false,
  menuPortalTarget = document.body,
  ...rest
}: CountryDropdownProps) => {

  const {replySed, countryCodes, cdmVersjonApp} = useAppSelector(mapState)

  const cdm = replySed?.sak?.cdmVersjon ? replySed?.sak?.cdmVersjon : cdmVersjonApp
  const version = cdm ? "v" + cdm : undefined

  let includeList = countryCodeListName && countryCodes && version ? countryCodes[version as keyof CountryCodes][countryCodeListName as keyof CountryCodeLists] : rest.includeList

  if(countryCodeListName && excludeNorway){
    includeList = includeList?.filter((country: SimpleCountry) => country.landkode !== 'NOR')
  } else {!countryCodeListName && excludeNorway} {
    includeList = includeList?.filter((it: string) => it !== 'NOR')
  }

  return(
    <CountrySelect
      {...rest}
      menuPortalTarget={menuPortalTarget}
      data-testid={dataTestId}
      includeList={includeList}
      useAlpha3Value={true}
    />
  )


}

export default CountryDropdown
