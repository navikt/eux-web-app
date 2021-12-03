import { resetValidation } from 'actions/validation'
import { PersonManagerFormProps, PersonManagerFormSelector } from 'applications/SvarSed/PersonManager/PersonManager'
import { State } from 'declarations/reducers'
import { Adresse as IAdresse } from 'declarations/sed'
import _ from 'lodash'
import { Heading } from '@navikt/ds-react'
import { PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import AdresseForm from './AdresseForm'

const mapState = (state: State): PersonManagerFormSelector => ({
  validation: state.validation.status
})

const Adresser: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  replySed,
  updateReplySed
}: PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation }: PersonManagerFormSelector = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = `${personID}.adresser[0]`
  const adresse: IAdresse = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-adresser[0]`

  const setAdresse = (adresse: IAdresse) => {
    dispatch(updateReplySed(target, adresse))
  }

  const onValidationReset = (fullnamespace: string) => {
    if (validation[fullnamespace]) {
      dispatch(resetValidation(fullnamespace))
    }
  }

  return (
    <PaddedDiv key={namespace + '-div'}>
      <Heading size='small'>
        {t('label:adresse')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AdresseForm
        type={false}
        namespace={namespace}
        adresse={adresse}
        onAdressChanged={setAdresse}
        validation={validation}
        resetValidation={onValidationReset}
      />
    </PaddedDiv>
  )
}

export default Adresser
