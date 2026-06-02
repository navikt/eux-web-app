import { resetValidation } from 'actions/validation'
import { MainFormProps, MainFormSelector } from 'applications/SvarSed/MainForm'
import { State } from 'declarations/reducers'
import { Adresse as IAdresse } from 'declarations/sed'
import _ from 'lodash'
import React, { JSX } from 'react';
import AdresseForm from 'applications/SvarSed/Adresser/AdresseForm'
import { useAppDispatch, useAppSelector } from 'store'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const Adresse: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}: MainFormProps): JSX.Element => {
  const { validation }: MainFormSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const target = `${personID}.adresse`
  const adresse: IAdresse | undefined = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-adresse`

  const setAdresse = (adresse: IAdresse, whatChanged: string | undefined) => {
    dispatch(updateReplySed(target, adresse))
    if (whatChanged && validation[namespace + '-' + whatChanged]) {
      dispatch(resetValidation(namespace + '-' + whatChanged))
    }
  }

  return (
    <AdresseForm
      type={false}
      options={{ bygning: true, region: true }}
      required={['by', 'land']}
      namespace={namespace}
      adresse={adresse}
      onAdressChanged={setAdresse}
      validation={validation}
    />
  )
}

export default Adresse
