import { validatePeriode } from 'components/Forms/validation'
import { PensjonPeriode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationWithSubsidiesProps {
  pensjonPeriode: PensjonPeriode
  perioder: Array<PensjonPeriode>
  index?: number
  namespace: string
  personName: string
}

export const validateWithSubsidiesPeriode = (
  v: Validation,
  t: TFunction,
  {
    pensjonPeriode,
    perioder,
    index,
    namespace,
    personName
  }: ValidationWithSubsidiesProps
): boolean => {
  const idx = getIdx(index)

  let hasErrors: boolean = validatePeriode(v, t, {
    periode: pensjonPeriode.periode,
    namespace: namespace + '-periode' + idx,
    personName: personName
  })

  let duplicate: boolean
  if (_.isNil(index)) {
    duplicate = _.find(perioder, p => p.periode.startdato === pensjonPeriode.periode?.startdato && p.periode.sluttdato === pensjonPeriode.periode?.sluttdato) !== undefined
  } else {
    const otherPerioder: Array<PensjonPeriode> = _.filter(perioder, (p, i) => i !== index)
    duplicate = _.find(otherPerioder, p => p.periode.startdato === pensjonPeriode.periode?.startdato && p.periode.sluttdato === pensjonPeriode.periode?.sluttdato) !== undefined
  }
  if (duplicate) {
    v[namespace + idx + '-periode-startdato'] = {
      skjemaelementId: namespace + idx + '-periode-startdato',
      feilmelding: t('message:validation-duplicateStartdato')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(pensjonPeriode.pensjonstype)) {
    v[namespace + idx + '-pensjontype'] = {
      skjemaelementId: namespace + idx + '-pensjontype',
      feilmelding: t('message:validation-noPensjonType')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}

interface ValidateWithSubsidiesPerioderProps {
  perioder: Array<PensjonPeriode>
  namespace: string
  personName: string
}

export const validateWithSubsidiesPerioder = (
  v: Validation,
  t: TFunction,
  {
    perioder,
    namespace,
    personName
  }: ValidateWithSubsidiesPerioderProps
): boolean => {
  let hasErrors: boolean = false
  perioder?.forEach((pensjonPeriode: PensjonPeriode, index: number) => {
    const _error = validateWithSubsidiesPeriode(v, t, { pensjonPeriode, perioder, index, namespace, personName })
    hasErrors = hasErrors || _error
  })

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
