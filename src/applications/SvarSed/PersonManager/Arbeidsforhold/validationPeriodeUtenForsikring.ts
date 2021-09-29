import { validatePeriode } from 'components/Forms/validation'
import { PeriodeUtenForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPeriodeUtenForsikringProps {
  periodeUtenForsikring: PeriodeUtenForsikring,
  perioderUtenForsikring: Array<PeriodeUtenForsikring>,
  index?: number
  namespace: string
}

export const validatePeriodeUtenForsikring = (
  v: Validation,
  t: TFunction,
  {
    periodeUtenForsikring,
    perioderUtenForsikring,
    index,
    namespace
  }: ValidationPeriodeUtenForsikringProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(periodeUtenForsikring?.arbeidsgiver.navn?.trim())) {
    v[namespace + idx + '-navn'] = {
      feilmelding: t('message:validation-noName'),
      skjemaelementId: namespace + idx + '-navn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeUtenForsikring?.arbeidsgiver.identifikator)) {
    v[namespace + idx + '-orgnr'] = {
      feilmelding: t('message:validation-noOrgnr'),
      skjemaelementId: namespace + idx + '-orgnr'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodeError: boolean = validatePeriode(v, t, {
    periode: periodeUtenForsikring?.periode,
    namespace
  })
  hasErrors = hasErrors || periodeError

  if (!_.isEmpty(periodeUtenForsikring?.periode?.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(perioderUtenForsikring, p => p.periode.startdato === periodeUtenForsikring?.periode.startdato && p.periode.sluttdato === periodeUtenForsikring.periode?.sluttdato) !== undefined
    } else {
      const otherPerioder: Array<PeriodeUtenForsikring> = _.filter(perioderUtenForsikring, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, p => p.periode.startdato === periodeUtenForsikring?.periode?.startdato && p.periode.sluttdato === periodeUtenForsikring.periode?.sluttdato) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-startdato'] = {
        feilmelding: t('message:validation-duplicateStartdato'),
        skjemaelementId: namespace + idx + '-startdato'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (_.isEmpty(periodeUtenForsikring?.arbeidsgiver?.adresse?.land?.trim())) {
    v[namespace + idx + '-land'] = {
      feilmelding: t('message:validation-noAddressCountry'),
      skjemaelementId: namespace + idx + '-land'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeUtenForsikring?.arbeidsgiver?.adresse?.gate?.trim())) {
    v[namespace + idx + '-gate'] = {
      feilmelding: t('message:validation-noAddressStreet'),
      skjemaelementId: namespace + idx + '-gate'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeUtenForsikring?.arbeidsgiver?.adresse?.postnummer?.trim())) {
    v[namespace + idx + '-postnummer'] = {
      feilmelding: t('message:validation-noAddressPostnummer'),
      skjemaelementId: namespace + idx + '-postnummer'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeUtenForsikring?.arbeidsgiver?.adresse?.by?.trim())) {
    v[namespace + idx + '-by'] = {
      feilmelding: t('message:validation-noAddressCity'),
      skjemaelementId: namespace + idx + '-by'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeUtenForsikring?.kreverinformasjonomtypearberidsforhold)) {
    v[namespace + idx + '-kreverinformasjonomtypearberidsforhold'] = {
      feilmelding: t('message:validation-noAnswer'),
      skjemaelementId: namespace + idx + '-kreverinformasjonomtypearberidsforhold'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeUtenForsikring?.kreverinformasjonominntekt)) {
    v[namespace + idx + '-kreverinformasjonominntekt'] = {
      feilmelding: t('message:validation-noAnswer'),
      skjemaelementId: namespace + idx + '-kreverinformasjonominntekt'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeUtenForsikring?.kreverinformasjonomantallarbeidstimer)) {
    v[namespace + idx + '-kreverinformasjonomantallarbeidstimer'] = {
      feilmelding: t('message:validation-noAnswer'),
      skjemaelementId: namespace + idx + '-kreverinformasjonomantallarbeidstimer'
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

interface ValidatePerioderUtenForsikringProps {
  perioderUtenForsikring: Array<PeriodeUtenForsikring> | undefined
  namespace: string
}

export const validatePerioderUtenForsikring = (
  validation: Validation,
  t: TFunction,
  {
    perioderUtenForsikring,
    namespace
  }: ValidatePerioderUtenForsikringProps
): boolean => {
  let hasErrors: boolean = false
  perioderUtenForsikring?.forEach((periodeUtenForsikring: PeriodeUtenForsikring, index: number) => {
    const _errors: boolean = validatePeriodeUtenForsikring(validation, t, {
      periodeUtenForsikring: periodeUtenForsikring,
      perioderUtenForsikring: perioderUtenForsikring,
      index,
      namespace
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
