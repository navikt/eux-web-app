import arbeidsforholdList from 'eux-schema/mock_data/arbeidsforhold/arbeidsforhold.json'

export default (fnr: any) => {
  if (!fnr) {
    return 'Fødselsnummer mangler'
  }
  if (fnr.length !== 11) {
    return 'Fnr må ha 11 siffer'
  }
  return arbeidsforholdList
}
