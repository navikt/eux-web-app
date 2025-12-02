import {RettIkkeRettTilFamilieYtelse} from "../../../declarations/sed";
import {Validation} from "../../../declarations/types";
import {addError} from "../../../utils/validation";


export interface ValidationPerioderMedRettTilYtelserProps {
  perioderMedRettTilYtelser?: Array<RettIkkeRettTilFamilieYtelse> | undefined
}

export const validatePerioderMedRettTilYtelser = (
  v: Validation,
  namespace: string,
  {
    perioderMedRettTilYtelser,
  }: ValidationPerioderMedRettTilYtelserProps
): boolean => {
  const hasErrors: Array<boolean> = []

  const rettTilFamilieytelserIndex = perioderMedRettTilYtelser ? perioderMedRettTilYtelser.findIndex((o => o.rettTilFamilieytelser !== undefined)) : -1
  const ikkeRettTilFamilieytelserIndex = perioderMedRettTilYtelser ? perioderMedRettTilYtelser.findIndex((o => o.ikkeRettTilFamilieytelser !== undefined)) : -1

  if(rettTilFamilieytelserIndex >= 0 ){
    const perioderMedRettTilFamilieytelser = perioderMedRettTilYtelser && rettTilFamilieytelserIndex !== undefined ? perioderMedRettTilYtelser[rettTilFamilieytelserIndex]?.rettTilFamilieytelser : undefined
    if(perioderMedRettTilFamilieytelser === undefined || perioderMedRettTilFamilieytelser.length === 0){
      hasErrors.push(addError(v, {
        id: namespace + '-periodermedretttilfamilieytelser',
        message: 'validation:noPerioder'
      }))
    }
  }

  if(ikkeRettTilFamilieytelserIndex >= 0){
    const perioderMedIkkeRettTilFamilieytelser = perioderMedRettTilYtelser && ikkeRettTilFamilieytelserIndex !== undefined ? perioderMedRettTilYtelser[ikkeRettTilFamilieytelserIndex]?.ikkeRettTilFamilieytelser : undefined
    if(perioderMedIkkeRettTilFamilieytelser === undefined || perioderMedIkkeRettTilFamilieytelser.length === 0){
      hasErrors.push(addError(v, {
        id: namespace + '-periodermedikkeretttilfamilieytelser',
        message: 'validation:noPerioder'
      }))
    }
  }

  return hasErrors.find(value => value) !== undefined
}
