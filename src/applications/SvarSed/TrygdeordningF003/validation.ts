import {Validation} from "declarations/types";
import {getIdx} from "utils/namespace";
import {validatePeriode} from "components/Forms/validation";
import {checkIfDuplicate, checkIfNotEmpty} from "utils/validation";
import {Periode} from "declarations/sed";

export interface ValidationFamilieYtelsePeriodeProps {
  periode: Periode | undefined
  perioder: Array<Periode> | undefined
  index?: number
  personName?: string
}

export interface ValidationTrygdeOrdningerProps {
  perioderMedYtelser: Array<Periode> | undefined
  ikkeRettTilYtelser: any | undefined
  rettTilFamilieYtelser: string |undefined
  personName?: string
}

export const validateFamilieYtelsePeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    index,
    personName
  }: ValidationFamilieYtelsePeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(validatePeriode(v, namespace + '-perioderMedYtelser' + idx, {
    periode,
    personName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: periode,
    haystack: perioder,
    matchFn: (p: Periode) => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato,
    id: namespace + '-perioderMedYtelser' + idx + '-startdato',
    message: 'validation:duplicateStartdato',
    index,
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}


export const validateTrygdeOrdninger = (
  v: Validation,
  namespace: string,
  {
    perioderMedYtelser,
    ikkeRettTilYtelser,
    rettTilFamilieYtelser,
    personName
  }: ValidationTrygdeOrdningerProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if(rettTilFamilieYtelser === "ja"){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: perioderMedYtelser,
      id: namespace + '-perioderMedYtelser',
      message: 'validation:noPerioder'
    }))
  }

  if(rettTilFamilieYtelser === "nei"){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: ikkeRettTilYtelser?.typeGrunn,
      id: namespace + '-ikkeRettTilYtelser',
      message: 'validation:noType'
    }))
  }

  perioderMedYtelser?.forEach((periode: Periode, index: number) => {
    hasErrors.push(validateFamilieYtelsePeriode(v, namespace, { periode: periode, perioder: perioderMedYtelser, index, personName }))
  })

  if(ikkeRettTilYtelser && ikkeRettTilYtelser.typeGrunn === "annen"){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: ikkeRettTilYtelser.typeGrunnAnnen,
      id: namespace + '-ikkeRettTilYtelser-typeGrunnAnnen',
      message: 'validation:noAnnenTypeGrunn'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
