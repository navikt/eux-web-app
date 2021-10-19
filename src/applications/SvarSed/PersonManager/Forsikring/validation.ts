import { validatePeriode } from 'components/Forms/validation'
import {
  ForsikringPeriode,
  Periode,
  PeriodeAnnenForsikring
} from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationForsikringPeriodeProps {
  periode: ForsikringPeriode
  perioder: Array<ForsikringPeriode> |undefined
  type: string | undefined
  index?: number
  namespace: string
  personName: string
}

interface ValidateForsikringPerioderProps {
  perioder: Array<ForsikringPeriode> |undefined
  type: string
  namespace: string
  personName: string
}

interface ValidateAlleForsikringPerioderProps {
  perioder: {[k in string]: Array<ForsikringPeriode> | undefined}
  namespace: string
  personName: string
}

export const validateForsikringPeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    perioder,
    type,
    index,
    namespace,
    personName
  }: ValidationForsikringPeriodeProps
): boolean => {
  const idx = getIdx(index)
  let hasErrors

  if (_.isNil(index) && _.isEmpty(type)) {
    v[namespace + '-type'] = {
      skjemaelementId: namespace + '-type',
      feilmelding: t('message:validation-noType')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  hasErrors = hasErrors || validatePeriode(v, t, {
    periode,
    namespace,
    personName
  })

  if (!_.isEmpty(periode?.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(perioder, p => p.startdato === periode.startdato && p.sluttdato === periode.sluttdato) !== undefined
    } else {
      const otherPerioder: Array<Periode> = _.filter(perioder, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, p => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-startdato'] = {
        feilmelding: t('message:validation-duplicateStartdato'),
        skjemaelementId: namespace + idx + '-startdato'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (type === 'perioderAnnenForsikring') {
    if (_.isEmpty((periode as PeriodeAnnenForsikring)?.annenTypeForsikringsperiode?.trim())) {
      v[namespace + idx + '-annenTypeForsikringsperiode'] = {
        feilmelding: t('message:validation-noAnnenTypeForsikringsperiode'),
        skjemaelementId: namespace + idx + '-annenTypeForsikringsperiode'
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

export const validateForsikringPerioder = (
  validation: Validation,
  t: TFunction,
  {
    type,
    perioder,
    namespace,
    personName
  }: ValidateForsikringPerioderProps
): boolean => {
  let hasErrors: boolean = false
  perioder?.forEach((periode: Periode, index: number) => {
    const _errors: boolean = validateForsikringPeriode(validation, t, {
      periode: periode,
      perioder: perioder,
      type,
      index,
      namespace,
      personName
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}

export const validateAlleForsikringPerioder = (
  v: Validation,
  t: TFunction,
  {
    perioder,
    namespace,
    personName
  } : ValidateAlleForsikringPerioderProps
): boolean => {
  let hasErrors: boolean = false
  let _error: boolean
  _error = validateForsikringPerioder(v, t, { type: 'perioderAnsattMedForsikring', perioder: perioder.perioderAnsattMedForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderSelvstendigMedForsikring', perioder: perioder.perioderSelvstendigMedForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderAnsattUtenForsikring', perioder: perioder.perioderAnsattUtenForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderSelvstendigUtenForsikring', perioder: perioder.perioderSelvstendigUtenForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderSyk', perioder: perioder.perioderSyk, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderSvangerskapBarn', perioder: perioder.perioderSvangerskapBarn, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderUtdanning', perioder: perioder.perioderUtdanning, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderMilitaertjeneste', perioder: perioder.perioderMilitaertjeneste, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderFrihetsberoevet', perioder: perioder.perioderFrihetsberoevet, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderFrivilligForsikring', perioder: perioder.perioderFrivilligForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderKompensertFerie', perioder: perioder.perioderKompensertFerie, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderAnnenForsikring', perioder: perioder.perioderAnnenForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  return hasErrors
}
