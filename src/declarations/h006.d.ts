import { BostedInformasjon, Person } from './h'
import { Adresse, BaseReplySed } from 'declarations/sed'

// ===== §3 Positivt svar på etterspurt informasjon =====

export interface PositivtSvar extends BostedInformasjon {
  adresser?: Array<Adresse>
}

// ===== §4 Negativt svar på etterspurt informasjon =====

export interface NegativtSvar {
  kunneIkkeVideresendeInformasjon?: string
  grunner?: string
}

// ===== H006 SED — Svar på anmodning om informasjon om bosted (H_BUC_02a) =====

export interface H006Sed extends BaseReplySed {
  bruker: Person
  ytterligereInfo?: string
  svarPaaSedId?: string
  positivtSvar?: PositivtSvar
  negativtSvar?: NegativtSvar
}
