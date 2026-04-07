import { RettTilDagpenger } from 'declarations/pd'
import { Validation } from 'declarations/types'
import {validatePeriode} from "components/Forms/validation";
import {Periode} from "declarations/sed";

export interface ValidationRettTilDagpengerProps {
  rettTilDagpenger: RettTilDagpenger | undefined
}

export const validateRettTilDagpenger = (
  v: Validation,
  namespace: string,
  {
    rettTilDagpenger
  }: ValidationRettTilDagpengerProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if(rettTilDagpenger){
    hasErrors.push(validatePeriode(v, namespace, {
      periode: rettTilDagpenger as Periode
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
