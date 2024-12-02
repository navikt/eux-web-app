import { Validation } from 'declarations/types'
import {
  AnnenInformasjonBarnet_V42,
  AnnenInformasjonBarnet_V43
} from "../../../declarations/sed";
import {checkIfFilledOut, checkIfNotEmpty, checkLength, doNothing} from "../../../utils/validation";
import performValidation from "../../../utils/performValidation";

export interface ValidationAnnenInformasjonBarnetProps {
  annenInformasjonBarnet: AnnenInformasjonBarnet_V42 | AnnenInformasjonBarnet_V43 | undefined,
  label?: string | undefined,
  CDM_VERSJON?: string | undefined
}

export interface ValidationAnnenInformasjonOmBarnetFritekstProps {
  fritekst?: string | undefined
}

export const validateAnnenInformasjonBarnet = (
  v: Validation,
  namespace: string,
  {
    annenInformasjonBarnet,
    label,
    CDM_VERSJON
  }: ValidationAnnenInformasjonBarnetProps
): boolean => {
  const hasErrors: Array<boolean> = []


  hasErrors.push(checkIfFilledOut(v, {
    needle: annenInformasjonBarnet,
    id: namespace + '-content',
    message: 'validation:du-maa-fylle-ut',
    extra: {
      type: label?.toLowerCase()
    }
  }))

  hasErrors.push(performValidation<ValidationAnnenInformasjonOmBarnetFritekstProps>(v, namespace + '-dagligOmsorg', validateAnnenInformasjonOmBarnetFritekst, {
    fritekst: annenInformasjonBarnet?.dagligOmsorg
  }, true))

  hasErrors.push(performValidation<ValidationAnnenInformasjonOmBarnetFritekstProps>(v, namespace + '-foreldreansvar', validateAnnenInformasjonOmBarnetFritekst, {
    fritekst: annenInformasjonBarnet?.foreldreansvar
  }, true))

  hasErrors.push(performValidation<ValidationAnnenInformasjonOmBarnetFritekstProps>(v, namespace + '-ytterligereInformasjon', validateAnnenInformasjonOmBarnetFritekst, {
    fritekst: annenInformasjonBarnet?.ytterligereInformasjon
  }, true))

  hasErrors.push(performValidation<ValidationAnnenInformasjonBarnetProps>(v, namespace + '-er-adoptert', validateErAdoptert, {
    annenInformasjonBarnet,
    CDM_VERSJON
  }, true))

  hasErrors.push(performValidation<ValidationAnnenInformasjonBarnetProps>(v, namespace + '-forsoerges-av-det-offentlige', validateForsoergesAvDetOffentlige, {
    annenInformasjonBarnet,
    CDM_VERSJON
  }, true))

  hasErrors.push(performValidation<ValidationAnnenInformasjonBarnetProps>(v, namespace + '-informasjon-om-barnehage', validateInformasjonOmBarnehage, {
    annenInformasjonBarnet,
    CDM_VERSJON
  }, true))

  hasErrors.push(performValidation<ValidationAnnenInformasjonBarnetProps>(v, namespace + '-barnets-sivilstand', validateBarnetsSivilstand, {
    annenInformasjonBarnet,
    CDM_VERSJON
  }, true))

  hasErrors.push(performValidation<ValidationAnnenInformasjonBarnetProps>(v, namespace + '-dato-for-endrede-forhold', validateDatoForEndredeForhold, {
    annenInformasjonBarnet,
    CDM_VERSJON
  }, true))

  return hasErrors.find(value => value) !== undefined
}

export const validateAnnenInformasjonOmBarnetFritekst = (
  v: Validation,
  namespace: string,
  {
    fritekst
  }: ValidationAnnenInformasjonOmBarnetFritekstProps
): boolean => {

  const hasErrors: Array<boolean> = []

  hasErrors.push(checkLength(v, {
    needle: fritekst,
    max: 500,
    id: namespace + '-fritekst',
    message: 'validation:textOverX'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateErAdoptert = (
  v: Validation,
  namespace: string,
  {
    annenInformasjonBarnet,
    CDM_VERSJON
  }: ValidationAnnenInformasjonBarnetProps
): boolean => {

  const hasErrors: Array<boolean> = []

  if(CDM_VERSJON === "4.2"){
    const eradoptertFritekst = (annenInformasjonBarnet as AnnenInformasjonBarnet_V42)?.eradoptertfritekst
    hasErrors.push(checkLength(v, {
      needle: eradoptertFritekst,
      max: 500,
      id: namespace + '-er-adoptert',
      message: 'validation:textOverX'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateForsoergesAvDetOffentlige = (
  v: Validation,
  namespace: string,
  {
    annenInformasjonBarnet,
    CDM_VERSJON
  }: ValidationAnnenInformasjonBarnetProps
): boolean => {

  const hasErrors: Array<boolean> = []

  if(CDM_VERSJON === "4.2"){
    const forsoergesavdetofentligeFritekst = (annenInformasjonBarnet as AnnenInformasjonBarnet_V42)?.forsoergesavdetoffentligefritekst
    hasErrors.push(checkLength(v, {
      needle: forsoergesavdetofentligeFritekst,
      max: 500,
      id: namespace + '-forsoerges-av-det-offentlige',
      message: 'validation:textOverX'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateInformasjonOmBarnehage = (
  v: Validation,
  namespace: string,
  {
    annenInformasjonBarnet,
    CDM_VERSJON
  }: ValidationAnnenInformasjonBarnetProps
): boolean => {

  const hasErrors: Array<boolean> = []

  if(CDM_VERSJON === "4.2"){
    const informasjonOmBarnehageFritekst = (annenInformasjonBarnet as AnnenInformasjonBarnet_V42)?.informasjonombarnehagefritekst
    hasErrors.push(checkLength(v, {
      needle: informasjonOmBarnehageFritekst,
      max: 500,
      id: namespace + '-informasjon-om-barnehage',
      message: 'validation:textOverX'
    }))
  } else {
    const barnehage = (annenInformasjonBarnet as AnnenInformasjonBarnet_V43)?.barnehage
    const gaarIBarnehage = barnehage?.gaarIBarnehage

    if(gaarIBarnehage && gaarIBarnehage === 'ja'){
      hasErrors.push(checkIfNotEmpty(v, {
        needle: barnehage?.mottarOffentligStoette,
        id: namespace + '-mottar-offentlig-stoette',
        message: 'validation:noMottarOffentligStoette'
      }))

      hasErrors.push(checkIfNotEmpty(v, {
        needle: barnehage?.timerPr,
        id: namespace + '-timer-pr',
        message: 'validation:noTimerPr'
      }))

      hasErrors.push(checkIfNotEmpty(v, {
        needle: barnehage?.timer,
        id: namespace + '-timer',
        message: 'validation:noTimer'
      }))
    }
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateBarnetsSivilstand = (
  v: Validation,
  namespace: string,
  {
    annenInformasjonBarnet,
    CDM_VERSJON
  }: ValidationAnnenInformasjonBarnetProps
): boolean => {

  const hasErrors: Array<boolean> = []

  if(CDM_VERSJON === "4.2"){
    const sivilstandFritekst = (annenInformasjonBarnet as AnnenInformasjonBarnet_V42)?.sivilstandfritekst
    hasErrors.push(checkLength(v, {
      needle: sivilstandFritekst,
      max: 500,
      id: namespace + '-barnets-sivilstand',
      message: 'validation:textOverX'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateDatoForEndredeForhold = (
  v: Validation,
  namespace: string,
  {
    annenInformasjonBarnet
  }: ValidationAnnenInformasjonBarnetProps
): boolean => {

  const hasErrors: Array<boolean> = []

  hasErrors.push(doNothing(v, {
    needle: annenInformasjonBarnet,
    id: namespace + '-dato-for-endrede-forhold',
    message: 'dummy'
  }))

  return hasErrors.find(value => value) !== undefined
}
