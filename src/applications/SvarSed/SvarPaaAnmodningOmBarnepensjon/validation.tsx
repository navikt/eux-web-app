import { Validation } from 'declarations/types'
import {SvarYtelseTilForeldreloese_V42, SvarYtelseTilForeldreloese_V43} from "../../../declarations/sed";
import {checkIfFilledOut, checkLength} from "../../../utils/validation";
import performValidation from "../../../utils/performValidation";
import {validatePersonopplysninger, ValidationPersonopplysningerProps} from "../PersonOpplysninger/validation";
import {validatePersonBasic} from "../PersonBasic/validation";
import {validateAdresse, ValidationAdresseProps} from "../Adresser/validation";
import {validateRelasjoner} from "./RelasjonForeldreloeseBarnetOgAvdoede/validation";

export interface ValidationYtelseTilForeldreloeseProps {
  svarYtelseTilForeldreloese: SvarYtelseTilForeldreloese_V42 | SvarYtelseTilForeldreloese_V43 | undefined,
  label?: string | undefined,
  CDM_VERSJON: string | undefined
}

export const validateYtelseTilForeldreloese = (
  v: Validation,
  namespace: string,
  {
    svarYtelseTilForeldreloese,
    label,
    CDM_VERSJON
  }: ValidationYtelseTilForeldreloeseProps
): boolean => {
  const hasErrors: Array<boolean> = []


  hasErrors.push(checkIfFilledOut(v, {
    needle: svarYtelseTilForeldreloese,
    id: namespace + '-content',
    message: 'validation:du-maa-fylle-ut',
    extra: {
      type: label?.toLowerCase()
    }
  }))

  hasErrors.push(performValidation<ValidationYtelseTilForeldreloeseProps>(v, namespace + '-identifisering-av-den-avdoede', validateIdentifiseringAvAvdoede, {
    svarYtelseTilForeldreloese: svarYtelseTilForeldreloese,
    CDM_VERSJON: CDM_VERSJON
  }, true))

  hasErrors.push(performValidation<ValidationYtelseTilForeldreloeseProps>(v, namespace + '-identifisering-av-de-beroerte-barna', validateIdentifiseringAvDeBeroerteBarna, {
    svarYtelseTilForeldreloese: svarYtelseTilForeldreloese,
    CDM_VERSJON: CDM_VERSJON
  }, true))

  hasErrors.push(performValidation<ValidationYtelseTilForeldreloeseProps>(v, namespace + '-identifikasjon-av-andre-personer', validateIdentifiseringAvAnnenPerson, {
    svarYtelseTilForeldreloese: svarYtelseTilForeldreloese,
    CDM_VERSJON: CDM_VERSJON
  }, true))

  hasErrors.push(performValidation<ValidationYtelseTilForeldreloeseProps>(v, namespace + '-den-foreldreloeses-barnets-bosted', validateForeldreloesesBarnetsBosted, {
    svarYtelseTilForeldreloese: svarYtelseTilForeldreloese,
    CDM_VERSJON: CDM_VERSJON
  }, true))

  hasErrors.push(performValidation<ValidationYtelseTilForeldreloeseProps>(v, namespace + '-relasjonen-mellom-den-foreldreloese-barnet-og-avdoede', validateRelasjoner, {
    svarYtelseTilForeldreloese: svarYtelseTilForeldreloese,
    CDM_VERSJON: CDM_VERSJON
  }, true))

  hasErrors.push(performValidation<ValidationYtelseTilForeldreloeseProps>(v, namespace + '-relasjon-mellom-annen-person-og-avdoede', validateRelasjoner, {
    svarYtelseTilForeldreloese: svarYtelseTilForeldreloese,
    CDM_VERSJON: CDM_VERSJON
  }, true))

  return hasErrors.find(value => value) !== undefined
}

export const validateIdentifiseringAvAvdoede = (
  v: Validation,
  namespace: string,
  {
    svarYtelseTilForeldreloese,
    CDM_VERSJON
  }: ValidationYtelseTilForeldreloeseProps
): boolean => {

  const hasErrors: Array<boolean> = []

  if(CDM_VERSJON === "4.3"){
    const personInfo = (svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V43)?.avdoede?.personInfo
    if(personInfo && Object.values(personInfo).every(el => (el !== undefined && el !== ""))){
      const pNameSpace = namespace + '-anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.avdoede-personopplysninger'
      hasErrors.push(performValidation<ValidationPersonopplysningerProps>(v, pNameSpace, validatePersonopplysninger, {
        personInfo
      }, true))
    }
  } else {
    const identifiseringFritekst = (svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V42)?.avdoede?.identifiseringFritekst
    hasErrors.push(checkLength(v, {
      needle: identifiseringFritekst,
      max: 500,
      id: namespace + '-avdoede-identifisering',
      message: 'validation:textOverX'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateIdentifiseringAvDeBeroerteBarna = (
  v: Validation,
  namespace: string,
  {
    svarYtelseTilForeldreloese,
    CDM_VERSJON
  }: ValidationYtelseTilForeldreloeseProps
): boolean => {

  const hasErrors: Array<boolean> = []

  if(CDM_VERSJON === "4.3"){
    const personInfo = (svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V43)?.barnet?.personInfo
    if(personInfo && Object.values(personInfo).every(el => (el !== undefined && el !== ""))){
      const pNameSpace = namespace + '-anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.barnet-personbasic'
      hasErrors.push(performValidation<ValidationPersonopplysningerProps>(v, pNameSpace, validatePersonBasic, {
        personInfo
      }, true))
    }
  } else {
    const identifiseringFritekst = (svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V42)?.barnet?.identifiseringFritekst
    hasErrors.push(checkLength(v, {
      needle: identifiseringFritekst,
      max: 500,
      id: namespace + '-barnet-identifisering',
      message: 'validation:textOverX'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateIdentifiseringAvAnnenPerson = (
  v: Validation,
  namespace: string,
  {
    svarYtelseTilForeldreloese,
    CDM_VERSJON
  }: ValidationYtelseTilForeldreloeseProps
): boolean => {

  const hasErrors: Array<boolean> = []

  if(CDM_VERSJON === "4.3"){
    const personInfo = (svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V43)?.annenPerson?.personInfo
    if(personInfo && Object.values(personInfo).every(el => (el !== undefined && el !== ""))){
      const pNameSpace = namespace + '-anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.annenPerson-personbasic'
      hasErrors.push(performValidation<ValidationPersonopplysningerProps>(v, pNameSpace, validatePersonBasic, {
        personInfo
      }, true))
    }
  } else {
    const identifiseringFritekst = (svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V42)?.annenPerson?.identifiseringFritekst
    hasErrors.push(checkLength(v, {
      needle: identifiseringFritekst,
      max: 500,
      id: namespace + '-annen-person-identifisering',
      message: 'validation:textOverX'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateForeldreloesesBarnetsBosted = (
  v: Validation,
  namespace: string,
  {
    svarYtelseTilForeldreloese,
    CDM_VERSJON
  }: ValidationYtelseTilForeldreloeseProps
): boolean => {

  const hasErrors: Array<boolean> = []

  if(CDM_VERSJON === "4.3"){
    const adresse = (svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V43)?.barnet?.adresse
    console.log(adresse)
    if(adresse && Object.values(adresse).every(el => (el !== undefined && el !== ""))){
      hasErrors.push(performValidation<ValidationAdresseProps>(v, namespace, validateAdresse, {
        adresse,
        checkAdresseType: false
      }, true))
    }

  } else {
    const bostedFritekst = (svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V42)?.barnet?.bostedfritekst
    hasErrors.push(checkLength(v, {
      needle: bostedFritekst,
      max: 500,
      id: namespace + '-barnet-bosted',
      message: 'validation:textOverX'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
