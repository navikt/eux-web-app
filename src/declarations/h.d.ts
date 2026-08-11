import { Adresse, PersonInfo } from 'declarations/sed'

// ===== §1 Person =====

export interface Person {
  personInfo: PersonInfo
}

export interface PersonMedAdresser extends Person {
  adresser?: Array<Adresse>
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

// ===== §3.4 Aktivitet =====

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

// ===== §3.8 Familiestatus =====

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

// ===== §3.1 Adresse med oppholds- og varighetsinformasjon (H005) =====

export interface AdresseMedVarighet {
  adresse?: Adresse
  oppholdetsVarighet?: string
  varighetUavbruttOpphold?: string
}

// ===== §3 Bosted-informasjon (felles felt) =====
// Shared bosted fields common to H005 «informasjonFastslaaBosted» and H006
// «positivtSvar». The two SEDs differ only in the address list type, which is
// added by the respective SED-specific interfaces (InformasjonFastslaaBosted /
// PositivtSvar).

export interface BostedInformasjon {
  personensStatus?: PersonensStatus
  personensStatusAnnet?: string
  aktiviteter?: Array<Aktivitet>
  inntektskildeStudenter?: string
  bosituasjonHvorPermanent?: string
  permanentOppholdSkattemessig?: string
  familiestatus?: Familiestatus
  grunnForFlytting?: string
}
