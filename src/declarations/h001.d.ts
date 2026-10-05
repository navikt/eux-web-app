import { BaseReplySed, Statsborgerskap } from 'declarations/sed'
import {
  Dokumentasjon,
  BasePersonInfo,
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

export interface EndringPersonInfo extends BasePersonInfo {
  statsborgerskap?: Array<Statsborgerskap>
}

export interface EndredeForhold {
  personInfo?: EndringPersonInfo
  annet?: string
}

export interface Bruker extends PersonMedAdresser {
  personensstatus?: Array<PersonensStatus>
  personensstatusAnnet?: string
  anmodning?: Anmodning
  endredeForhold?: EndredeForhold
  ytterligereInfoType?: YtterligereInfoType
  ytterligereInfo?: string
  vedlegg?: Vedlegg
}

export interface H001Sed extends BaseReplySed {
  bruker: Bruker
}
