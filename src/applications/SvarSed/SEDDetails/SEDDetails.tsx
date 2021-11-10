import { Edit } from '@navikt/ds-icons'
import ExternalLink from 'assets/icons/Logout'
import RemoveCircle from 'assets/icons/RemoveCircle'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed.d'
import { buttonLogger } from 'metrics/loggers'
import { Undertittel } from 'nav-frontend-typografi'
import {
  HighContrastPanel,
  HighContrastFlatknapp,
  VerticalSeparatorDiv,
  FlexCenterSpacedDiv,
  HorizontalSeparatorDiv, HighContrastLink
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import SEDDetailsEdit from './SEDDetailsEdit'
import SEDDetailsView from './SEDDetailsView'

const SEDDetails = () => {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const replySed: ReplySed | null | undefined = useSelector((state: State): ReplySed | null |undefined => (state.svarsed.replySed))

  const toggleEditing = (e: React.ChangeEvent<HTMLButtonElement>) => {
    if (!isEditing) {
      buttonLogger(e)
    }
    setIsEditing(!isEditing)
  }

  if (!replySed) {
    return <div />
  }

  return (
    <HighContrastPanel border style={{ margin: '0.1rem' }}>
      <FlexCenterSpacedDiv>
        <Undertittel>
          <FlexCenterSpacedDiv>
            {t('label:rina-saksnummer') + ':'}
            <HorizontalSeparatorDiv size='0.35' />
            <HighContrastLink target='_blank' href={replySed.sakUrl}>
              <span>
                {replySed.saksnummer}
              </span>
              <HorizontalSeparatorDiv size='0.35' />
              <ExternalLink />
            </HighContrastLink>
          </FlexCenterSpacedDiv>
        </Undertittel>
        <HighContrastFlatknapp
          kompakt
          data-amplitude='svarsed.sidebar.edit'
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
