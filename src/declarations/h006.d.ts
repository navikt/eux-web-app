import { Adresse, BaseReplySed, PersonInfo } from 'declarations/sed'

// ===== H006 Bruker (§1 Person) — samme struktur som H005 =====

export interface Bruker {
  personInfo: PersonInfo
}

// ===== §3.2 Personens status =====

export type PersonensStatus =
  | 'ansatt'
  | 'selvstendig_næringsdrivende'
  | 'grensearbeider'
  | 'pensjonist'
  | 'person_som_krever_pensjon'
  | 'arbeidsledig'
  | 'familiemedlem_forsørget'
  | 'student'
  | 'annet'

// ===== §3.3 Aktivitet =====

export type AktivitetType =
  | 'inntektsgivende_virksomhet'
  | 'ikke_inntektsgivende_virksomhet'

export interface Aktivitet {
  type?: AktivitetType
  beskrivelse?: string
  sted?: string
  varighet?: string
  art?: string
}

// ===== §3.5 Familiestatus =====

export interface Familiemedlem {
  familiemedlem?: string
  bosted?: string
}

export interface Barn {
  familiemedlem?: string
  bosted?: string
  skolekrets?: string
}

export interface Familiestatus {
  ektefelle?: Familiemedlem
  barn?: Barn
}

// ===== §3 Positivt svar på etterspurt informasjon =====

export interface PositivtSvar {
  adresser?: Array<Adresse>
  personensStatus?: PersonensStatus
  personensStatusAnnet?: string
  aktiviteter?: Array<Aktivitet>
  inntektskildeStudenter?: string
  bosituasjonHvorPermanent?: string
  permanentOppholdSkattemessig?: string
  familiestatus?: Familiestatus
  grunnForFlytting?: string
}

// ===== §4 Negativt svar på etterspurt informasjon =====

export interface NegativtSvar {
  kunneIkkeVideresendeInformasjon?: string
  grunner?: string
}

// ===== H006 SED — Svar på anmodning om informasjon om bosted (H_BUC_02a) =====

export interface H006Sed extends BaseReplySed {
  bruker: Bruker
  svarPaaSedId?: string
  positivtSvar?: PositivtSvar
  negativtSvar?: NegativtSvar
  ytterligereInfo?: string
}
