import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { MainFormProps } from 'applications/SvarSed/MainForm'
import DekkedePerioder from 'applications/SvarSed/Trygdeordning/DekkedePerioder'
import FamilieYtelser from 'applications/SvarSed/Trygdeordning/FamilieYtelser'
import React from 'react'

const Trygdeordning: React.FC<MainFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  setReplySed
}: MainFormProps): JSX.Element => {
  return (
    <>
      <DekkedePerioder
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
  )
}

export default Trygdeordning
