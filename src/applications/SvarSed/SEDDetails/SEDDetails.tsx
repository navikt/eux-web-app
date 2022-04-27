import { Close, Edit, Email, ExternalLink, Send, Star } from '@navikt/ds-icons'
import { Button, Detail, Heading, Label, Link, Panel } from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import {
  FlexBaseDiv,
  FlexCenterSpacedDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { setReplySed } from 'actions/svarsed'
import SEDType from 'applications/SvarSed/MainForm/SEDType'
import Tema from 'applications/SvarSed/MainForm/Tema'
import Saksopplysninger from 'applications/SvarSed/Saksopplysninger/Saksopplysninger'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed.d'
import { Sak, UpdateReplySedPayload } from 'declarations/types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'store'
import { isHSed, isUSed } from 'utils/sed'
import SEDDetailsView from './SEDDetailsView'

export interface SEDDetailsProps {
  unsavedDoc?: boolean
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
  sak?: Sak | undefined
}

const SEDDetails: React.FC<SEDDetailsProps> = ({
  unsavedDoc,
  updateReplySed,
  sak
}: SEDDetailsProps) => {
  const { t } = useTranslation()
  const replySed: ReplySed | null | undefined = useAppSelector((state: State) => state.svarsed.replySed)

  if (!replySed) {
    return <div />
  }

  const saveDraft = () => {}

  return (
    <>
      <Button
        variant='secondary'
        disabled={!unsavedDoc}
        onClick={saveDraft}
      >
        {t('el:button-save-draft-x', { x: 'svarSED' })}
      </Button>
      <VerticalSeparatorDiv />
      <FlexBaseDiv>
        <PileCenterDiv style={{ alignItems: 'center' }} title={t('')}>
          {replySed?.status === 'received' && <Email width='20' height='20' />}
          {replySed?.status === 'sent' && <Send width='20' height='20' />}
          {replySed?.status === 'new' && <Star width='20' height='20' />}
          {replySed?.status === 'active' && <Edit width='20' height='20' />}
          {replySed?.status === 'cancelled' && <Close  width='20' height='20'/>}
          <VerticalSeparatorDiv size='0.35' />
          <Detail>
            {t('app:status-received-' + replySed?.status?.toLowerCase())}
          </Detail>
        </PileCenterDiv>
        <HorizontalSeparatorDiv />
        <Label>
          {replySed?.sedType} - {t('buc:' + replySed?.sedType)}
        </Label>
      </FlexBaseDiv>

      <VerticalSeparatorDiv/>
      <Panel border>
        <PileDiv>
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
        </PileDiv>
      </Panel>
      <VerticalSeparatorDiv />

      {sak && <Saksopplysninger sak={sak} />}

      <Panel border>
        <VerticalSeparatorDiv />
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

        </FlexCenterSpacedDiv>
        <VerticalSeparatorDiv />

        <SEDDetailsView
          replySed={replySed}
        />

      </Panel>
    </>
  )
}

export default SEDDetails
