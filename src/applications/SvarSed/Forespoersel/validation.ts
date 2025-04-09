import { Validation } from 'declarations/types'

export interface ValidationForespoerselProps {
  forespoersel: any | undefined
}

export const validateForespoersel = (
  v: Validation,
  namespace: string,
  {
    forespoersel
  }: ValidationForespoerselProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(v, namespace, forespoersel)

  return hasErrors.find(value => value) !== undefined
}
