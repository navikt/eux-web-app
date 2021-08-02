import { validatePeriod } from 'components/Period/validation'
import { PeriodeUtdanning } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPeriodeUtdanningProps {
  periodeUtdanning: PeriodeUtdanning,
  perioderUtdanning: Array<PeriodeUtdanning>,
  index?: number
  namespace: string
}

export const validatePeriodeUtdanning = (
  v: Validation,
  t: TFunction,
  {
    periodeUtdanning,
    perioderUtdanning,
    index,
    namespace
  }: ValidationPeriodeUtdanningProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  const periodeError: boolean = validatePeriod(v, t, {
    period: periodeUtdanning?.periode,
    namespace
  })
  hasErrors = hasErrors || periodeError

  if (!_.isEmpty(periodeUtdanning?.periode?.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(perioderUtdanning, p => p.periode.startdato === periodeUtdanning?.periode.startdato) !== undefined
    } else {
      const otherPerioder: Array<PeriodeUtdanning> = _.filter(perioderUtdanning, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, e => e.periode.startdato === periodeUtdanning?.periode?.startdato) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-startdato'] = {
        feilmelding: t('message:validation-duplicateStartdato'),
        skjemaelementId: namespace + idx + '-startdato'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}

export const validatePerioderUtdanning = (
  validation: Validation,
  t: TFunction,
  perioderUtdanning: Array<PeriodeUtdanning>,
  namespace: string
): boolean => {
  let hasErrors: boolean = false
  perioderUtdanning?.forEach((periodeUtdanning: PeriodeUtdanning, index: number) => {
    const _errors: boolean = validatePeriodeUtdanning(validation, t, {
      periodeUtdanning: periodeUtdanning,
      perioderUtdanning: perioderUtdanning,
      index,
      namespace
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
