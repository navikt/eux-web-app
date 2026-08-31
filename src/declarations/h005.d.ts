import { BostedOpplysninger, Person } from './h'
import { BaseReplySed } from 'declarations/sed'

export interface Anmodning {
  bostedOpplysninger?: BostedOpplysninger
}

// ===== H005 SED — Anmodning om informasjon om bosted (H_BUC_02a) =====

export interface H005Sed extends BaseReplySed {
  bruker: Person
  ytterligereInfo?: string
  informasjonDetAnmodesOm?: string
  anmodning?: Anmodning
}
