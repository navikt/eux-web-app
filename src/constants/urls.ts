export const HOST = window.location.hostname
const FULL_HOST = window.location.protocol + '//' + HOST
export const BASE_URL = FULL_HOST + (window.location.port ? ':' + window.location.port : '')

export const API_BASE_URL = '/api'
export const V2_BASE_URL = '/v2'
export const V3_BASE_URL = '/v3'
export const V5_BASE_URL = '/v5'

// See https://eux-helloeu-app-q2.nais.preprod.local/swagger-ui.html

// ADMIN
export const ADMIN_PUBLISH_SED_EVENTS_URL = API_BASE_URL + '/sed-events/publish'

// RINA
export const API_CDMVERSJON_RINA_URL = API_BASE_URL + '/rina/cdmversjon'
export const API_LANDKODER_RINA_URL = API_BASE_URL + '/landkoder/rina?format=iso3'
export const API_INSTITUSJONER_URL= API_BASE_URL + '/institusjoner/%(buctype)s?landkode=%(landkode)s&domene=nav'
export const API_RINASAKER_OVERSIKT_FNR_DNR_NPID_QUERY_URL = V5_BASE_URL + '/personer/%(fnr)s/rinasaker/oversikt'
export const API_RINASAKER_OVERSIKT_SAKID_QUERY_URL = V5_BASE_URL + '/rinasaker/%(rinaSakId)s/oversikt'
export const API_SAK_SEND_URL = API_BASE_URL + '/rinasak/sed'
export const API_MOTTAKERE_URL = V2_BASE_URL + '/rina/sak/%(rinaSakId)s/mottakere'
export const API_SED_CREATE_URL = API_BASE_URL + '/rinasak/%(rinaSakId)s/sed'
export const API_SED_EDIT_URL = API_BASE_URL + '/rinasak/%(rinaSakId)s/sed/%(sedId)s'
export const API_SED_DELETE_URL = V2_BASE_URL + '/rina/sak/%(rinaSakId)s/sed/%(sedId)s'
export const API_SED_UPDATE_URL = API_BASE_URL + '/rinasak/%(rinaSakId)s/sed/%(sedId)s'
export const API_SED_SEND_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/sed/%(sedId)s/send'
export const API_SED_STATUS_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/sed/%(sedId)s/status'
export const API_RINASAK_SVARSED_QUERY_URL = API_BASE_URL + '/rinasak/%(rinaSakId)s/sed/%(sedId)s/svarsed/%(sedType)s'
export const API_PREVIEW_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/sed/utkast/pdf'
export const API_PDF_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/sed/%(sedId)s/pdf'
export const API_SAK_DELETE_URL = V2_BASE_URL + '/rina/sak/%(rinaSakId)s'
export const API_RINA_ATTACHMENT_GET_URL = API_BASE_URL + '/rina/%(rinaSakId)s/sed/%(sedId)s/vedlegg/%(vedleggId)s'
export const API_RINA_ATTACHMENT_DELETE_URL = API_BASE_URL + '/rina/%(rinaSakId)s/sed/%(sedId)s/vedlegg/%(vedleggId)s'
export const API_RINA_ATTACHMENT_SENSITIVE_URL = API_BASE_URL + '/rina/%(rinaSakId)s/sed/%(sedId)s/vedlegg/%(vedleggId)s/sensitivt'
export const API_RINA_JOURNALFOER_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/journalfoer?enhetNr=%(enhetNr)s&opprettOppgave=%(opprettOppgave)s'
export const API_ADD_RELATED_RINASAK_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/relaterte/%(relatertRinaSakId)s'
export const API_FEILREGISTRER_JOURNALPOSTER_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/feilregistrerjournalposter'
export const API_UPDATE_FAGSAK_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s/fagsak'
export const API_GET_FAGSAKTEMA_URL = API_BASE_URL + '/rina/sak/%(rinaSakId)s'

// Registre
export const API_GET_FAGSAKER_URL = V3_BASE_URL + '/person/%(fnr)s/fagsaker?tema=%(tema)s'
export const API_CREATE_FAGSAK_GENERELL_URL = API_BASE_URL + '/person/%(fnr)s/fagsak/generell'
export const API_PDU1_CREATE_FAGSAK_URL = API_BASE_URL + '/person/%(fnr)s/fagsak/dagpenger'
export const API_INNTEKT_FOM_TOM_URL = API_BASE_URL + '/person/%(fnr)s/inntekter/oversikt?fom=%(fom)s&tom=%(tom)s&inntektsliste=%(inntektsliste)s'
export const API_ARBEIDSPERIODER_QUERY_URL = API_BASE_URL + '/person/%(fnr)s/arbeidsperioder/inntektsperioder/%(inntektslistetype)s?fom=%(fom)s&tom=%(tom)s'

export const API_PDL_PERSON_URL = API_BASE_URL + '/person/%(fnr)s/personInfo'
export const API_PERSON_MED_FAMILIE_URL = API_BASE_URL + '/person/%(fnr)s/familierelasjoner'
export const API_ADRESSE_URL = API_BASE_URL + '/person/%(fnr)s/adresser'

// Saksbehandler
export const API_SAKSBEHANDLER_URL = API_BASE_URL + '/saksbehandler'
export const API_ENHETER_URL = API_BASE_URL + '/saksbehandler/enheter'
export const API_ALLE_ENHETER_URL = API_BASE_URL + '/saksbehandler/alleEnheter'
export const API_FAVORITTENHET_URL = API_BASE_URL + '/saksbehandler/favorittenhet'
export const API_SAKSBEHANDLER_BUCER_URL = API_BASE_URL + '/saksbehandler/bucer'
export const API_REAUTENTISERING_URL = '/oauth2/session/refresh'
export const API_UTLOGGING_URL = '/oauth2/logout/local'
// export const API_DELETE_TOKEN_URL = API_BASE_URL + '/saksbehandler/token'
export const API_UTGAARDATO_URL = '/oauth2/session'

// Server informasjon
export const API_SERVERINFO_URL = API_BASE_URL + '/serverinfo'

// Vedlegg
export const API_JOARK_GET_URL = API_BASE_URL + '/vedlegg/dokument/%(journalpostId)s/%(dokumentInfoId)s/%(variantformat)s'

export const API_VEDLEGG_DOKUMENT_URL = API_BASE_URL + '/rina/dokumenter?rinasaksnummer=%(rinasaksnummer)s'

// Joark
export const API_ATTACHMENT_LIST_URL = API_BASE_URL + '/vedlegg/dokumentoversikt/%(fnr)s?tema=%(tema)s'
export const API_JOARK_ATTACHMENT_URL = API_BASE_URL + '/vedlegg/dokument/%(journalpostId)s/%(dokumentInfoId)s/%(variantformat)s/rina/%(rinaId)s/%(rinaDokumentId)s/%(filnavn)s'

// PD U1
//export const PDU1_INFO_URL = API_BASE_URL + '/person/%(fnr)s/info/pdu1' // GET (1)
export const PDU1_INFO_URL = API_BASE_URL + '/person/%(fnr)s/pdu1/innhold' // GET (1)

//export const PDU1_PREVIEW_URL = V2_BASE_URL + '/pdu1/pdf/utkast' // POST (2)
export const PDU1_PREVIEW_URL = API_BASE_URL + '/pdu1/pdf/utkast' // POST (2)

//export const PDU1_JOURNALPOST_URL = API_BASE_URL + '/pdu1/pdf/journalpost' // POST (3)
export const PDU1_JOURNALPOST_URL = API_BASE_URL + '/pdu1/journalpost' // POST (3)

//export const PDU1_GET_URL = API_BASE_URL + '/dokument/%(journalpostId)s/%(dokumentId)s/%(variant)s' // GET (4)
export const PDU1_GET_URL = API_BASE_URL + '/pdu1/journalpost/%(journalpostId)s/dokumentInfoId/%(dokumentId)s/%(variant)s' // GET (4)

export const PDU1_SEARCH_URL = API_BASE_URL + '/person/%(fnr)s/dokumenter?dokumenttype=DAG_EOS_U1' // GET
