import { BaseReplySed, PersonInfo } from 'declarations/sed'

// ===== H021 Person (uses standard PersonInfo with H021-specific PIN fields) =====

export interface H021Bruker {
  personInfo?: PersonInfo
}

// ===== BeloepValuta =====

export interface BeloepValuta {
  beloep?: string
  valuta?: string
}

// ===== Kreditorinstitusjon =====

export interface KreditorInstitusjon {
  id?: string
  navn?: string
  globalReferanse?: string
  betalingsreferanse?: string
  kravTotalbeloep?: BeloepValuta
  avvistKravTotalbeloep?: BeloepValuta
  utbetalingTotalbeloep?: BeloepValuta
}

// ===== Debitorinstitusjon =====

export interface DebitorInstitusjon {
  globalReferanse?: string
}

// ===== Avslag =====

export type HenvisningTilType =
  | 'anmodning_om_administrativ_kontroll'
  | 'anmodning_om_legeundersøkelse'

export type AvslagType =
  | 'ikke_avslag'
  | 'delvis_avslag'
  | 'totalt_avslag'

export type AvslagGrunnType =
  | 'denne_faktura_angår_ikke_oss'
  | 'ingen_betaling_gjelder_for_denne_faktura'
  | 'ikke_mottatt_svar_på_forespørsel'
  | 'informasjon_som_er_mottatt_er_ikke_i_overensstemmelse_med_orginalforespørsel'
  | 'annet'

export interface AvslagDetaljer {
  avvistBeloep?: BeloepValuta
  grunn?: AvslagGrunnType
  grunnAnnet?: string
}

// ===== Refusjon (single entry) =====

export interface H021RefusjonItem {
  henvisningTil?: HenvisningTilType
  utstedelsesdato?: string
  fakturanummer?: string
  fakturabeloep?: BeloepValuta
  avslag?: AvslagType
  avslagDetaljer?: AvslagDetaljer
}

// ===== Refusjonskrav (top-level) =====

export interface H021Refusjonskrav {
  kreditorinstitusjon?: KreditorInstitusjon
  debitorinstitusjon?: DebitorInstitusjon
  refusjoner?: Array<H021RefusjonItem>
  totaltAntallFakturaer?: string
}

// ===== H021 SED =====

export interface H021Sed extends BaseReplySed {
  bruker?: H021Bruker
  refusjonskrav?: H021Refusjonskrav
}
