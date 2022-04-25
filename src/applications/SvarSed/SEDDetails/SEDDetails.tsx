import { Close, Edit, Email, ErrorFilled, ExternalLink, Send, Star } from '@navikt/ds-icons'
import { Button, Detail, Heading, Link, Panel } from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import {
  FlexBaseDiv,
  FlexCenterSpacedDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { setReplySed } from 'actions/svarsed'
import SEDType from 'applications/SvarSed/BottomForm/SEDType'
import Tema from 'applications/SvarSed/BottomForm/Tema'
import Formaal from 'applications/SvarSed/TopForm/Formaal'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed.d'
import { UpdateReplySedPayload } from 'declarations/types'
import { buttonLogger } from 'metrics/loggers'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { isFSed, isHSed, isUSed } from 'utils/sed'
import SEDDetailsEdit from './SEDDetailsEdit'
import SEDDetailsView from './SEDDetailsView'

export interface SEDDetailsProps {
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
}

const SEDDetails: React.FC<SEDDetailsProps> = ({
  updateReplySed
}: SEDDetailsProps) => {
  const { t } = useTranslation()
  const replySed: ReplySed | null | undefined = useSelector<State, ReplySed | null | undefined>((state: State) => state.svarsed.replySed)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const namespace = 'sidebar'

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

      <FlexBaseDiv>
        <PileCenterDiv style={{ alignItems: 'center' }} title={t('')}>
          {replySed?.status === 'received' && <Email width='32' height='32' />}
          {replySed?.status === 'sent' && <Send width='32' height='32' />}
          {replySed?.status === 'new' && <Star width='32' height='32' />}
          {replySed?.status === 'active' && <Edit width='32' height='32' />}
          {replySed?.status === 'cancelled' && <Close width='32' height='32' />}
          <VerticalSeparatorDiv size='0.35' />
          <Detail>
            {t('app:status-received-' + replySed?.status?.toLowerCase())}
          </Detail>
        </PileCenterDiv>
        <HorizontalSeparatorDiv />
        <Heading size='medium'>
          {replySed?.sedType} - {t('buc:' + replySed?.sedType)}
        </Heading>
      </FlexBaseDiv>
      <VerticalSeparatorDiv />
      {isFSed(replySed) && (
        <Formaal
          replySed={replySed}
          updateReplySed={updateReplySed}
          parentNamespace={namespace}
        />
      )}
      {isUSed(replySed) && (
        <SEDType
          replySed={replySed}
          setReplySed={setReplySed}
        />
      )}
      {isHSed(replySed) && (
        <Tema
          updateReplySed={updateReplySed}
          replySed={replySed}
        />
      )}
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
