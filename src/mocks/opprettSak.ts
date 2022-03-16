import mockArbeidsperiode from 'mocks/arbeidsperioder/arbeidsperiode'
import mockFamilierelasjon from 'mocks/familierelasjon'

export default {
  buctype: 'P_BUC_MOCK',
  fnr: '12354678901',
  landKode: 'AA',
  institusjonsID: 'NAV',
  saksID: '123',
  sedtype: 'SED_MOCK',
  sektor: 'SEKTOR_MOCK',
  arbeidsforhold: [mockArbeidsperiode],
  familierelasjoner: [mockFamilierelasjon]
}
