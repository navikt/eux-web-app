import { Validation } from 'declarations/types'
import { LokaltSaksnummer } from 'declarations/u013'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationLokaleSaksnumreProps {
  lokaleSaksnumre?: Array<LokaltSaksnummer>
}

export const validateLokaleSaksnumre = (
  v: Validation,
  namespace: string,
  { lokaleSaksnumre }: ValidationLokaleSaksnumreProps
): boolean => {
  const hasErrors: Array<boolean> = []

  lokaleSaksnumre?.forEach((lokaltSaksnummer, index) => {
    const fieldNamespace = `${namespace}-${index}`
    hasErrors.push(checkIfNotEmpty(v, {
      needle: lokaltSaksnummer.landkode,
      id: `${fieldNamespace}-landkode`,
      message: 'validation:noU013LokaltSaksnummerLand'
    }))
    hasErrors.push(checkIfNotEmpty(v, {
      needle: lokaltSaksnummer.saksnummer,
      id: `${fieldNamespace}-saksnummer`,
      message: 'validation:noU013LokaltSaksnummerSaksnummer'
    }))
    hasErrors.push(checkIfNotEmpty(v, {
      needle: lokaltSaksnummer.institusjonsid,
      id: `${fieldNamespace}-institusjonsid`,
      message: 'validation:noU013LokaltSaksnummerInstitusjonsid'
    }))
    hasErrors.push(checkIfNotEmpty(v, {
      needle: lokaltSaksnummer.institusjonsnavn,
      id: `${fieldNamespace}-institusjonsnavn`,
      message: 'validation:noU013LokaltSaksnummerInstitusjonsnavn'
    }))
  })

  return hasErrors.some(Boolean)
}
