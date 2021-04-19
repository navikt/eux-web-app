import { Prosedyre } from './ProsedyreVedUenighet'
import { Validation } from 'declarations/types'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validateProsedyre = (
  v: Validation,
  prosedyre: Prosedyre,
  index: number,
  t: any,
  namespace: string
): void => {
  let generalFail: boolean = false

  let value = prosedyre.person && prosedyre.person.length > 0
    ? undefined
    : {
      feilmelding: t('message:validation-noName'),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-person'
    } as FeiloppsummeringFeil

  v[namespace + '-person'] = value

  if (value) {
    generalFail = true
  }

  value = prosedyre.grunn
    ? undefined
    : {
      feilmelding: t('message:validation-noGrunn'),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-grunn'
    } as FeiloppsummeringFeil

  v[namespace + '-grunn'] = value

  if (generalFail) {
    const namespaceBits = namespace.split('-')
    namespaceBits[0] = 'person'
    const personNamespace = namespaceBits[0] + '-' + namespaceBits[1]
    const categoryNamespace = namespaceBits.join('-')
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
}

export const validateProsedyrer = (
  validation: Validation,
  prosedyrer :Array<Prosedyre>,
  t: any,
  namespace: string
): void => {
  prosedyrer?.forEach((p: Prosedyre, index: number) => {
    validateProsedyre(validation, p, index, t, namespace)
  })
}
