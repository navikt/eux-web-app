import { AdresseType, BaseReplySed } from 'declarations/sed'
import { PersonMedAdresser } from './h'

export type YtterligereInfoType = 'melding_om_mer_informasjon' | 'admodning_om_mer_informasjon'

export interface AdresseTyper {
  adresseTyper?: Array<AdresseType>
}

export interface Anmodning {
  dokumentasjon: {
    informasjon: string
    dokument: string
    sed: string
  }
  adresse: AdresseTyper
}

export interface H001Sed extends BaseReplySed {
  bruker: PersonMedAdresser
  ytterligereInfo?: string
  anmodning?: Anmodning
  ytterligereInfoType?: YtterligereInfoType
}
