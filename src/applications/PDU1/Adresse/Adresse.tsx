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
  const { t } = useTranslation()
  const { validation }: PersonManagerFormSelector = useSelector<State, PersonManagerFormSelector>(mapState)
  const dispatch = useDispatch()
  const target = `${personID}.adresse`
  const adresse: IAdresse = _.get(replySed, target)
  const namespace = `${parentNamespace}-${personID}-adresse`

  const setAdresse = (adresse: IAdresse, whatChanged: string | undefined) => {
    dispatch(updateReplySed(target, adresse))
    if (whatChanged && validation[namespace + '-' + whatChanged]) {
      dispatch(resetValidation(namespace + '-' + whatChanged))
    }
  }

  return (
    <PaddedDiv key={namespace + '-div'}>
      <Heading size='medium'>
        {t('label:adresse')}
      </Heading>
      <VerticalSeparatorDiv size='2' />
      <AdresseForm
        type={false}
        options={{ bygning: false, region: false }}
        required={['gate', 'postnummer', 'by', 'land']}
        keyForCity='poststed'
        keyforZipCode='postnr'
        useUK={true}
        namespace={namespace}
        adresse={adresse}
        onAdressChanged={setAdresse}
        validation={validation}
      />
    </PaddedDiv>
  )
}

export default Adresse
