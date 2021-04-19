import arbeidsforholdList from 'eux-schema/mock_data/arbeidsforhold/arbeidsforhold.json'

export default (fnr: any) => {
  if (!fnr) {
    return 'Fødselsnummer mangler'
  }
  if (fnr.length !== 11) {
    return 'Fnr må ha 11 siffer'
  }
  return {
    arbeidsperioder: arbeidsforholdList.map(a => {
      return {
        arbeidsgiverNavn: a.navn,
        arbeidsgiverOrgnr: a.orgnr,
        fraDato: a.ansettelsesPeriode.fom,
        tilDato: a.ansettelsesPeriode.tom,
        harRegistrertInntekt: parseInt(a.orgnr.substring(a.orgnr.length-1, a.orgnr.length)) < 5 ? 'ja' : 'nei'
      }
    }),
    uriArbeidsgiverRegister: 'https://nav.no',
    uriInntektRegister: 'https://nav.no'
  }
}
