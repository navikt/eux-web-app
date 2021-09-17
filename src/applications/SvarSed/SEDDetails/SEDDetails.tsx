import Edit from 'assets/icons/Edit'
import RemoveCircle from 'assets/icons/RemoveCircle'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed.d'
import { Undertittel } from 'nav-frontend-typografi'
import { HighContrastPanel, HighContrastFlatknapp, VerticalSeparatorDiv, FlexCenterSpacedDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import SEDDetailsEdit from './SEDDetailsEdit'
import SEDDetailsView from './SEDDetailsView'

const SEDDetails = () => {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const replySed: ReplySed | undefined = useSelector((state: State): ReplySed | undefined => (state.svarpased.replySed))
  const toggleEditing = () => setIsEditing(!isEditing)

  if (!replySed) {
    return <div />
  }

  return (
    <HighContrastPanel border>
      <FlexCenterSpacedDiv>
        <Undertittel>
          {t('label:rina-saksnummer') + ': ' + replySed.saksnummer}
        </Undertittel>
        <HighContrastFlatknapp
          kompakt
          style={{
            marginTop: '-0.5rem',
            marginRight: '-0.5rem'
          }}
          onClick={toggleEditing}
        >
          {isEditing ? <RemoveCircle /> : <Edit />}
        </HighContrastFlatknapp>
      </FlexCenterSpacedDiv>
      <VerticalSeparatorDiv />
      {isEditing ? <SEDDetailsEdit replySed={replySed} /> : <SEDDetailsView replySed={replySed} />}
    </HighContrastPanel>

  )
}

export default SEDDetails
