import { validatePeriod } from 'components/Period/validation'
import { PeriodeSykSvangerskapOmsorg } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPeriodeSvangerskapProps {
  periodeSvangerskap: PeriodeSykSvangerskapOmsorg,
  perioderSvangerskap: Array<PeriodeSykSvangerskapOmsorg>,
  index?: number
  namespace: string
}

export const validatePeriodeSvangerskap = (
  v: Validation,
  t: TFunction,
  {
    periodeSvangerskap,
    perioderSvangerskap,
    index,
    namespace
  }: ValidationPeriodeSvangerskapProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(periodeSvangerskap?.navn?.trim())) {
    v[namespace + idx + '-navn'] = {
      feilmelding: t('message:validation-noName'),
      skjemaelementId: namespace + idx + '-navn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeSvangerskap?.institusjonsid.trim())) {
    v[namespace + idx + '-institusjonsid'] = {
      feilmelding: t('message:validation-noInstitusjonsID'),
      skjemaelementId: namespace + idx + '-institusjonsid'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeSvangerskap?.institusjonsnavn.trim())) {
    v[namespace + idx + '-institusjonsnavn'] = {
      feilmelding: t('message:validation-noInstitusjonensNavn'),
      skjemaelementId: namespace + idx + '-institusjonsnavn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeSvangerskap?.erinstitusjonsidkjent)) {
    v[namespace + idx + '-erinstitusjonsidkjent'] = {
      feilmelding: t('message:validation-noInstitusjonensKnown'),
      skjemaelementId: namespace + idx + '-erinstitusjonsidkjent'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodeError: boolean = validatePeriod(v, t, {
    period: periodeSvangerskap?.periode,
    namespace
  })
  hasErrors = hasErrors || periodeError

  if (!_.isEmpty(periodeSvangerskap?.periode?.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(perioderSvangerskap, p => p.periode.startdato === periodeSvangerskap?.periode.startdato && p.periode.sluttdato === periodeSvangerskap.periode?.sluttdato) !== undefined
    } else {
      const otherPerioder: Array<PeriodeSykSvangerskapOmsorg> = _.filter(perioderSvangerskap, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, p => p.periode.startdato === periodeSvangerskap?.periode?.startdato && p.periode.sluttdato === periodeSvangerskap.periode?.sluttdato) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-startdato'] = {
        feilmelding: t('message:validation-duplicateStartdato'),
        skjemaelementId: namespace + idx + '-startdato'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (_.isEmpty(periodeSvangerskap?.adresse?.land?.trim())) {
    v[namespace + idx + '-land'] = {
      feilmelding: t('message:validation-noAddressCountry'),
      skjemaelementId: namespace + idx + '-land'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeSvangerskap?.adresse?.gate?.trim())) {
    v[namespace + idx + '-gate'] = {
      feilmelding: t('message:validation-noAddressStreet'),
      skjemaelementId: namespace + idx + '-gate'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeSvangerskap?.adresse?.postnummer?.trim())) {
    v[namespace + idx + '-postnummer'] = {
      feilmelding: t('message:validation-noAddressPostnummer'),
      skjemaelementId: namespace + idx + '-postnummer'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeSvangerskap?.adresse?.by?.trim())) {
    v[namespace + idx + '-by'] = {
      feilmelding: t('message:validation-noAddressCity'),
      skjemaelementId: namespace + idx + '-by'
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

interface ValidatePerioderSvangerskapOgSykProps {
  perioderSvangerskap: Array<PeriodeSykSvangerskapOmsorg> | undefined
  namespace: string
}

export const validatePerioderSvangerskapOgSyk = (
  validation: Validation,
  t: TFunction,
  {
    perioderSvangerskap,
    namespace
  }: ValidatePerioderSvangerskapOgSykProps
): boolean => {
  let hasErrors: boolean = false
  perioderSvangerskap?.forEach((periodeSvangerskap: PeriodeSykSvangerskapOmsorg, index: number) => {
    const _errors: boolean = validatePeriodeSvangerskap(validation, t, {
      periodeSvangerskap: periodeSvangerskap,
      perioderSvangerskap: perioderSvangerskap,
      index,
      namespace
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
