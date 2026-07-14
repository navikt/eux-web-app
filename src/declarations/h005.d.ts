import { AdresseMedVarighet, BostedInformasjon, Bruker } from 'declarations/hbuc02a'
import { BaseReplySed } from 'declarations/sed'

// ===== §3 Informasjon for å fastslå bosted =====

export interface InformasjonFastslaaBosted extends BostedInformasjon {
  adresser?: Array<AdresseMedVarighet>
}

// ===== H005 SED — Anmodning om informasjon om bosted (H_BUC_02a) =====

export interface H005Sed extends BaseReplySed {
  bruker: Bruker
  anmodningOmInformasjon?: string
  informasjonFastslaaBosted?: InformasjonFastslaaBosted
  ytterligereInfo?: string
}
