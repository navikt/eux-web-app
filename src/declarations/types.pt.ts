import PT from 'prop-types'

export const PeriodePropType = PT.shape({
  fom: PT.string,
  tom: PT.string
})

export const ArbeidsforholdetPropType = PT.shape({
  arbeidsforholdIDnav: PT.number,
  orgnr: PT.string,
  navn: PT.string,
  ansettelsesPeriode: PeriodePropType
})

export const ArbeidsforholdPropType = PT.arrayOf(ArbeidsforholdetPropType)

export const KodeverkPropType = PT.shape({
  kode: PT.string.isRequired,
  term: PT.string.isRequired
})

export const BuctyperPropType = PT.shape({
  awod: PT.arrayOf(KodeverkPropType),
  administrative: PT.arrayOf(KodeverkPropType),
  family: PT.arrayOf(KodeverkPropType),
  horizontal: PT.arrayOf(KodeverkPropType),
  legislation: PT.arrayOf(KodeverkPropType),
  miscellaneous: PT.arrayOf(KodeverkPropType),
  pensions: PT.arrayOf(KodeverkPropType),
  recovery: PT.arrayOf(KodeverkPropType),
  sickness: PT.arrayOf(KodeverkPropType),
  unemployment: PT.arrayOf(KodeverkPropType)
})

export const FamilieRelasjonPropType = PT.shape({
  fnr: PT.string,
  fdato: PT.string,
  nasjonalitet: PT.string,
  rolle: PT.string,
  kjoenn: PT.string,
  fornavn: PT.string,
  etternavn: PT.string
})

export const FamilieRelasjonerPropType = PT.arrayOf(FamilieRelasjonPropType)

export const PersonPropType = PT.shape({
  fnr: PT.string,
  fdato: PT.string,
  fornavn: PT.string,
  etternavn: PT.string,
  kjoenn: PT.string
})

export const SaksbehandlerPropType = PT.shape({
  brukernavn: PT.string,
  navn: PT.string
})

export const ServerInfoPropType = PT.shape({
  namespace: PT.string,
  cluster: PT.string,
  branchName: PT.string,
  longVersionHash: PT.string,
  gosysURL: PT.string,
  veraUrl: PT.string
})

export const opprettetSakPropType = PT.shape({
  rinasaksnummer: PT.string,
  url: PT.string
})

export const FeiloppsummeringFeilPropType = PT.shape({
  feilmendling: PT.string.isRequired,
  skjemaelementId: PT.string.isRequired
})

export const ValidationPropType = PT.objectOf(FeiloppsummeringFeilPropType)
