import { validatePeriode } from 'components/Forms/validation'
import { RettTilYtelse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import {checkIfNotEmpty} from "../../../utils/validation";
import _ from 'lodash'

export interface ValidationRettTilYtelseProps {
  rettTilYtelse: RettTilYtelse | undefined
}

export const validateRettTilYtelse = (
  v: Validation,
  namespace: string,
  {
    rettTilYtelse
  }: ValidationRettTilYtelseProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: rettTilYtelse,
    id: namespace + '-retttilstønad',
    message: 'validation:noRettTilStønad'
  }))

  if(!_.isNil(rettTilYtelse?.bekreftelsesgrunn)){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: rettTilYtelse?.bekreftelsesgrunn,
      id: namespace + '-bekreftelsesgrunn',
      message: 'validation:noBekreftelsesgrunn'
    }))

    hasErrors.push(validatePeriode(v, namespace + '-periode', {
      periode: rettTilYtelse?.periode
    }))
  }

  if(!_.isNil(rettTilYtelse?.avvisningsgrunn)){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: rettTilYtelse?.avvisningsgrunn,
      id: namespace + '-avvisningsgrunn',
      message: 'validation:noAvvisningsgrunn'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
