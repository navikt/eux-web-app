import {ReplySed} from "../../../declarations/sed";
import {Validation} from "../../../declarations/types";

export interface ValidateAktivitetOgTrygdeperioderProps {
  replySed: ReplySed
  personID: string
  personName: string | undefined
}

export const validateAktivitetOgTrygdeperioder = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personID,
    personName
  } : ValidateAktivitetOgTrygdeperioderProps
): boolean => {
  const hasErrors: Array<boolean> = []


  return hasErrors.find(value => value) !== undefined
}
