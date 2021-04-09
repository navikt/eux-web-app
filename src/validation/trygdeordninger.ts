import { PensjonPeriode, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validatePeriode = (
  v: Validation,
  periode: Periode,
  sedCategory: string,
  pageCategory: string,
  index: number,
  t: any,
  namespace: string,
  personName: string
): void => {
  let generalFail: boolean = false

  let value = (!_.isEmpty(periode.startdato))
    ? undefined
    : {
      feilmelding: t('message:validation-noDateForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-startdato-date'
    } as FeiloppsummeringFeil
  v[namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-startdato'] = value
  if (value) {
    generalFail = true
  }

  if (!_.isEmpty(periode.startdato)) {
    value = (periode.startdato && periode.startdato.match(/\d{2}\.\d{2}\.\d{4}/))
      ? undefined
      : {
        feilmelding: t('message:validation-invalidDateForPerson', {person: personName}),
        skjemaelementId: 'c-' + namespace + '-' + sedCategory + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-startdato-date'
      } as FeiloppsummeringFeil
    if (!v[namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-startdato']) {
      v[namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-startdato'] = value
    }
    if (value) {
      generalFail = true
    }
  }

  if (!_.isEmpty(periode?.sluttdato)) {
    value = periode?.sluttdato?.match(/\d{2}\.\d{2}\.\d{4}/)
      ? undefined
      : {
        feilmelding: t('message:validation-invalidDateForPerson', { person: personName }),
        skjemaelementId: 'c-' + namespace + '-' + sedCategory + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-sluttdato-date'
      } as FeiloppsummeringFeil
    v[namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-sluttdato'] = value
    if (value) {
      generalFail = true
    }
  }

  if (generalFail) {
    const namespaceBits = namespace.split('-')
    namespaceBits[0] = 'person'
    const personNamespace = namespaceBits[0] + '-' + namespaceBits[1]
    const categoryNamespace = namespaceBits.join('-')
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
}

export const validatePensjonPeriode = (
  v: Validation,
  periode: PensjonPeriode,
  sedCategory: string,
  pageCategory: string,
  index: number,
  t: any,
  namespace: string,
  personName: string
): void => {
  let generalFail: boolean = false

  let value = (!_.isEmpty(periode.periode.startdato))
    ? undefined
    : {
      feilmelding: t('message:validation-noDateForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-' + sedCategory + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-periode-startdato-date'
    } as FeiloppsummeringFeil
  v[namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-periode-startdato'] = value
  if (value) {
    generalFail = true
  }

  if (!_.isEmpty(periode.periode.startdato)) {
    value = (periode.periode.startdato.match(/\d{2}\.\d{2}\.\d{4}/))
      ? undefined
      : {
        feilmelding: t('message:validation-invalidDateForPerson', {person: personName}),
        skjemaelementId: 'c-' + namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-periode-startdato-date'
      } as FeiloppsummeringFeil
    if (!v[namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-periode-startdato']) {
      v[namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-periode-startdato'] = value
    }
    if (value) {
      generalFail = true
    }
  }
  if (!_.isEmpty(periode?.periode.sluttdato)) {
    value = (periode.periode.sluttdato!.match(/\d{2}\.\d{2}\.\d{4}/))
      ? undefined
      : {
        feilmelding: t('message:validation-invalidDateForPerson', { person: personName }),
        skjemaelementId: 'c-' + namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-periode-sluttdato-date'
      } as FeiloppsummeringFeil
    v[namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-periode-sluttdato'] = value
    if (value) {
      generalFail = true
    }
  }

  value = periode.pensjonstype
    ? undefined
    : {
      feilmelding: t('message:validation-noPensjonTypeTilPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-pensjonstype-text'
    } as FeiloppsummeringFeil
  v[namespace + '-' + (index < 0 ? pageCategory : sedCategory + '[' + index + ']') + '-pensjonstype'] = value
  if (value) {
    generalFail = true
  }

  if (generalFail) {
    const namespaceBits = namespace.split('-')
    namespaceBits[0] = 'person'
    const personNamespace = namespaceBits[0] + '-' + namespaceBits[1]
    const categoryNamespace = namespaceBits.join('-')
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
}

export const validatePerioder = (
  validation: Validation,
  sedCategory: string,
  pageCategory: string,
  perioder: Array<Periode | PensjonPeriode>,
  t: any,
  namespace: string,
  personName: string
): void => {
  perioder?.forEach((periode: Periode | PensjonPeriode, index: number) => {
    if (sedCategory === 'perioderMedPensjon') {
      validatePensjonPeriode(validation, periode as PensjonPeriode, sedCategory, pageCategory, index, t, namespace, personName)
    } else {
      validatePeriode(validation, periode as Periode, sedCategory, pageCategory, index, t, namespace, personName)
    }
  })
}

export const validateTrygdeordninger = (
  v: Validation,
  perioderMap: {[k in string]: Array<Periode | PensjonPeriode>},
  t: any,
  namespace: string,
  personName: string
): void => {
  const sedCategoryToPageCategory: any = {
    perioderMedITrygdeordning: 'dekkede',
    perioderUtenforTrygdeordning: 'udekkede',
    perioderMedArbeid: 'familieYtelse',
    perioderMedTrygd: 'familieYtelse',
    perioderMedYtelser: 'familieYtelse',
    perioderMedPensjon: 'familieYtelse'
  }

  Object.keys(perioderMap).forEach((category: string) => {
    const perioder = perioderMap[category]
    const pageCategory = sedCategoryToPageCategory[category]
    validatePerioder(v, category, pageCategory, perioder, t, namespace, personName)
  })
}
