import { IkkeRettTilDagpenger, RettTilDagpenger } from 'declarations/pd'
import { Validation } from 'declarations/types'

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

  console.log(rettTilDagpenger, ikkeRettTilDagpenger)

  return hasErrors.find(value => value) !== undefined
}
