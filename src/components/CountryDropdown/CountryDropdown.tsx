import React from "react";
import CountrySelect, {CountrySelectProps} from "@navikt/landvelger";
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

export interface CountryDropdownProps extends CountrySelectProps<any>{
  dataTestId?: string
  countryCodeListName?: string
}

const CountryDropdown : React.FC<CountryDropdownProps> = ({
  countryCodeListName, dataTestId, ...rest
}: CountryDropdownProps) => {

  const {replySed, countryCodes} = useAppSelector(mapState)
  const cdmVersion = replySed?.sedVersjon ? replySed?.sedVersjon : replySed?.sak?.cdmVersjon
  const version = cdmVersion ? "v" + cdmVersion : undefined

  const includeList = countryCodeListName && countryCodes && version ? countryCodes[version as keyof CountryCodes][countryCodeListName as keyof CountryCodeLists] : rest.includeList

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
