import Edit from 'assets/icons/Edit'
import { ReplySed } from 'declarations/sed.d'
import { Undertittel } from 'nav-frontend-typografi'
import { HighContrastPanel, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import SEDPanelEdit from './SEDPanelEdit'
import SEDPanelView from './SEDPanelView'

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
`
const EditIcon = styled(Edit)`
  cursor: pointer;
`
interface SEDPanelProps {
  replySed: ReplySed
}

const SEDPanel = ({ replySed }: SEDPanelProps) => {
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
        <SEDPanelEdit replySed={replySed}/>
      ) : (
        <SEDPanelView replySed={replySed}/>
      )}
    </HighContrastPanel>

  )
}

export default SEDPanel
