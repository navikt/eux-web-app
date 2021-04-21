import DekkedePerioder from 'applications/SvarSed/FamilyManager/Trygdeordning/DekkedePerioder'
import FamilieYtelser from 'applications/SvarSed/FamilyManager/Trygdeordning/FamilieYtelser'
import UdekkedePerioder from 'applications/SvarSed/FamilyManager/Trygdeordning/UdekkedePerioder'
import { PaddedDiv } from 'components/StyledComponents'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { Undertittel } from 'nav-frontend-typografi'
import { VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface TrygdeordningProps {
  highContrast: boolean
  updateReplySed: (needle: string, value: any) => void
  personID: string
  personName: string
  replySed: ReplySed
  resetValidation: (key?: string) => void
  validation: Validation
}

const Trygdeordning: React.FC<TrygdeordningProps> = ({
  highContrast,
  updateReplySed,
  personID,
  personName,
  replySed,
  resetValidation,
  validation
}: TrygdeordningProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <PaddedDiv>
      <Undertittel className='slideInFromLeft'>
        {t('el:title-dekning-trygdeordningen')}
      </Undertittel>
      <>
        <VerticalSeparatorDiv data-size={3} />

        <DekkedePerioder
          highContrast={highContrast}
          updateReplySed={updateReplySed}
          personID={personID}
          personName={personName}
          replySed={replySed}
          resetValidation={resetValidation}
          validation={validation}
        />

        <VerticalSeparatorDiv data-size={3} />

        <UdekkedePerioder
          highContrast={highContrast}
          updateReplySed={updateReplySed}
          personID={personID}
          personName={personName}
          replySed={replySed}
          resetValidation={resetValidation}
          validation={validation}
        />

        <VerticalSeparatorDiv data-size={3} />

        <FamilieYtelser
          highContrast={highContrast}
          updateReplySed={updateReplySed}
          personID={personID}
          personName={personName}
          replySed={replySed}
          resetValidation={resetValidation}
          validation={validation}
        />
      </>
    </PaddedDiv>
  )
}

export default Trygdeordning
