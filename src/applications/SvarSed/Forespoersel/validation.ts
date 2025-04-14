import { Validation } from 'declarations/types'

export interface ValidationForespoerselProps {
  sykdom: any | undefined
}

export const validateForespoersel = (
  v: Validation,
  namespace: string,
  {
    sykdom
  }: ValidationForespoerselProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(v, namespace, sykdom)

  return hasErrors.find(value => value) !== undefined
}
