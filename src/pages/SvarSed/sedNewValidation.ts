import {OldFamilieRelasjon, Validation} from 'declarations/types'
import {addError, checkIfNotEmpty, checkIfNotTrue, ValidateValueParams} from 'utils/validation'
import _, {isEmpty} from "lodash";

export interface ValidationSEDNewProps {
  fnr: string
  isFnrValid: boolean
  sektor: string
  buctype: string
  sedtype: string
  landkode: string
  institusjon: string
  tema: string
  familierelasjoner:Array<OldFamilieRelasjon>
  saksId: string
  visEnheter: boolean
  unit: string
}

export const validateSEDNew = (
  v: Validation,
  namespace: string,
  {
    fnr,
    isFnrValid,
    sektor,
    buctype,
    sedtype,
    landkode,
    institusjon,
    tema,
    familierelasjoner,
    saksId,
    visEnheter,
    unit
  }: ValidationSEDNewProps
): boolean => {
  const hasErrors: Array<boolean> = []

  const checkIfHasChildren = (v: Validation, { needle, id, personName, message, extra }: ValidateValueParams): boolean => {
    const barn = needle.filter((relasjon: OldFamilieRelasjon) => {
      return relasjon.rolle === "BARN"
    })

    if (isEmpty(barn)) {
      return addError(v, { id, personName, message, extra })
    }
    return false
  }

  const checkIfOnlyOneEKTESAMBREPA = (v: Validation, { needle, id, personName, message, extra }: ValidateValueParams): boolean => {
    const ekteSambRepa = needle.filter((relasjon: OldFamilieRelasjon) => {
      return (relasjon.rolle === "EKTE" || relasjon.rolle === "SAMB" || relasjon.rolle === "REPA")
    })

    if (ekteSambRepa.length > 1) {
      return addError(v, { id, personName, message, extra })
    }
    return false
  }


  hasErrors.push(checkIfNotEmpty(v, {
    needle: fnr,
    id: namespace + '-fnr',
    message: 'validation:noFnr'
  }))

  hasErrors.push(checkIfNotTrue(v, {
    needle: isFnrValid,
    id: namespace + '-fnr',
    message: 'validation:uncheckedFnr'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sektor,
    id: namespace + '-sektor',
    message: 'validation:noSektor'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: buctype,
    id: namespace + '-buctype',
    message: 'validation:noBuctype'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sedtype,
    id: namespace + '-sedtype',
    message: 'validation:noSedtype'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: landkode,
    id: namespace + '-landkode',
    message: 'validation:noLand'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: institusjon,
    id: namespace + '-institusjon',
    message: 'validation:noInstitusjonsID'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: tema,
    id: namespace + '-tema',
    message: 'validation:noTema'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: saksId,
    id: namespace + '-saksId',
    message: 'validation:noSaksId'
  }))

  if (visEnheter) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: unit,
      id: namespace + '-unit',
      message: 'validation:noUnit'
    }))
  }

  if(sektor && sektor === "FB"){
    if(_.isEmpty(familierelasjoner)){
      hasErrors.push(addError(v, {
        id: namespace + '-familieRelasjoner',
        message: 'validation:noBarnValgt'
      }))
    }

    if(!_.isEmpty(familierelasjoner)){
      hasErrors.push(checkIfHasChildren(v, {
        needle: familierelasjoner,
        id: namespace + '-familieRelasjoner',
        message: 'validation:noBarnValgt'
      }))

      hasErrors.push(checkIfOnlyOneEKTESAMBREPA(v, {
        needle: familierelasjoner,
        id: namespace + '-familieRelasjoner',
        message: 'validation:onlyOneEKTESAMBREPAAllowed'
      }))
    }
  }


  return hasErrors.find(value => value) !== undefined
}
