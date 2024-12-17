import React from "react";
import {FlexCenterDiv, HorizontalSeparatorDiv} from "@navikt/hoykontrast";
import Flag from "@navikt/flagg-ikoner";
import CountryData from "@navikt/land-verktoy";
import {State} from "../../declarations/reducers";
import {useAppSelector} from "../../store";

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
    <FlexCenterDiv id={id}>
      {land && <Flag size='S' country={country ? country.value : "XU"} />}
      <HorizontalSeparatorDiv />
      {country ? country.label : countryCodeMap && land ? countryCodeMap[land as keyof typeof countryCodeMap] : land}
    </FlexCenterDiv>
  )
}

export default FlagPanel
