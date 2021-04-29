export default (fnr: any) => {
  if (!fnr) {
    return 'Fødselsnummer mangler'
  }
  if (fnr.length !== 11) {
    return 'Fnr må ha 11 siffer'
  }
  return {
    arbeidsperioder: [{
      arbeidsgiverNavn: 'DUH AS',
      arbeidsgiverOrgnr: '235835247',
      fraDato: '1960-01-01',
      tilDato: '1969-12-31',
      harRegistrertInntekt: 'ja'
    }, {
      arbeidsgiverNavn: 'WELL DUH AS',
      arbeidsgiverOrgnr: '492502672',
      fraDato: '1970-01-01',
      tilDato: '1979-12-31',
      harRegistrertInntekt: 'nei'
    }],
    uriArbeidsgiverRegister: 'https://nav.no',
    uriInntektRegister: 'https://nav.no'
  }
}
