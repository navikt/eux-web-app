import { Validation } from 'declarations/types'
import {SvarYtelseTilForeldreloese_V42, SvarYtelseTilForeldreloese_V43} from "../../../declarations/sed";
import {checkIfFilledOut} from "../../../utils/validation";
import performValidation from "../../../utils/performValidation";
import {validatePersonopplysninger, ValidationPersonopplysningerProps} from "../PersonOpplysninger/validation";
import {validatePersonBasic} from "../PersonBasic/validation";

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
    if(personInfo && Object.values(personInfo).every(el => el !== undefined)){
      const pNameSpace = namespace + '-anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.avdoede-personopplysninger'
      hasErrors.push(performValidation<ValidationPersonopplysningerProps>(v, pNameSpace, validatePersonopplysninger, {
        personInfo
      }, true))
    }
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
    if(personInfo && Object.values(personInfo).every(el => el !== undefined)){
      const pNameSpace = namespace + '-anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.barnet-personbasic'
      hasErrors.push(performValidation<ValidationPersonopplysningerProps>(v, pNameSpace, validatePersonBasic, {
        personInfo
      }, true))
    }
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
    if(personInfo && Object.values(personInfo).every(el => el !== undefined)){
      const pNameSpace = namespace + '-anmodningOmMerInformasjon.svar.ytelseTilForeldreloese.annenPerson-personbasic'
      hasErrors.push(performValidation<ValidationPersonopplysningerProps>(v, pNameSpace, validatePersonBasic, {
        personInfo
      }, true))
    }
  }

  return hasErrors.find(value => value) !== undefined
}
