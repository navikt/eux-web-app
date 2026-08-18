import { BostedOpplysninger, Person } from './h'
import { BaseReplySed } from 'declarations/sed'

export interface PositivtSvar {
  bostedOpplysninger?: BostedOpplysninger
}

// ===== §4 Negativt svar på etterspurt informasjon =====

export interface NegativtSvar {
  opplysningerSomIkkeKanOversendes?: string
  grunn?: string
}

// ===== H006 SED — Svar på anmodning om informasjon om bosted (H_BUC_02a) =====

export interface H006Sed extends BaseReplySed {
  bruker: Person
  ytterligereInfo?: string
  svarPaaSedId?: string
  positivtSvar?: PositivtSvar
  negativtSvar?: NegativtSvar
}
