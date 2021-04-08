import Edit from 'assets/icons/Edit'
import FilledRemoveCircle from 'assets/icons/RemoveCircle'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed.d'
import { Undertittel } from 'nav-frontend-typografi'
import NavHighContrast, { HighContrastPanel, HighContrastFlatknapp, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import SEDDetailsEdit from './SEDDetailsEdit'
import SEDDetailsView from './SEDDetailsView'

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
`
interface SEDDetailsProps {
  highContrast: boolean
}

const SEDDetails = ({ highContrast }: SEDDetailsProps) => {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const replySed: ReplySed | undefined = useSelector((state: State): ReplySed | undefined => (state.svarpased.replySed))
  const toggleEditing = () => setIsEditing(!isEditing)
  if (!replySed) {
    return <div />
  }

  return (
    <NavHighContrast highContrast={highContrast}>
      <HighContrastPanel>
        <FlexDiv>
          <Undertittel>
            {t('label:rina-saksnummer') + ': ' + replySed.saksnummer}
          </Undertittel>
          <HighContrastFlatknapp
            kompakt style={{
              marginTop: '-0.5rem',
              marginRight: '-0.5rem'
            }}
          >
            {isEditing ? <FilledRemoveCircle onClick={toggleEditing} /> : <Edit onClick={toggleEditing} />}
          </HighContrastFlatknapp>
        </FlexDiv>
        <VerticalSeparatorDiv />
        {isEditing
          ? <SEDDetailsEdit replySed={replySed} onSave={toggleEditing} onCancel={toggleEditing} />
          : <SEDDetailsView replySed={replySed} />}
      </HighContrastPanel>
    </NavHighContrast>

  )
}

export default SEDDetails
