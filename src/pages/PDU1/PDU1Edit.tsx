import { BackFilled } from '@navikt/ds-icons'
import { BodyLong, Button, Loader } from '@navikt/ds-react'
import { resetCurrentEntry, saveEntry } from 'actions/localStorage'
import { completePdu1, resetCompletePdu1, setReplyPdu1, updateReplyPdu1 } from 'actions/pdu1'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import { resetAllValidation, viewValidation } from 'actions/validation'
import Adresse from 'applications/PDU1/Adresse/Adresse'
import CoverLetter from 'applications/PDU1/CoverLetter/CoverLetter'
import Dagpenger from 'applications/PDU1/Dagpenger/Dagpenger'
import NavInfo from 'applications/PDU1/NavInfo/NavInfo'
import Perioder from 'applications/PDU1/Perioder/Perioder'
import Person from 'applications/PDU1/Person/Person'
import RettTilDagpenger from 'applications/PDU1/RettTilDagpenger/RettTilDagpenger'
import SavePDU1Modal from 'applications/PDU1/SavePDU1Modal/SavePDU1Modal'
import SisteAnsettelseInfo from 'applications/PDU1/SisteAnsettelseInfo/SisteAnsettelseInfo'
import Statsborgerskap from 'applications/PDU1/Statsborgerskap/Statsborgerskap'
import Utbetaling from 'applications/PDU1/Utbetaling/Utbetaling'
import PersonManager from 'applications/SvarSed/PersonManager/PersonManager'
import Modal from 'components/Modal/Modal'
import PreviewPDU1 from 'components/PreviewPDU1/PreviewPDU1'
import { ReplyPdu1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { LocalStorageEntry, Validation } from 'declarations/types'
import useGlobalValidation from 'hooks/useGlobalValidation'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import {
  FlexCenterSpacedDiv,
  FlexDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PileDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import ValidationBox from 'pages/SvarSed/ValidationBox'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { validatePDU1Edit, ValidationPDU1EditProps } from './mainValidation'

export interface PDU1EditSelector {
  completingPdu1: boolean
  replyPdu1: ReplyPdu1 | null | undefined
  savingPdu1: boolean
  completePdu1Response: any
  validation: Validation
  view: boolean
}

export interface PDU1EditProps {
  changeMode: (mode: string, from: string, callback?: () => void) => void
  storageKey: string
}

const mapState = (state: State): any => ({
  completingPdu1: state.loading.completingPdu1,
  replyPdu1: state.pdu1.replyPdu1,
  completePdu1Response: state.pdu1.completePdu1Response,
  validation: state.validation.status,
  view: state.validation.view
})

const PDU1Edit: React.FC<PDU1EditProps> = ({
  changeMode,
  storageKey
}: PDU1EditProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    completingPdu1,
    replyPdu1,
    completePdu1Response,
    view
  }: PDU1EditSelector = useSelector<State, PDU1EditSelector>(mapState)
  const currentEntry = useSelector<State, LocalStorageEntry<ReplyPdu1> | undefined>(
    (state) => state.localStorage.pdu1.currentEntry)

  const [completeModal, setCompleteModal] = useState<boolean>(false)
  const [viewSavePdu1Modal, setViewSavePdu1Modal] = useState<boolean>(false)
  const performValidation = useGlobalValidation<ValidationPDU1EditProps>(validatePDU1Edit)

  const completePdu1Clicked = (e: any): void => {
    if (replyPdu1) {
      const newReplyPdu1: ReplyPdu1 = _.cloneDeep(replyPdu1)
      const valid = performValidation({
        replyPdu1: newReplyPdu1
      })
      dispatch(viewValidation())
      if (valid) {
        dispatch(completePdu1(newReplyPdu1))
        dispatch(resetAllValidation())
        buttonLogger(e)
      }
    }
  }

  const onSavePdu1Click = () => {
    if (_.isNil(currentEntry)) {
      setViewSavePdu1Modal(true)
    } else {
      const newCurrentEntry: LocalStorageEntry<ReplyPdu1> = _.cloneDeep(currentEntry)
      newCurrentEntry.content = _.cloneDeep(replyPdu1!)
      dispatch(saveEntry('pdu1', storageKey, newCurrentEntry))
    }
  }

  const resetComplete = () => {
    dispatch(resetCompletePdu1())
    setCompleteModal(false)
  }

  const onGoBackClick = () => {
    changeMode('A', 'back')
    dispatch(resetCurrentEntry('pdu1'))
    document.dispatchEvent(new CustomEvent('tilbake', { detail: {} }))
  }

  useEffect(() => {
    if (!completeModal && !_.isNil(completePdu1Response)) {
      setCompleteModal(true)
    }
  }, [completePdu1Response])

  useEffect(() => {
    dispatch(startPageStatistic('pdu1editor'))
    return () => {
      dispatch(finishPageStatistic('pdu1editor'))
    }
  }, [])

  return (
    <PaddedDiv size='0.5'>
      {completePdu1Response && (
        <Modal
          open={completeModal}
          modal={{
            closeButton: true,
            modalTitle: t('message:success-complete-pdu1'),
            modalContent: (
              <div style={{  textAlign: 'center',
                display: 'block',
              minWidth: '400px', minHeight: '100px' }}>
                {/* <PileCenterDiv style={{ alignItems: 'center', width: '100%' }}>
                  <Link
                    onClick={(e: any) => {
                      e.stopPropagation()
                    }}
                    href={'data:application/octet-stream;base64,' + encodeURIComponent(completePdu1Response.content.base64)}
                    download={completePdu1Response?.name}
                  >
                    <FlexDiv>
                      {t('label:last-ned-pdu1')}
                      <HorizontalSeparatorDiv />
                      <Download width={20} />
                    </FlexDiv>
                  </Link>
                </PileCenterDiv> */}
                <PileDiv><BodyLong>{completePdu1Response.melding}</BodyLong>
                <BodyLong>journalpostId: {completePdu1Response.journalpostId}</BodyLong>
                <BodyLong>journalstatus: {completePdu1Response.journalstatus}</BodyLong>
                </PileDiv>
              </div>
            ),
            modalButtons: [{
              main: true,
              text: 'OK',
              onClick: resetComplete
            }]
          }}
          onModalClose={resetComplete}
        />
      )}
      <SavePDU1Modal
        open={viewSavePdu1Modal}
        replyPdu1={replyPdu1!}
        storageKey={storageKey}
        onModalClose={() => setViewSavePdu1Modal(false)}
      />
      <FlexCenterSpacedDiv>
        <Button
          variant='secondary'
          onClick={onGoBackClick}
        >
          <BackFilled />
          <HorizontalSeparatorDiv size='0.5' />
          {t('label:tilbake')}
        </Button>
      </FlexCenterSpacedDiv>
      <VerticalSeparatorDiv size='2' />
      <PersonManager
        forms={[
          { label: t('el:option-personmanager-person'), value: 'person', component: Person, type: 'PD' },
          { label: t('el:option-personmanager-statsborgerskap'), value: 'statsborgerskap', component: Statsborgerskap, type: 'PD' },
          { label: t('el:option-personmanager-adresse'), value: 'adresse', component: Adresse, type: ['PD'], options: { bygning: false, region: false } },
          { label: t('el:option-personmanager-perioder'), value: 'perioder', component: Perioder, type: 'PD' },
          { label: t('el:option-personmanager-sisteansettelseinfo'), value: 'sisteansettelseinfo', component: SisteAnsettelseInfo, type: 'PD' },
          { label: t('el:option-personmanager-utbetaling'), value: 'utbetaling', component: Utbetaling, type: 'PD' },
          { label: t('el:option-personmanager-dagpenger'), value: 'dagpenger', component: Dagpenger, type: 'PD' },
          { label: t('el:option-personmanager-retttildagpenger'), value: 'retttildagpenger', component: RettTilDagpenger, type: 'PD' },
          { label: t('el:option-personmanager-navinfo'), value: 'navinfo', component: NavInfo, type: 'PD' },
          { label: t('el:option-personmanager-coverletter'), value: 'coverletter', component: CoverLetter, type: 'PD' }
        ]}
        replySed={replyPdu1}
        setReplySed={setReplyPdu1}
        updateReplySed={updateReplyPdu1}
        viewValidation={view}
      />
      <VerticalSeparatorDiv size='2' />
      <PreviewPDU1 />
      <VerticalSeparatorDiv size='2' />
      <ValidationBox />
      <VerticalSeparatorDiv size='2' />
      <FlexDiv>
        <div>
          <Button
            variant='primary'
            data-amplitude='pdu1.editor.opprett'
            onClick={completePdu1Clicked}
            disabled={completingPdu1 || !_.isEmpty(completePdu1Response)}
          >
            {completingPdu1
              ? t('message:loading-opprette-pdu1')
              : t('label:opprett-pdu1')}
            {completingPdu1 && <Loader />}
          </Button>
          <VerticalSeparatorDiv size='0.5' />
        </div>
        <HorizontalSeparatorDiv />

        <div>
          <Button
            variant='secondary'
            data-amplitude={_.isNil(currentEntry) ? 'pdu1.editor.savedraft' : 'pdu1.editor.updatedraft'}
            onClick={onSavePdu1Click}
          >
            {_.isNil(currentEntry)
              ? t('el:button-save-draft-x', { x: 'PD U1' })
              : t('el:button-update-draft-x', { x: 'PD U1' })}
          </Button>
          <VerticalSeparatorDiv size='0.5' />
        </div>
      </FlexDiv>
      <VerticalSeparatorDiv />
    </PaddedDiv>
  )
}

export default PDU1Edit
