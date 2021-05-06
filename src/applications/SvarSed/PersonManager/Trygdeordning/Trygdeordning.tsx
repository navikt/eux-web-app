import DekkedePerioder from 'applications/SvarSed/PersonManager/Trygdeordning/DekkedePerioder'
import FamilieYtelser from 'applications/SvarSed/PersonManager/Trygdeordning/FamilieYtelser'
import UdekkedePerioder from 'applications/SvarSed/PersonManager/Trygdeordning/UdekkedePerioder'
import { PaddedDiv } from 'components/StyledComponents'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import { VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface TrygdeordningProps {
  highContrast: boolean
  parentNamespace: string
  personID: string
  personName: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  updateReplySed: (needle: string, value: any) => void
  validation: Validation
}

const Trygdeordning: React.FC<TrygdeordningProps> = ({
  highContrast,
  parentNamespace,
  personID,
  personName,
  replySed,
  resetValidation,
  updateReplySed,
  validation
}: TrygdeordningProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <PaddedDiv>
      <Undertittel className='slideInFromLeft'>
        {t('label:dekning-trygdeordningen')}
      </Undertittel>
      <>
        <VerticalSeparatorDiv size={3} />

        <DekkedePerioder
          highContrast={highContrast}
          parentNamespace={parentNamespace}
          personID={personID}
          personName={personName}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />

        <VerticalSeparatorDiv size={3} />

        <UdekkedePerioder
          highContrast={highContrast}
          parentNamespace={parentNamespace}
          personID={personID}
          personName={personName}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />

        <VerticalSeparatorDiv size={3} />

        <FamilieYtelser
          highContrast={highContrast}
          parentNamespace={parentNamespace}
          personID={personID}
          personName={personName}
          replySed={replySed}
          resetValidation={resetValidation}
          updateReplySed={updateReplySed}
          validation={validation}
        />
      </>
    </PaddedDiv>
  )
}

export default Trygdeordning
