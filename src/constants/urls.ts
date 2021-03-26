export const HOST = window.location.hostname
const FULL_HOST = window.location.protocol + '//' + HOST
export const BASE_URL = FULL_HOST + (window.location.port ? ':' + window.location.port : '')

export const API_BASE_URL = '/api'

// See https://eux-helloeu-app-q2.nais.preprod.local/swagger-ui.html

// RINA
export const API_SAK_INSTITUSJONER_URL = API_BASE_URL + '/institusjoner/%(buctype)s/?landkode=%(landkode)s'
export const API_SAK_LANDKODER_URL = API_BASE_URL + '/landkoder/%(buctype)s'
export const API_SAK_SEND_URL = API_BASE_URL + '/rina/sak'
export const API_SVARPASED_SEND_POST_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/sed'
export const API_SVARPASED_REPLYSED_QUERY_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/sed/%(sedId)s/svarsed/%(sedType)s'
export const API_SVARPASED_FNR_QUERY_URL = API_BASE_URL + '/rina/sak/%(rinasaksnummer)s/svarsedoversikt'
export const API_SVARPASED_DNR_QUERY_URL = API_BASE_URL + '/rina/sak/%(rinasaksnummer)s/svarsedoversikt'
export const API_SVARPASED_SAKSNUMMER_QUERY_URL = API_BASE_URL + '/rina/sak/%(rinasaksnummer)s/svarsedoversikt'

// Registre
export const API_SAK_ARBEIDSFORHOLD_URL = API_BASE_URL + '/arbeidsforhold/%(fnr)s'
export const API_SAK_FAGSAKER_URL = API_BASE_URL + '/fagsaker/%(fnr)s/?sektor=%(sektor)s&tema=%(tema)s'
export const API_SAK_INNTEKT_URL = API_BASE_URL + '/inntekt/%(fnr)s?fraDato=%(fraDato)s&tilDato=%(tilDato)s&tema=%(tema)s'
export const API_SAK_PERSON_URL = API_BASE_URL + '/personer/?fnr=%(fnr)s'
export const API_SVARPASED_PERSON_URL = API_BASE_URL + '/personer/?fnr=%(fnr)s'

// Saksbehandler
export const API_SAKSBEHANDLER_URL = API_BASE_URL + '/saksbehandler'
export const API_ENHETER_URL = API_BASE_URL + '/saksbehandler/enheter'
export const API_REAUTENTISERING_URL = API_BASE_URL + '/saksbehandler/reautentisering'
// export const API_DELETE_TOKEN_URL = API_BASE_URL + '/saksbehandler/token'
export const API_UTGAARDATO_URL = API_BASE_URL + '/saksbehandler/utgaarDato'

// Server informasjon
export const API_SERVERINFO_URL = API_BASE_URL + '/serverinfo'

// Vedlegg
export const API_VEDLEGG_POST_URL = API_BASE_URL + '/rina/vedlegg'
export const API_VEDLEGG_DOKUMENT_URL = API_BASE_URL + '/rina/dokumenter/?rinasaksnummer=%(rinasaksnummer)s'
export const API_VEDLEGG_OVERSIKT_URL = API_BASE_URL + '/rina/vedlegg/dokumentoversikt/%(fnr)s'

// TO DO
export const API_PREVIEW_URL = ''
export const API_JOARK_LIST_URL = '/metadata/%(userId)s'
export const API_JOARK_GET_URL = '/hentdokument/%(journalpostId)s/%(dokumentInfoId)s/%(variantformat)s'
export const API_JOARK_ATTACHMENT_URL = '/vedlegg/%(fnr)s/%(rinaId)s/%(rinaDokumentId)s/%(journalpostId)s/%(dokumentInfoId)s/%(variantformat)s'
