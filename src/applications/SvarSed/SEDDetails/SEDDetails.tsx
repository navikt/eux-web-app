import { Edit, ExternalLink, ErrorFilled } from '@navikt/ds-icons'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed.d'
import { buttonLogger } from 'metrics/loggers'
import { Button, Heading, Link, Panel } from '@navikt/ds-react'
import {
  VerticalSeparatorDiv,
  FlexCenterSpacedDiv,
  HorizontalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import SEDDetailsEdit from './SEDDetailsEdit'
import SEDDetailsView from './SEDDetailsView'

export interface SEDDetailsProps {
  updateReplySed: (needle: string, value: any) => void
}

const SEDDetails: React.FC<SEDDetailsProps> = ({
  updateReplySed
}: SEDDetailsProps) => {
  const { t } = useTranslation()
  const replySed: ReplySed | null | undefined = useSelector<State, ReplySed | null | undefined>((state: State) => state.svarsed.replySed)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const toggleEditing = (e: any) => {
    if (!isEditing) {
      buttonLogger(e)
    }
    setIsEditing(!isEditing)
  }

  if (!replySed) {
    return <div />
  }

  return (
    <Panel border style={{ margin: '0.1rem' }}>
      <FlexCenterSpacedDiv>
        <Heading size='small'>
          <FlexCenterSpacedDiv>
            {t('label:rina-saksnummer') + ':'}
            <HorizontalSeparatorDiv size='0.35' />
            <Link target='_blank' href={replySed.sakUrl} rel='noreferrer'>
              <span>
                {replySed.saksnummer}
              </span>
              <HorizontalSeparatorDiv size='0.35' />
              <ExternalLink />
            </Link>
          </FlexCenterSpacedDiv>
        </Heading>
        <Button
          variant='tertiary'
          size='small'
          data-amplitude='svarsed.sidebar.edit'
          style={{
            marginTop: '-0.5rem',
            marginRight: '-0.5rem'
          }}
          onClick={toggleEditing}
        >
          {isEditing ? <ErrorFilled /> : <Edit />}
        </Button>
      </FlexCenterSpacedDiv>
      <VerticalSeparatorDiv />
      {isEditing
        ? (
          <SEDDetailsEdit
            replySed={replySed}
            updateReplySed={updateReplySed}
          />
          )
        : (
          <SEDDetailsView
            replySed={replySed}
          />
          )}
    </Panel>

  )
}

export default SEDDetails
