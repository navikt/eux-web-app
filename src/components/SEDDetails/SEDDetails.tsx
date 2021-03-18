import Edit from 'assets/icons/Edit'
import FilledRemoveCircle from 'assets/icons/filled-version-remove-circle'
import { ReplySed } from 'declarations/sed.d'
import { Undertittel } from 'nav-frontend-typografi'
import { HighContrastPanel, HighContrastFlatknapp, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import NavHighContrast from 'nav-hoykontrast'
import SEDDetailsEdit from './SEDDetailsEdit'
import SEDDetailsView from './SEDDetailsView'

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
`
interface SEDDetailsProps {
  highContrast: boolean
  replySed: ReplySed
}

const SEDDetails = ({ highContrast, replySed }: SEDDetailsProps) => {
  const { t } = useTranslation()
  const [isEditing, setIsEditing ] = useState<boolean>(false)

  const toggleEditing = () => setIsEditing(!isEditing)
  if (!replySed) {
    return <div/>
  }

  return (
    <NavHighContrast highContrast={highContrast}>
    <HighContrastPanel>
      <FlexDiv>
        <Undertittel>
        {t('ui:label-rinasaksnummer') + ': ' + replySed.saksnummer}
        </Undertittel>
        <HighContrastFlatknapp kompakt style={{
          marginTop: '-0.5rem',
          marginRight: '-0.5rem'
        }}>
          {isEditing ? <FilledRemoveCircle onClick={toggleEditing}/> : <Edit onClick={toggleEditing}/>}
        </HighContrastFlatknapp>
      </FlexDiv>
      <VerticalSeparatorDiv />
      {isEditing ? <SEDDetailsEdit replySed={replySed} onSave={toggleEditing} onCancel={toggleEditing}/> :
        <SEDDetailsView replySed={replySed}/>}
    </HighContrastPanel>
    </NavHighContrast>

  )
}

export default SEDDetails
