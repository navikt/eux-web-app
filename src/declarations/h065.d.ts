import { HSed } from 'declarations/sed'

// ===== Overførings-destinasjon (Section 4) =====

export type H065TilType = 'kompetent_institusjon' | 'bostedsinstitusjon' | 'kontaktinstitusjon'

// ===== Informasjon angår ytelse (Section 5) =====

export type H065InformasjonAngaarYtelseType =
  | 'lovvalg'
  | 'sykdom'
  | 'familieytelser'
  | 'pensjon'
  | 'dagpenger'
  | 'yrkesskade'
  | 'andre'

// ===== Annen korrespondanse (Section 5) =====

export type H065AnnenKorrespondanseType = 'motregning_av_innskudd' | 'andre'

// ===== Dokumenter vedlagt (Section 6) =====

export type H065DokumenterVedlagtType = 'søknad' | 'vedtak' | 'medisinsk_rapport' | 'annet'

// ===== H065 interfaces =====

export interface H065OverfoeringInfo {
  erBrukerSoekeren?: string
  mottaksdato?: string
  grunnerForOverfoering?: string
  til?: H065Til
  informasjonAngaarYtelse?: H065InformasjonAngaarYtelse
  annenKorrespondanse?: H065AnnenKorrespondanse
  dokumenterVedlagt?: H065DokumenterVedlagt
}

export interface H065Til {
  type?: H065TilType
  institusjon?: {
    id?: string
    navn?: string
  }
}

export interface H065InformasjonAngaarYtelse {
  type?: H065InformasjonAngaarYtelseType
  andre?: string
}

export interface H065AnnenKorrespondanse {
  type?: H065AnnenKorrespondanseType
  andre?: string
}

export interface H065DokumenterVedlagt {
  type?: Array<H065DokumenterVedlagtType>
  annet?: Array<string>
}

// ===== H065 SED =====

export interface H065Sed extends HSed {
  overfoeringInfo?: H065OverfoeringInfo
}
