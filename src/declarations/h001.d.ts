import { BaseReplySed, PinMangler } from 'declarations/sed'
import {
  Dokumentasjon,
  PersonMedAdresser,
  PersonensStatus,
  Vedlegg
} from './h'

export type YtterligereInfoType = 'melding_om_mer_informasjon' | 'anmodning_om_tilleggsinformasjon'

export interface Anmodning {
  adresseTyper?: Array<'bosted' | 'opphold' | 'kontakt'>
  informasjonOmBruker?: Array<string>
  pin?: {
    sektor?: string
    annenSektor?: string
  }
  dokumentasjon?: Dokumentasjon
}

export interface EndredeForhold {
  personInfo?: {
    etternavn?: string
    fornavn?: string
    foedselsdato?: string
    kjoenn?: 'M' | 'K' | 'U'
    pinMangler?: PinMangler
    tidligereEtternavn?: string
    tidligereFornavn?: string
    statsborgerskap?: string
  }
  annet?: string
}

export interface Bruker extends PersonMedAdresser {
  aktivitetsstatus?: Array<PersonensStatus>
  aktivitetsstatusAnnet?: string
  anmodning?: Anmodning
  endredeForhold?: EndredeForhold
  ytterligereInfoType?: YtterligereInfoType
  ytterligereInfo?: string
  vedlegg?: Vedlegg
}

export interface H001Sed extends BaseReplySed {
  bruker: Bruker
}
