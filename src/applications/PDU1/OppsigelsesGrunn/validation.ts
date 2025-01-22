import { Validation } from 'declarations/types'
import {Oppsigelsesgrunn} from "../../../declarations/pd";

export interface ValidationOppsigelsesGrunnProps {
  oppsigelsesGrunn: Oppsigelsesgrunn | undefined
}

export const validateOppsigelsesGrunn = (
  v: Validation,
  namespace: string,
  {
    oppsigelsesGrunn
  }: ValidationOppsigelsesGrunnProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(oppsigelsesGrunn)

  return hasErrors.find(value => value) !== undefined
}
