import {AktivitetStatus, PensjonPeriode, Periode, PeriodePeriode, PersonTypeF001} from "../../../declarations/sed";
import {Validation} from "../../../declarations/types";
import _ from "lodash";
import {validatePerioder} from "./Perioder/validation";
import {validatePerioderMedPensjonPerioder} from "./PerioderMedPensjon/validation";
import {addError} from "../../../utils/validation";
import i18n from "../../../i18n";
import {validatePeriodePerioder} from "./PeriodePerioder/validation";

export interface ValidateAktivitetOgTrygdeperioderProps {
  person: PersonTypeF001
  personName ?: string
}

export const validateAktivitetStatusOgTrygdeperioder = (
  v: Validation,
  namespace: string,
  {
    person,
    personName
  } : ValidateAktivitetOgTrygdeperioderProps
): boolean => {
  const hasErrors: Array<boolean> = []

  const aktivitetStatuser = _.get(person, 'aktivitetStatuser')

  if(aktivitetStatuser && aktivitetStatuser.length > 0) {
    aktivitetStatuser.forEach((aktivitetStatus: AktivitetStatus, index: number) => {
      if(!aktivitetStatus.aktiviteter || aktivitetStatus.aktiviteter.length === 0) {
        hasErrors.push(addError(v, {
          id: namespace + `-aktivitetStatus-${index}-aktiviteter`,
          message: 'validation:requiredAktiviteterForAktivitetStatus',
          extra: {status: aktivitetStatus.status},
          personName
        }))
      } else {
        aktivitetStatus.aktiviteter.forEach((aktivitet, aktivitetIndex) => {
          const aktivitetPerioder: Array<Periode> | undefined = aktivitet.perioder
          if(aktivitetStatus.status !== "ingenInfo" && (!aktivitetPerioder || aktivitetPerioder.length === 0)) {
            hasErrors.push(addError(v, {
              id: namespace + `-aktivitetStatus-${index}-aktiviteter-${aktivitetIndex}-perioder`,
              message: 'validation:requiredPerioderForAktivitet',
              extra: {aktivitet: i18n.t('label:aktivitet-type-' + aktivitet.type)},
              personName
            }))
          } else {
            hasErrors.push(validatePerioder(v, `${namespace + '-aktivitetStatus-' + index + '-aktiviteter-' + aktivitetIndex}`, {
              perioder: aktivitetPerioder, personName
            }))
          }
        })
      }


    })
  }

  const trygdePerioder: Array<Periode> | undefined = _.get(person, 'trygdeperioder')
  hasErrors.push(validatePerioder(v, `${namespace + '-trygdeperioder'}`, {
    perioder: trygdePerioder, personName
  }))

  const perioderMedRettTilFamilieytelser: Array<PeriodePeriode> | undefined = _.get(person, 'perioderMedRettTilYtelser[0].rettTilFamilieytelser')
  hasErrors.push(validatePeriodePerioder(v, `${namespace + '-periodermedretttilfamilieytelser'}`, {
    perioder: perioderMedRettTilFamilieytelser, personName
  }))

  const dekkedePerioder: Array<Periode> | undefined = _.get(person, 'dekkedePerioder')
  hasErrors.push(validatePerioder(v, `${namespace + 'dekkedeperioder'}`, {
    perioder: dekkedePerioder, personName
  }))

  const udekkedePerioder: Array<Periode> | undefined = _.get(person, 'udekkedePerioder')
  hasErrors.push(validatePerioder(v, `${namespace + '-udekkedeperioder'}`, {
    perioder: udekkedePerioder, personName
  }))

  const perioderMedPensjon: Array<PensjonPeriode> | undefined = _.get(person, 'perioderMedPensjon')
  hasErrors.push(validatePerioderMedPensjonPerioder(v, `${namespace + '-periodermedpensjon'}`, {
    perioder: perioderMedPensjon, personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateAktivitetOgTrygdeperioder = (
  v: Validation,
  namespace: string,
  {
    person,
    personName
  } : ValidateAktivitetOgTrygdeperioderProps
): boolean => {
  const hasErrors: Array<boolean> = []

  const aktivitetStatus = _.get(person, 'aktivitet.status')
  const aktivitetType = _.get(person, 'aktivitet.type')
  const aktivitetPerioder: Array<Periode> | undefined = _.get(person, 'aktivitet.perioder')

  if (aktivitetStatus === 'inaktiv' && !aktivitetType) {
    hasErrors.push(addError(v, {
      id: namespace + '-aktivitet-type',
      message: 'validation:requiredTypeForInaktivPerson',
      personName
    }))

  }
  if (aktivitetStatus === 'inaktiv' && aktivitetType) {
    if (!aktivitetPerioder || aktivitetPerioder.length === 0) {
      hasErrors.push(addError(v, {
        id: namespace + '-aktivitet-perioder',
        message: 'validation:requiredPerioderForInaktivPerson',
        personName
      }))
    }
  }

  if(aktivitetStatus === "aktiv" && aktivitetType) {
    if (!aktivitetPerioder || aktivitetPerioder.length === 0) {
      hasErrors.push(addError(v, {
        id: namespace + '-aktivitet-perioder',
        message: 'validation:requiredPerioderForAktivPerson',
        personName
      }))
    }
  }

  hasErrors.push(validatePerioder(v, `${namespace + '-' + _.get(person, 'aktivitet.type')}`, {
    perioder: aktivitetPerioder, personName
  }))

  const perioderMedAktivitetForInaktivPerson: Array<Periode> | undefined = _.get(person, 'perioderMedAktivitetForInaktivPerson')
  hasErrors.push(validatePerioder(v, `${namespace + '-perioderMedAktivitetForInaktivPerson'}`, {
    perioder: perioderMedAktivitetForInaktivPerson, personName
  }))

  const trygdePerioder: Array<Periode> | undefined = _.get(person, 'trygdeperioder')
  hasErrors.push(validatePerioder(v, `${namespace + '-trygdeperioder'}`, {
    perioder: trygdePerioder, personName
  }))

  const perioderMedRettTilFamilieytelser: Array<Periode> | undefined = _.get(person, 'perioderMedRettTilFamilieytelser')
  hasErrors.push(validatePerioder(v, `${namespace + '-periodermedretttilfamilieytelser'}`, {
    perioder: perioderMedRettTilFamilieytelser, personName
  }))

  const dekkedePerioder: Array<Periode> | undefined = _.get(person, 'dekkedePerioder')
  hasErrors.push(validatePerioder(v, `${namespace + 'dekkedeperioder'}`, {
    perioder: dekkedePerioder, personName
  }))

  const udekkedePerioder: Array<Periode> | undefined = _.get(person, 'udekkedePerioder')
  hasErrors.push(validatePerioder(v, `${namespace + '-udekkedeperioder'}`, {
    perioder: udekkedePerioder, personName
  }))

  const perioderMedPensjon: Array<PensjonPeriode> | undefined = _.get(person, 'perioderMedPensjon')
  hasErrors.push(validatePerioderMedPensjonPerioder(v, `${namespace + '-periodermedpensjon'}`, {
    perioder: perioderMedPensjon, personName
  }))

  return hasErrors.find(value => value) !== undefined
}
