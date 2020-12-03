import mockFagsakerAW from 'eux-schema/mock_data/fagsaker_aw/fagsaker_aw.json'
import mockFagsakerFB from 'eux-schema/mock_data/fagsaker_fb/fagsaker_fb.json'
import mockFagsakerUB from 'eux-schema/mock_data/fagsaker_ub/fagsaker_ub.json'

export default ({ fnr, sektor, tema }: any) => {
  if (!fnr) {
    return 'Fødselsnummer mangler'
  }
  if (!sektor) {
    return 'Sektor mangler'
  }
  if (!tema) {
    return 'Tema mangler'
  }

  let module

  switch (sektor) {
    case 'aw':
      module = mockFagsakerAW
      break
    case 'fb':
      module = mockFagsakerFB
      break
    case 'ub':
    default:
      module = mockFagsakerUB
      break
  }

  return module
}
