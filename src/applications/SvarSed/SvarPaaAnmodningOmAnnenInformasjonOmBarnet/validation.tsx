import { Validation } from 'declarations/types'
import {
  AnnenInformasjonBarnet_V42,
  AnnenInformasjonBarnet_V43,
} from "../../../declarations/sed";
import {checkIfFilledOut} from "../../../utils/validation";

export interface ValidationAnnenInformasjonBarnetProps {
  annenInformasjonBarnet: AnnenInformasjonBarnet_V42 | AnnenInformasjonBarnet_V43 | undefined,
  label: string | undefined
}

export const validateAnnenInformasjonBarnet = (
  v: Validation,
  namespace: string,
  {
    annenInformasjonBarnet,
    label
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

  return hasErrors.find(value => value) !== undefined
}
