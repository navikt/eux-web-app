import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import { State } from 'declarations/reducers'
import { Adresse as IAdresse } from 'declarations/sed'
import _ from 'lodash'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AdresseForm from 'applications/SvarSed/PersonManager/Adresser/AdresseForm'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const Adresse: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}: PersonManagerFormProps): JSX.Element => {
  const { validation }: PersonManagerFormSelector = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = `${personID}.adresse`
  const adresse: IAdresse = _.get(replySed, target)
  const namespace = `${parentNamespace}-adresse`

  const setAdresse = (adresse: IAdresse, whatChanged: string | undefined) => {
    dispatch(updateReplySed(target, adresse))
    if (whatChanged && validation[namespace + '-' + whatChanged]) {
      dispatch(resetValidation(namespace + '-' + whatChanged))
    }
  }

  return (
    <AdresseForm
      type={false}
      options={{ bygning: false, region: false }}
      required={['gate', 'postnummer', 'by', 'land']}
      keyForCity='poststed'
      keyforZipCode='postnr'
      useUK
      namespace={namespace}
      adresse={adresse}
      onAdressChanged={setAdresse}
      validation={validation}
    />
  )
}

export default Adresse
