import {BaseReplySed} from 'declarations/sed'
import {PersonMedAdresser} from "./h";

// ===== §3 Type informasjon — valg mellom fremlegg og varsel om bostedsland =====

export type TypeInformasjon =
  | 'fremlegg_om_bostedsland'
  | 'varsel_om_bostedsland'

// Bosted-detaljer delt av fremlegg (§3.2) og varsel (§3.3): land, startdato og begrunnelse.
export interface Bosted {
  landkode?: string
  startdato?: string
  begrunnelse?: string
}

// ===== H003 SED — Forslag/melding om bostedsstat (H_BUC_02a) =====
// Bruker standard person- og adresseseksjon (bruker: PersonTypeH) og felles
// ytterligereInfo fra HSed. Kun §3 «type informasjon» er H003-spesifikk.

export interface H003Sed extends BaseReplySed {
  bruker: PersonMedAdresser
  ytterligereInfo?: string
  typeInformasjon?: TypeInformasjon
  fremlegg?: Bosted
  varsel?: Bosted
}
