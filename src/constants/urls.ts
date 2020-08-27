export const API_BASE_URL = "/api";

// See https://eux-helloeu-app-q2.nais.preprod.local/swagger-ui.html

// RINA
export const API_SAK_INSTITUSJONER_URL =
  API_BASE_URL + "/institusjoner/%(buctype)s/?landkode=%(landkode)s";
export const API_SAK_LANDKODER_URL = API_BASE_URL + "/landkoder/%(buctype)s";
export const API_SAK_SEND_POST_URL = API_BASE_URL + "/rina/sak";

// Registre
export const API_SAK_ARBEIDSFORHOLD_URL =
  API_BASE_URL + "/arbeidsforhold/%(fnr)s";
export const API_SAK_FAGSAKER_URL =
  API_BASE_URL + "/fagsaker/%(fnr)s/?sektor=%(sektor)s&tema=%(tema)s";
export const API_SAK_INNTEKT_URL =
  API_BASE_URL + "/inntekt/%(fnr)s/%(fraDato)s/%(tilDato)s/%(tema)s";
export const API_SAK_PERSON_URL = API_BASE_URL + "/personer/?fnr=%(fnr)s";

// Saksbehandler
export const API_SAKSBEHANDLER_URL = API_BASE_URL + "/saksbehandler";
export const API_ENHETER_URL = API_BASE_URL + "/saksbehandler/enheter";
export const API_REAUTENTISERING_URL =
  API_BASE_URL + "/saksbehandler/reautentisering";
export const API_DELETE_TOKEN_URL = API_BASE_URL + "/saksbehandler/token";
export const API_UTGAARDATO_URL = API_BASE_URL + "/saksbehandler/utgaarDato";

// Server informasjon
export const API_SERVERINFO_URL = API_BASE_URL + "/serverinfo";

// Vedlegg
export const API_VEDLEGG_POST_URL = API_BASE_URL + "/rina/vedlegg";
export const API_VEDLEGG_DOKUMENT_URL =
  API_BASE_URL + "/rina/dokumenter/?rinasaksnummer=%(rinasaksnummer)s";

// Other
export const API_SVARPASED_SAKSNUMMER_URL =
  API_BASE_URL + "/saksnummer/%(saksnummer)s";
export const API_SVARPASED_SENDSVARPASEDDATA_POST_URL =
  API_BASE_URL + "/sendsvarpaseddata";
export const API_SVARPASED_PERSON_URL = API_BASE_URL + "/personer/?fnr=%(fnr)s";
