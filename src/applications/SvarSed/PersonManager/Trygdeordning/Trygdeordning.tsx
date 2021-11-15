import { PersonManagerFormProps } from 'applications/SvarSed/PersonManager/PersonManager'
import DekkedePerioder from 'applications/SvarSed/PersonManager/Trygdeordning/DekkedePerioder'
import FamilieYtelser from 'applications/SvarSed/PersonManager/Trygdeordning/FamilieYtelser'
import UdekkedePerioder from 'applications/SvarSed/PersonManager/Trygdeordning/UdekkedePerioder'
import { Undertittel } from 'nav-frontend-typografi'
import { PaddedDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Trygdeordning: React.FC<PersonManagerFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  setReplySed
}: PersonManagerFormProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <PaddedDiv>
      <Undertittel className='slideInFromLeft'>
        {t('label:dekning-trygdeordningen')}
      </Undertittel>
      <>
        <VerticalSeparatorDiv size={2} />

        <DekkedePerioder
          parentNamespace={parentNamespace}
          personID={personID}
          personName={personName}
          replySed={replySed}
          updateReplySed={updateReplySed}
          setReplySed={setReplySed}
        />

        <VerticalSeparatorDiv size={2} />

        <UdekkedePerioder
          parentNamespace={parentNamespace}
          personID={personID}
          personName={personName}
          replySed={replySed}
          updateReplySed={updateReplySed}
          setReplySed={setReplySed}
        />

        <VerticalSeparatorDiv size={2} />

        <FamilieYtelser
          parentNamespace={parentNamespace}
          personID={personID}
          personName={personName}
          replySed={replySed}
          updateReplySed={updateReplySed}
          setReplySed={setReplySed}
        />
      </>
    </PaddedDiv>
  )
}

export default Trygdeordning
