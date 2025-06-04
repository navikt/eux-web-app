import { validatePeriode } from 'components/Forms/validation'
import { Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getNSIdx } from 'utils/namespace'
import { addError, checkIfNotEmpty } from 'utils/validation'
import performValidation from "../../../utils/performValidation";
import {validateTrygdeOrdninger, ValidationTrygdeOrdningerProps} from "../RettTilYtelserFSED/validation";

export interface ValidationDekkedePeriodeProps {
  periode: Periode | undefined
  perioder: Array<Periode> | undefined
  nsIndex?: string
  personName?: string | undefined
}

export interface ValidateTrygdeordningerProps {
  replySed: ReplySed
  personID: string
  personName: string | undefined
}

export const validateDekkedePeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    nsIndex,
    personName
  }: ValidationDekkedePeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periode?.__type,
    id: namespace + (nsIndex ?? '') + '-type',
    message: 'validation:noType',
    personName
  }))

  hasErrors.push(validatePeriode(v, namespace + (nsIndex ?? ''), {
    periode,
    personName
  }))

  let haystack: Array<Periode> | undefined

  // check if the item is itself in the list, use a list without it, for proper duplicate check
  if (_.isEmpty(nsIndex)) {
    haystack = perioder
  } else {
    haystack = _.reject(perioder, (p: Periode) => getNSIdx(p.__type, p.__index) === nsIndex)
  }

  const duplicate = _.find(haystack, (p: Periode) =>
    p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato
  ) !== undefined

  if (duplicate) {
    hasErrors.push(addError(v, {
      id: namespace + (nsIndex ?? '') + '-startdato',
      message: 'validation:duplicateStartdato',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateTrygdeordning = (
  v: Validation,
  namespace: string,
  type: string,
  perioder: Array<Periode>,
  personName?: string
): boolean => {
  const hasErrors: Array<boolean> = []
  perioder?.forEach((periode: Periode, index: number) => {
    // in validation run from mainValidation, periode does not have __type, but in
    // new/edit periode validations, I must check __type, so let's fill it if it doesn't have

    if (!Object.prototype.hasOwnProperty.call((periode as Periode), '__type')) {
      (periode as Periode).__type = type;
      (periode as Periode).__index = index
    }


    hasErrors.push(validateDekkedePeriode(v, namespace, {
      periode: (periode as Periode),
      perioder: (perioder as Array<Periode>),
      nsIndex: getNSIdx(type, index),
      personName
    }))

    delete (periode as Periode).__type
    delete (periode as Periode).__index

  })



  return hasErrors.find(value => value) !== undefined
}

export const validateTrygdeordninger = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personID,
    personName
  } : ValidateTrygdeordningerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  hasErrors.push(validateTrygdeordning(v, namespace, 'perioderMedITrygdeordning', _.get(replySed, `${personID}.perioderMedITrygdeordning`), personName))
  hasErrors.push(validateTrygdeordning(v, namespace, 'perioderUtenforTrygdeordning', _.get(replySed, `${personID}.perioderUtenforTrygdeordning`), personName))
  hasErrors.push(validateTrygdeordning(v, namespace, 'perioderMedYtelser', _.get(replySed, `${personID}.perioderMedYtelser`), personName))


  const perioderMedYtelser: Array<Periode> | undefined = _.get(replySed, `${personID}.perioderMedYtelser`)
  const ikkeRettTilYtelser: any | undefined = _.get(replySed, `${personID}.ikkeRettTilYtelser`)
  let rettTilFamilieYtelser;
  if(perioderMedYtelser && perioderMedYtelser.length >= 0){
    rettTilFamilieYtelser = "ja"
  } else if(ikkeRettTilYtelser){
    rettTilFamilieYtelser = "nei"
  }
  hasErrors.push(performValidation<ValidationTrygdeOrdningerProps>(v, `${namespace}-${personID}-retttilytelserfsed`, validateTrygdeOrdninger, {
    perioderMedYtelser, ikkeRettTilYtelser, rettTilFamilieYtelser, personName
  }, true))


  return hasErrors.find(value => value) !== undefined
}
