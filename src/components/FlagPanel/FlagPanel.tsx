import React from "react";
import Flag from "@navikt/flagg-ikoner";
import CountryData from "@navikt/land-verktoy";
import {State} from "../../declarations/reducers";
import {useAppSelector} from "../../store";
import {HStack} from "@navikt/ds-react";

export interface FlagPanelProps {
  id?: string
  land: string | undefined
}

export interface FlagPanelSelector {
  countryCodeMap: {key?: string} | null | undefined
}

const mapState = (state: State): FlagPanelSelector => ({
  countryCodeMap: state.app.countryCodeMap
})

const FlagPanel: React.FC<FlagPanelProps> = ({
  id,
  land
}: FlagPanelProps): JSX.Element => {
  const { countryCodeMap } = useAppSelector(mapState)
  const countryData = CountryData.getCountryInstance('nb')
  const country = countryData.findByValue3(land)

  return(
    <HStack gap="4" id={id} align="center">
      {land && <Flag size='S' country={country ? country.value : "XU"} />}
      {country ? country.label : countryCodeMap && land ? countryCodeMap[land as keyof typeof countryCodeMap] : land}
    </HStack>
  )
}

export default FlagPanel
