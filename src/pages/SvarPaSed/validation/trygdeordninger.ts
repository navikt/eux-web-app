import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

const validatePeriod = (category: string, v: Validation, t: any, options: any, personID: string) => {

  let personFail = false
  let trygdeordningFail = false
  const p = _.get(options.replySed, `${personID}`)
  const per = _.get(options.replySed, `${personID}.${category}`)
  const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn

  console.log(category, personID, per)
  per?.forEach((_p: Periode, i: number) => {
    let value = (_p.startdato)
      ? undefined
      : {
        feilmelding: t('ui:validation-noStartDato', { person: personName }),
        skjemaelementId: 'c-familymanager-' + personID + '-trygdeordninger-' + '-' + category + '-' + i + '-startdato-input'
      } as FeiloppsummeringFeil
    v['person-' + personID + personID + '-trygdeordninger-' + '-' + category + '-' + i + '-startdato'] = value
    if (value) {
      personFail = true
      trygdeordningFail = true
    }

    const personTrygdeordningFailMessage = trygdeordningFail ?
      {
        feilmelding: 'notnull', skjemaelementId: ''
      } as FeiloppsummeringFeil
      : undefined

    if (! (v['person-' + personID + '-trygdeordningFail'] !== undefined &&
      personTrygdeordningFailMessage === undefined) ) {
      v['person-' + personID + '-trygdeordningFail'] = personTrygdeordningFailMessage
    }

    const personFailMessage = personFail ?
      {
        feilmelding: 'notnull', skjemaelementId: ''
      } as FeiloppsummeringFeil
      : undefined
    if (! (v['person-' + personID] !== undefined && personFailMessage === undefined) ) {
      v['person-' + personID] = personFailMessage
    }
  })
}

export const validateTrygdeordninger = (v: Validation, t: any, options: any, personID: string): void => {
  validatePeriod('perioderMedArbeid', v, t, options, personID)
  validatePeriod('perioderMedTrygd', v, t, options, personID)
  validatePeriod('perioderMedITrygdeordning', v, t, options, personID)
  validatePeriod('perioderUtenforTrygdeordning', v, t, options, personID)
  validatePeriod('perioderMedYtelser', v, t, options, personID)
  //validatePeriod('perioderMedPensjon', v, t, options, personID)
}
