import React from "react";
import CountrySelect, {CountrySelectProps} from "../landvelger";
import {State} from "../../declarations/reducers";
import {ReplySed} from "../../declarations/sed";
import {useAppSelector} from "../../store";
import {CurrencyCodeLists, CurrencyCodes} from "../../declarations/types";

export interface CurrencyDropdownSelector {
  replySed: ReplySed | null | undefined
  currencyCodes: CurrencyCodes | null | undefined
  cdmVersjonApp: string | undefined
}

const mapState = (state: State): CurrencyDropdownSelector => ({
  replySed: state.svarsed.replySed,
  currencyCodes: state.app.currencyCodes,
  cdmVersjonApp: state.app.cdmVersjon
})

export interface CurrencyDropdownProps extends CountrySelectProps<any> {
  dataTestId?: string
  /** Hvilken valuta-liste som skal brukes som tillatte valg.
   * 'euEftaValuta' = EU/EFTA-valutaer, 'verdensValuta' = alle valutaer akseptert av Rina. */
  currencyCodeListName?: keyof CurrencyCodeLists
  menuPortalTarget?: HTMLElement | null
  includeHistoricCurrencies?: boolean
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  currencyCodeListName = 'verdensValuta',
  dataTestId,
  menuPortalTarget = document.body,
  includeHistoricCurrencies = true,
  ...rest
}: CurrencyDropdownProps) => {

  const {replySed, currencyCodes, cdmVersjonApp} = useAppSelector(mapState)

  const cdm = replySed?.sak?.cdmVersjon ? replySed?.sak?.cdmVersjon : cdmVersjonApp
  const version = cdm ? "v" + cdm : undefined

  // Bygg en includeList med valutakoder slik @navikt/landvelger forventer for type='currency'.
  const allowedCurrencies = currencyCodes && version
    ? currencyCodes[version as keyof CurrencyCodes]?.[currencyCodeListName]
    : undefined

  const includeList = allowedCurrencies
    ? allowedCurrencies.map(c => c.valutakode)
    : rest.includeList

  return (
    <CountrySelect
      {...rest}
      type='currency'
      menuPortalTarget={menuPortalTarget}
      data-testid={dataTestId}
      includeList={includeList}
      includeHistoricCurrencies={includeHistoricCurrencies}
    />
  )
}

export default CurrencyDropdown
