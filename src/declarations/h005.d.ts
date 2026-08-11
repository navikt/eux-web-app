import { AdresseMedVarighet, BostedInformasjon, Person } from './h'
import { BaseReplySed } from 'declarations/sed'

// ===== §3 Informasjon for å fastslå bosted =====

export interface InformasjonFastslaaBosted extends BostedInformasjon {
  adresser?: Array<AdresseMedVarighet>
}

// ===== H005 SED — Anmodning om informasjon om bosted (H_BUC_02a) =====

export interface H005Sed extends BaseReplySed {
  bruker: Person
  ytterligereInfo?: string
  anmodningOmInformasjon?: string
  informasjonFastslaaBosted?: InformasjonFastslaaBosted
}
