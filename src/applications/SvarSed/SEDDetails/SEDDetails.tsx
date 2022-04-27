import { Close, Edit, Email, Send, Star } from '@navikt/ds-icons'
import { Button, Detail, Label, Panel } from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import { FlexBaseDiv, HorizontalSeparatorDiv, PileCenterDiv, PileDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { setReplySed } from 'actions/svarsed'
import SEDType from 'applications/SvarSed/MainForm/SEDType'
import Tema from 'applications/SvarSed/MainForm/Tema'
import Saksopplysninger from 'applications/SvarSed/Saksopplysninger/Saksopplysninger'
import Attachments from 'applications/Vedlegg/Attachments/Attachments'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed.d'
import { UpdateReplySedPayload } from 'declarations/types'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { getFnr } from 'utils/fnr'
import { isHSed, isUSed } from 'utils/sed'

export interface SEDDetailsProps {
  unsavedDoc?: boolean
  updateReplySed: (needle: string, value: any) => ActionWithPayload<UpdateReplySedPayload>
}

const SEDDetails: React.FC<SEDDetailsProps> = ({
  unsavedDoc,
  updateReplySed
}: SEDDetailsProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const replySed: ReplySed | null | undefined = useAppSelector((state: State) => state.svarsed.replySed)
  const fnr = getFnr(replySed, 'bruker')

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
          {replySed?.sed?.status === 'received' && <Email width='20' height='20' />}
          {replySed?.sed?.status === 'sent' && <Send width='20' height='20' />}
          {(_.isNil(replySed?.sed) || replySed?.sed?.status === 'new') && <Star width='20' height='20' />}
          {replySed?.sed?.status === 'active' && <Edit width='20' height='20' />}
          {replySed?.sed?.status === 'cancelled' && <Close width='20' height='20' />}
          <VerticalSeparatorDiv size='0.35' />
          <Detail>
            {t('app:status-received-' + (replySed?.sed?.status?.toLowerCase() ?? 'new'))}
          </Detail>
        </PileCenterDiv>
        <HorizontalSeparatorDiv />
        <Label>
          {replySed?.sedType} - {t('buc:' + replySed?.sedType)}
        </Label>
      </FlexBaseDiv>

      <VerticalSeparatorDiv />
      {(isUSed(replySed) || isHSed(replySed)) && (
        <>
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
        </>
      )}
      {replySed.sak && (
        <>
          <Saksopplysninger sak={replySed.sak} />
          <VerticalSeparatorDiv />
        </>
      )}
      <Attachments
        fnr={fnr}
        onAttachmentsChanged={(attachments) => {
          dispatch(setReplySed({
            ...replySed,
            attachments
          }))
        }}
      />

    </>
  )
}

export default SEDDetails
