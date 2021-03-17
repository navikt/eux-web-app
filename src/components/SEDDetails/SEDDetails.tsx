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

  if (!replySed) {
    return <div/>
  }

  return (
    <HighContrastPanel>
      <FlexDiv>
        <Undertittel>
        {t('ui:label-rinasaksnummer') + ': ' + replySed.saksnummer}
        </Undertittel>
        <EditIcon onClick={() => setIsEditing(!isEditing)}/>
      </FlexDiv>
      <VerticalSeparatorDiv />
      {isEditing ? (
        <SEDDetailsEdit replySed={replySed}/>
      ) : (
        <SEDDetailsView replySed={replySed}/>
      )}
    </HighContrastPanel>

  )
}

export default SEDDetails
