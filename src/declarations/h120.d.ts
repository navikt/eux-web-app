import { HSed } from 'declarations/sed'

// ===== Berørt ytelse (Section 2) =====

export type BeroertYtelseType =
  | 'sykepenger_som_kontantytelse_i_forbindelse_med_arbeidsuførhet'
  | 'foreldrepenger_til_mor_eller_far'
  | 'kontantytelser_ved_langtidspleie'
  | 'uførepensjon'
  | 'alderspensjon'
  | 'etterlattepensjon'
  | 'kontantytelser_ved_yrkesskade_eller_yrkessykdom_som_nevnt_i_artikkel_33_1_nr_987_2009'
  | 'adre_kontantytelser_ved_yrkesskade_eller_yrkessykdom'
  | 'dagpenger'
  | 'førtidspensjon'
  | 'familieytelse'
  | 'spesiell_innskuddsfri_kontantytelse'
  | 'sykepenger_kontantytelser'

// ===== Kravets art (Section 3) =====

export type EtterspurtHandlingType =
  | 'informer_oss_om_estimerte_kostnader_for_medisinsk_dokumentasjon_legeundersøkelse'
  | 'utfør_legeundersøkelse'
  | 'send_oss_den_medisinske_informasjonen_dokumentasjonen'

export type EtterspurtDokumentasjonType =
  | 'standard_medisinsk_rapport'
  | 'utførlig_medisinsk_rapport'
  | 'medisinsk_rapport_angående_familieytelser'
  | 'bilateralt_avtalt_medisinsk_rapport'
  | 'annen_medisinsk_dokumentasjon'

export interface KravetsArt {
  etterspurtHandling?: Array<EtterspurtHandlingType>
  etterspurtDokumentasjon?: Array<EtterspurtDokumentasjonType>
  annenDokumentasjon?: string
  spesielleKravTilDokumentasjon?: string
}

// ===== AWOD — Arbeidsulykke/yrkessykdom (Section 4) =====

export type AWODType = 'arbeidsulykke' | 'yrkessykdom'

export type BrukerStatusType =
  | 'arbeidstaker'
  | 'selvstendig_næringsdrivende'
  | 'offentlig_ansatt'
  | 'grensearbeider'
  | 'annet'

export type ArbeidsgiverIdentifikatorType = 'registrering' | 'trygd' | 'skatt' | 'ukjent'

export interface ArbeidsgiverIdentifikator {
  type?: ArbeidsgiverIdentifikatorType
  id?: string
}

export interface ArbeidsgiverAdresse {
  gate?: string
  bygning?: string
  postnummer?: string
  region?: string
  by?: string
  landkode?: string
}

export interface Arbeidsgiver {
  navn?: string
  adresse?: ArbeidsgiverAdresse
  identifikator?: Array<ArbeidsgiverIdentifikator>
}

export interface Arbeidsulykkeyrkessykdom {
  type?: AWODType
  dato?: string
  brukerStatus?: BrukerStatusType
  brukerStatusAnnet?: string
  sykdomKode?: string
  sykdomKodingssystem?: string
  konsekvensEllerBeskrivelse?: string
  arbeidsgiver?: Arbeidsgiver
}

// ===== Informasjon om anmodningen (Section 5) =====

export type DekningKostnaderType = 'ja' | 'nei' | 'gjelder_ikke'

export interface AnmodningInfo {
  gjelderArbeidsufoerhet?: boolean
  periodeStartdato?: string
  periodeSluttdato?: string
  dekningKostnader?: DekningKostnaderType
}

// ===== Familie (Section 6) =====

export type FamilieEtterspurtDokumentasjonType =
  | 'grad_av_selvhjulpenhet'
  | 'grad_av_hjelpebehov'
  | 'årsak_til_uførhet'
  | 'uføretidspunkt_eller_endring_i_uføregrad'
  | 'fysiske_og_mentale_evner'
  | 'grad_av_mentale_og_fysiske_evner'
  | 'dato_når_dette_beløpet_ble_nådd'
  | 'er_dette_beløpet_permanent'
  | 'trengs_ny_undersøkelse_hvis_ja_når'
  | 'prognose'
  | 'grad_av_inntektsevne'

export interface Familie {
  etterspurtDokumentasjon?: Array<FamilieEtterspurtDokumentasjonType>
  annenDokumentasjon?: string
}

// ===== H120 SED =====

export interface H120Sed extends HSed {
  beroertYtelse?: BeroertYtelseType
  kravetsArt?: KravetsArt
  arbeidsulykkeyrkessykdom?: Arbeidsulykkeyrkessykdom
  anmodningInfo?: AnmodningInfo
  familie?: Familie
}
