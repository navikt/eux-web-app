import { validatePeriod } from 'components/Period/validation'
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

  if (_.isEmpty(periodeAnnen?.navn?.trim())) {
    v[namespace + idx + '-navn'] = {
      feilmelding: t('message:validation-noName'),
      skjemaelementId: namespace + idx + '-navn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeAnnen?.institusjonsid.trim())) {
    v[namespace + idx + '-institusjonsid'] = {
      feilmelding: t('message:validation-noInstitusjonsID'),
      skjemaelementId: namespace + idx + '-institusjonsid'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeAnnen?.institusjonsnavn.trim())) {
    v[namespace + idx + '-institusjonsnavn'] = {
      feilmelding: t('message:validation-noInstitusjonensNavn'),
      skjemaelementId: namespace + idx + '-institusjonsnavn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeAnnen?.institusjonstype.trim())) {
    v[namespace + idx + '-institusjonstype'] = {
      feilmelding: t('message:validation-noInstitusjonensType'),
      skjemaelementId: namespace + idx + '-institusjonstype'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeAnnen?.virksomhetensart.trim())) {
    v[namespace + idx + '-virksomhetensart'] = {
      feilmelding: t('message:validation-noVirksomhetensArt'),
      skjemaelementId: namespace + idx + '-virksomhetensart'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodeError: boolean = validatePeriod(v, t, {
    period: periodeAnnen?.periode,
    namespace
  })
  hasErrors = hasErrors || periodeError

  if (!_.isEmpty(periodeAnnen?.periode?.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(perioderAnnen, p => p.periode.startdato === periodeAnnen?.periode.startdato) !== undefined
    } else {
      const otherPerioder: Array<PeriodeAnnenForsikring> = _.filter(perioderAnnen, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, e => e.periode.startdato === periodeAnnen?.periode?.startdato) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-startdato'] = {
        feilmelding: t('message:validation-duplicateStartdato'),
        skjemaelementId: namespace + idx + '-startdato'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (_.isEmpty(periodeAnnen?.adresse?.land?.trim())) {
    v[namespace + idx + '-land'] = {
      feilmelding: t('message:validation-noAddressCountry'),
      skjemaelementId: namespace + idx + '-land'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeAnnen?.adresse?.gate?.trim())) {
    v[namespace + idx + '-gate'] = {
      feilmelding: t('message:validation-noAddressStreet'),
      skjemaelementId: namespace + idx + '-gate'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeAnnen?.adresse?.postnummer?.trim())) {
    v[namespace + idx + '-postnummer'] = {
      feilmelding: t('message:validation-noAddressPostnummer'),
      skjemaelementId: namespace + idx + '-postnummer'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(periodeAnnen?.adresse?.by?.trim())) {
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
