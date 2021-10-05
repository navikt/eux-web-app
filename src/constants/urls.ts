export const HOST = window.location.hostname
const FULL_HOST = window.location.protocol + '//' + HOST
export const BASE_URL = FULL_HOST + (window.location.port ? ':' + window.location.port : '')

export const API_BASE_URL = '/api'

// See https://eux-helloeu-app-q2.nais.preprod.local/swagger-ui.html

// RINA
export const API_INSTITUSJONER_URL = API_BASE_URL + '/institusjoner/%(buctype)s/?landkode=%(landkode)s'
export const API_LANDKODER_URL = API_BASE_URL + '/landkoder/%(buctype)s'
export const API_RINASAKER_OVERSIKT_FNR_QUERY_URL = API_BASE_URL + '/person/%(fnr)s/rinasaker/oversikt'
export const API_RINASAKER_OVERSIKT_DNR_QUERY_URL = API_BASE_URL + '/person/%(fnr)s/rinasaker/oversikt'
export const API_SAK_SEND_URL = API_BASE_URL + '/rina/sak'
export const API_RINASAKER_OVERSIKT_SAKID_QUERY_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/oversikt'
export const API_SED_CREATE_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/sed'
export const API_SED_SEND_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/sed/%(sedId)s/send'
export const API_RINASAK_SVARSED_QUERY_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/sed/%(sedId)s/svarsed/%(sedType)s'
export const API_PREVIEW_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/sed/utkast/pdf'

// Registre
export const API_FAGSAKER_QUERY_URL = API_BASE_URL + '/fagsaker/%(fnr)s/?sektor=%(sektor)s&tema=%(tema)s'
export const API_INNTEKT_FOM_TOM_URL = API_BASE_URL + '/person/%(fnr)s/inntekter/oversikt?fom=%(fom)s&tom=%(tom)s&inntektsliste=%(inntektsliste)s'
export const API_ARBEIDSPERIODER_QUERY_URL = API_BASE_URL + '/person/%(fnr)s/arbeidsperioder/inntektsperioder/%(inntektslistetype)s/?fom=%(fom)s&tom=%(tom)s'
export const API_PERSONER_URL = API_BASE_URL + '/personer/?fnr=%(fnr)s'

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
export const API_JOARK_LIST_URL = '/api/vedlegg/dokumentoversikt/%(fnr)s'
export const API_JOARK_GET_URL = '/api/vedlegg/dokument/%(journalpostId)s/%(dokumentInfoId)s/%(variantformat)s'
export const API_JOARK_ATTACHMENT_URL = '/api/vedlegg/dokument/%(journalpostId)s/%(dokumentInfoId)s/%(variantformat)s/rina/%(rinaId)s/%(rinaDokumentId)s/%(filnavn)s'
