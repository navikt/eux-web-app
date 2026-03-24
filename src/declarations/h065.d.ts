import { HSed } from 'declarations/sed'

// ===== Overførings-destinasjon (Section 4) =====

export type TilType = 'kompetent_institusjon' | 'bostedsinstitusjon' | 'kontaktinstitusjon'

// ===== Informasjon angår ytelse (Section 5) =====

export type InformasjonAngaarYtelseType =
  | 'lovvalg'
  | 'sykepenger_kontantytelse'
  | 'naturalytelser'
  | 'kontantytelse_for_arbeidsulykke_eller_yrkessykdom'
  | 'naturalytelse_knyttet_til_yrkesskade_eller_yrkessykdom'
  | 'foreldrepenger_til_mor_far'
  | 'ytelse_til_langtidspleie'
  | 'uførepensjon'
  | 'alderspensjon'
  | 'etterlattepensjon'
  | 'gravferdsstønad'
  | 'dagpenger'
  | 'førtidspensjon'
  | 'familieytelse'
  | 'spesiell_innskuddsfri_kontantytelse'
  | 'annen_ytelse'

// ===== Annen korrespondanse (Section 5) =====

export type AnnenKorrespondanseType =
  | 'motregning_av_innskudd'
  | 'motregning_av_ytelser'
  | 'tilbakekreving'
  | 'annet'

// ===== Dokumenter vedlagt (Section 6) =====

export type DokumenterVedlagtType =
  | 'søknad'
  | 'dødsattest'
  | 'fakturaer'
  | 'ligningsattest'
  | 'krav'
  | 'medisinsk_dokumentasjon'
  | 'arbeidsattest'
  | 'fødselsattest'
  | 'ekteskapsattest'
  | 'vitnemål'
  | 'medisinsk_rapport'
  | 'legeattest'
  | 'annet'

// ===== H065 interfaces =====

export interface Til {
  type?: TilType
  institusjon?: {
    id?: string
    navn?: string
  }
}

export interface InformasjonAngaarYtelse {
  type?: InformasjonAngaarYtelseType
  andre?: string
}

export interface AnnenKorrespondanse {
  type?: AnnenKorrespondanseType
  andre?: string
}

export interface DokumenterVedlagt {
  type?: Array<DokumenterVedlagtType>
  annet?: Array<string>
}

export interface OverfoeringInfo {
  erBrukerSoekeren?: string
  mottaksdato?: string
  grunnerForOverfoering?: string
  til?: Til
  informasjonAngaarYtelse?: InformasjonAngaarYtelse
  annenKorrespondanse?: AnnenKorrespondanse
  dokumenterVedlagt?: DokumenterVedlagt
}

// ===== H065 SED =====

export interface H065Sed extends HSed {
  overfoeringInfo?: OverfoeringInfo
}
