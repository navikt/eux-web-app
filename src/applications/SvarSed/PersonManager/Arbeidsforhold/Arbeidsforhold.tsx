import ArbeidsforholdMedForsikring from 'applications/SvarSed/PersonManager/Arbeidsforhold/ArbeidsforholdMedForsikring'
import { PersonManagerFormProps } from 'applications/SvarSed/PersonManager/PersonManager'
import React from 'react'

const Arbeidsforhold: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID
}:PersonManagerFormProps): JSX.Element => {
  return (
    <ArbeidsforholdMedForsikring
      parentNamespace={`${parentNamespace}-${personID}-arbeidsforhold`}
      target='perioderAnsattMedForsikring'
      typeTrygdeforhold='ansettelsesforhold_som_utgjør_forsikringsperiode'
    />
  )
}

export default Arbeidsforhold
