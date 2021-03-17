import Edit from 'assets/icons/Edit'
import { ReplySed } from 'declarations/sed.d'
import { Undertittel } from 'nav-frontend-typografi'
import { HighContrastPanel, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import SEDDetailsEdit from './SEDDetailsEdit'
import SEDDetailsView from './SEDDetailsView'

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
`
const EditIcon = styled(Edit)`
  cursor: pointer;
`
interface SEDDetailsProps {
  replySed: ReplySed
}

const SEDDetails = ({ replySed }: SEDDetailsProps) => {
  const { t } = useTranslation()
  const [isEditing, setIsEditing ] = useState<boolean>(false)

  const toggleEditing = () => setIsEditing(!isEditing)
  if (!replySed) {
    return <div/>
  }

  return (
    <HighContrastPanel>
      <FlexDiv>
        <Undertittel>
        {t('ui:label-rinasaksnummer') + ': ' + replySed.saksnummer}
        </Undertittel>
        <EditIcon onClick={toggleEditing}/>
      </FlexDiv>
      <VerticalSeparatorDiv />
      {isEditing ? <SEDDetailsEdit replySed={replySed} onSave={toggleEditing} onCancel={toggleEditing}/> :
        <SEDDetailsView replySed={replySed}/>}
    </HighContrastPanel>

  )
}

export default SEDDetails
