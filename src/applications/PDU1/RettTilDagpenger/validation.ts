import { IkkeRettTilDagpenger, RettTilDagpenger } from 'declarations/pd'
import { Validation } from 'declarations/types'
import {checkValidDateFormat} from "../../../utils/validation";

export interface ValidationRettTilDagpengerProps {
  rettTilDagpenger: RettTilDagpenger | undefined
  ikkeRettTilDagpenger: IkkeRettTilDagpenger |undefined
}

export const validateRettTilDagpenger = (
  v: Validation,
  namespace: string,
  {
    rettTilDagpenger,
    ikkeRettTilDagpenger
  }: ValidationRettTilDagpengerProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if(rettTilDagpenger && rettTilDagpenger.startdato){
    hasErrors.push(checkValidDateFormat(v, {
      needle: rettTilDagpenger.startdato,
      id: namespace + '-startdato',
      message: 'validation:invalidDateFormat',
    }))
  }

  if(rettTilDagpenger && rettTilDagpenger.sluttdato){
    hasErrors.push(checkValidDateFormat(v, {
      needle: rettTilDagpenger.sluttdato,
      id: namespace + '-sluttdato',
      message: 'validation:invalidDateFormat',
    }))
  }

  console.log(ikkeRettTilDagpenger)

  return hasErrors.find(value => value) !== undefined
}
