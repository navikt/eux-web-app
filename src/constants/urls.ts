// import { IS_DEVELOPMENT } from 'constants/environment'
// export const HOSTNAME = window.location.hostname
// export const BASE_HOST = HOSTNAME === 'localhost' && IS_DEVELOPMENT ? 'localhost:3002' : ''
// export const API_BASE_URL = BASE_HOST + '/api'
export const API_BASE_URL = '/api'

export const API_SAK_ARBEIDSFORHOLD_URL = API_BASE_URL + '/arbeidsforhold/%(fnr)s'
export const API_SAK_FAGSAKER_URL = API_BASE_URL + '/fagsaker/%(fnr)s/?sektor=%(sektor)s&tema=%(tema)s'
export const API_SAK_INSTITUSJONER_URL = API_BASE_URL + '/institusjoner/%(buctype)s/?landkode=%(landkode)s'
export const API_SAK_KODEVERK_URL = API_BASE_URL + '/kodeverk'
export const API_SAK_LANDKODER_URL = API_BASE_URL + '/landkoder/%(buctype)s'
export const API_SAK_PERSONER_URL = API_BASE_URL + '/personer/?fnr=%(fnr)s'
export const API_SAK_SEND_POST_URL = API_BASE_URL + '/rina/sak'

export const API_SAKSBEHANDLER_URL = API_BASE_URL + '/saksbehandler'

export const API_SERVERINFO_URL = API_BASE_URL + '/serverinfo'

export const API_VEDLEGG_POST_URL = API_BASE_URL + '/rina/vedlegg'
export const API_VEDLEGG_DOKUMENTER_URL = API_BASE_URL + '/rina/dokumenter/?rinasaksnummer=%(rinasaksnummer)s'