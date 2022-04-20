import { TwoLevelFormProps } from 'applications/SvarSed/TwoLevelForm'
import DekkedePerioder from 'applications/SvarSed/MainForm/Trygdeordning/DekkedePerioder'
import FamilieYtelser from 'applications/SvarSed/MainForm/Trygdeordning/FamilieYtelser'
import UdekkedePerioder from 'applications/SvarSed/MainForm/Trygdeordning/UdekkedePerioder'
import { Heading } from '@navikt/ds-react'
import { PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Trygdeordning: React.FC<TwoLevelFormProps> = ({
  parentNamespace,
  personID,
  personName,
  replySed,
  updateReplySed,
  setReplySed
}: TwoLevelFormProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <PaddedDiv>
      <Heading size='small'>
        {t('label:dekning-trygdeordningen')}
      </Heading>
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
