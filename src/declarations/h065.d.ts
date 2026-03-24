import { HSed } from 'declarations/sed'

// ===== Overføring info (Section) =====

export interface Til {
  type?: string
  institusjon?: {
    id?: string
    navn?: string
  }
}

export interface InformasjonAngaarYtelse {
  type?: string
  andre?: string
}

export interface AnnenKorrespondanse {
  type?: string
  andre?: string
}

export interface DokumenterVedlagt {
  type?: Array<string>
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
