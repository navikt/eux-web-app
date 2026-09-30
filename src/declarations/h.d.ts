import { Adresse, PersonInfo } from 'declarations/sed'

// ===== §1 Person =====

export interface Person {
  personInfo: PersonInfo
}

export interface PersonMedAdresser extends Person {
  adresser?: Array<Adresse>
}

export interface Dokumentasjon {
  dato?: string
  dokument?: string
  informasjon?: string
  sed?: string
}

export type VedleggType =
  | 'søknad'
  | 'dødsattest'
  | 'fakturaer'
  | 'ligningsattest'
  | 'krav'
  | 'medisinsk_dokumentasjon'
  | 'arbeidsattest'
  | 'fødselsattest'
  | 'ekteskapsattest'
  | 'vitnemål'
  | 'medisinsk_rapport'
  | 'legeattest'
  | 'annet'

export interface Vedlegg {
  type?: Array<VedleggType>
  andreDokumenter?: Array<string>
}

// ===== §3.2 Personens status =====

export type PersonensStatus =
  | 'ansatt'
  | 'selvstendig_næringsdrivende'
  | 'grensearbeider'
  | 'tidligere_grensearbeider'
  | 'pensjonist'
  | 'person_som_krever_pensjon'
  | 'arbeidsledig'
  | 'familiemedlem_forsørget'
  | 'familiemedlem_til_arbeidstaker'
  | 'familiemedlem_til_pensjonist'
  | 'student'
  | 'ikke_yrkesaktiv_person'
  | 'annet'

// ===== §3.4 Aktivitet =====

export type AktivitetType =
  | 'inntektsgivende_virksomhet'
  | 'ikke_inntektsgivende_virksomhet'

export interface Aktivitet {
  type?: PersonensStatus
  annet?: string
  presiseringer?: Array<Presisering>
}

export interface Presisering {
  inntektsgivende?: AktivitetType
  beskrivelse?: string
  sted?: string
  varighet?: string
  art?: string
}

// ===== Familie =====

export interface Ektefelle {
  navn?: string
  bosted?: string
}

export interface BarnBosted {
  navn?: string
  bosted?: string
  skolested?: string
}

// ===== Oppholdssted =====

export interface Oppholdssted {
  adresse?: Adresse
  oppholdetsVarighet?: string
  varighetUavbruttOpphold?: string
}

export interface BostedOpplysninger {
  oppholdssteder?: Array<Oppholdssted>
  aktivitet?: Aktivitet
  inntektskildeHvisStudent?: string
  hvorPermanentBostedetEr?: string
  ektefelle?: Ektefelle
  barn?: BarnBosted
  antattFlyttegrunn?: string
  skattemessigGrunn?: string
}
