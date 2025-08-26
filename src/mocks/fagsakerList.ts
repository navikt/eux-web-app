import mockFagsakerAW from './fagsaker_aw.json'
import mockFagsakerFB from './fagsaker_fb.json'
import mockFagsakerUB from './fagsaker_ub.json'

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

  return module.map((f) => {
    return {
      ...f,
      fnr,
      tema
    }
  })
}
