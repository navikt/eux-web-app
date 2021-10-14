import { validatePeriode } from 'components/Forms/validation'
import { PeriodeAnnenForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPeriodeAnnenProps {
  periodeAnnen: PeriodeAnnenForsikring,
  perioderAnnen: Array<PeriodeAnnenForsikring>,
  index?: number
  namespace: string
}

export const validatePeriodeAnnen = (
  v: Validation,
  t: TFunction,
  {
    periodeAnnen,
    perioderAnnen,
    index,
    namespace
  }: ValidationPeriodeAnnenProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  const periodeError: boolean = validatePeriode(v, t, {
    periode: periodeAnnen,
    namespace
  })
  hasErrors = hasErrors || periodeError

  if (!_.isEmpty(periodeAnnen?.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(perioderAnnen, p => p.startdato === periodeAnnen.startdato && p.sluttdato === periodeAnnen.sluttdato) !== undefined
    } else {
      const otherPerioder: Array<PeriodeAnnenForsikring> = _.filter(perioderAnnen, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, p => p.startdato === periodeAnnen?.startdato && p.sluttdato === periodeAnnen?.sluttdato) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-startdato'] = {
        feilmelding: t('message:validation-duplicateStartdato'),
        skjemaelementId: namespace + idx + '-startdato'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (_.isEmpty(periodeAnnen?.annenTypeForsikringsperiode?.trim())) {
    v[namespace + idx + '-annenTypeForsikringsperiode'] = {
      feilmelding: t('message:validation-noAnnenTypeForsikringsperiode'),
      skjemaelementId: namespace + idx + '-annenTypeForsikringsperiode'
    } as FeiloppsummeringFeil
    hasErrors = true
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

interface ValidadePerioderAnnenProps {
  perioderAnnen: Array<PeriodeAnnenForsikring> | undefined
  namespace: string
}

export const validatePerioderAnnen = (
  validation: Validation,
  t: TFunction,
  {
    perioderAnnen,
    namespace
  }: ValidadePerioderAnnenProps
): boolean => {
  let hasErrors: boolean = false
  perioderAnnen?.forEach((periodeAnnen: PeriodeAnnenForsikring, index: number) => {
    const _errors: boolean = validatePeriodeAnnen(validation, t, {
      periodeAnnen,
      perioderAnnen,
      index,
      namespace
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
