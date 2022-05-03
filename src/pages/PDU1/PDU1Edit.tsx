import { BodyLong, Button, Loader } from '@navikt/ds-react'
import { FlexDiv, HorizontalSeparatorDiv, PaddedDiv, PileDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { saveEntry } from 'actions/localStorage'
import { jornalførePdu1, resetJornalførePdu1, setPdu1, updatePdu1 } from 'actions/pdu1'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import { resetAllValidation, viewValidation } from 'actions/validation'
import Avsender from 'applications/PDU1/Avsender/Avsender'
import CoverLetter from 'applications/PDU1/CoverLetter/CoverLetter'
import Dagpenger from 'applications/PDU1/Dagpenger/Dagpenger'
import Perioder from 'applications/PDU1/Perioder/Perioder'
import Person from 'applications/PDU1/Person/Person'
import RettTilDagpenger from 'applications/PDU1/RettTilDagpenger/RettTilDagpenger'
import SavePDU1Modal from 'applications/PDU1/SavePDU1Modal/SavePDU1Modal'
import SisteAnsettelseInfo from 'applications/PDU1/SisteAnsettelseInfo/SisteAnsettelseInfo'
import Utbetaling from 'applications/PDU1/Utbetaling/Utbetaling'
import TwoLevelForm from 'applications/SvarSed/TwoLevelForm'
import Modal from 'components/Modal/Modal'
import PreviewPDU1 from 'applications/PDU1/PreviewPDU1/PreviewPDU1'
import ValidationBox from 'components/ValidationBox/ValidationBox'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { LocalStorageEntry, Validation } from 'declarations/types'
import useGlobalValidation from 'hooks/useGlobalValidation'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { validatePDU1Edit, ValidationPDU1EditProps } from './mainValidation'

export interface PDU1EditSelector {
  completingPdu1: boolean
  currentEntry: LocalStorageEntry<PDU1> | undefined
  pdu1: PDU1 | null | undefined
  savingPdu1: boolean
  jornalførePdu1Response: any
  validation: Validation
  view: boolean
}

const mapState = (state: State): any => ({
  completingPdu1: state.loading.completingPdu1,
  currentEntry: state.localStorage.pdu1.currentEntry,
  pdu1: state.pdu1.pdu1,
  jornalførePdu1Response: state.pdu1.jornalførePdu1Response,
  validation: state.validation.status,
  view: state.validation.view
})

const PDU1Edit: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const {
    completingPdu1,
    currentEntry,
    pdu1,
    jornalførePdu1Response,
    validation,
    view
  }: PDU1EditSelector = useAppSelector(mapState)
  const [completeModal, setCompleteModal] = useState<boolean>(false)
  const [viewSavePdu1Modal, setViewSavePdu1Modal] = useState<boolean>(false)
  const performValidation = useGlobalValidation<ValidationPDU1EditProps>(validatePDU1Edit)

  const jornalførePdu1Clicked = (e: any): void => {
    if (pdu1) {
      const newPdu1: PDU1 = _.cloneDeep(pdu1)
      const valid = performValidation({
        pdu1: newPdu1
      })
      dispatch(viewValidation())
      if (valid) {
        if (!_.isEmpty(newPdu1.andreMottatteUtbetalinger)) {
          delete newPdu1.andreMottatteUtbetalinger._utbetalingEtterEndtArbeidsforholdCheckbox
          delete newPdu1.andreMottatteUtbetalinger._kompensasjonForEndtArbeidsforholdCheckbox
          delete newPdu1.andreMottatteUtbetalinger._kompensasjonForFeriedagerCheckbox
          delete newPdu1.andreMottatteUtbetalinger._avkallKompensasjonBegrunnelseCheckbox
          delete newPdu1.andreMottatteUtbetalinger._andreYtelserSomMottasForTidenCheckbox
        }

        dispatch(jornalførePdu1(newPdu1))
        dispatch(resetAllValidation())
        buttonLogger(e)
      }
    }
  }

  const onSavePdu1Click = () => {
    if (_.isNil(currentEntry)) {
      setViewSavePdu1Modal(true)
    } else {
      const newCurrentEntry: LocalStorageEntry<PDU1> = _.cloneDeep(currentEntry)
      newCurrentEntry.content = _.cloneDeep(pdu1!)
      dispatch(saveEntry('pdu1', newCurrentEntry))
    }
  }

  const resetComplete = () => {
    dispatch(resetJornalførePdu1())
    setCompleteModal(false)
  }

  useEffect(() => {
    if (!completeModal && !_.isNil(jornalførePdu1Response)) {
      setCompleteModal(true)
    }
  }, [jornalførePdu1Response])

  useEffect(() => {
    dispatch(startPageStatistic('pdu1editor'))
    return () => {
      dispatch(finishPageStatistic('pdu1editor'))
    }
  }, [])

  return (
    <PaddedDiv size='0.5'>
      {jornalførePdu1Response && (
        <Modal
          open={completeModal}
          modal={{
            closeButton: true,
            modalTitle: t('message:success-complete-pdu1'),
            modalContent: (
              <div style={{ textAlign: 'center', display: 'block', minWidth: '400px', minHeight: '100px' }}>
                <PileDiv><BodyLong>{jornalførePdu1Response.melding}</BodyLong>
                  <BodyLong>journalpostId: {jornalførePdu1Response.journalpostId}</BodyLong>
                  <BodyLong>journalstatus: {jornalførePdu1Response.journalstatus}</BodyLong>
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
      <Modal
        open={viewSavePdu1Modal}
        onModalClose={() => setViewSavePdu1Modal(false)}
        modal={{
          closeButton: false,
          modalContent: (
            <SavePDU1Modal
              pdu1={pdu1!}
              onCancelled={() => setViewSavePdu1Modal(false)}
              onSaved={() => setViewSavePdu1Modal(false)}
            />
          )
        }}
      />
      <VerticalSeparatorDiv size='2' />
      <TwoLevelForm<PDU1>
        type='onelevel'
        namespace='pdu1'
        loggingNamespace='personmanager'
        firstForm='person'
        forms={[
          { label: t('el:option-mainform-person'), value: 'person', component: Person, type: 'PD' },
          { label: t('el:option-mainform-perioder'), value: 'perioder', component: Perioder, type: 'PD' },
          {
            label: t('el:option-mainform-arsak-til-avsluttet'),
            value: 'sisteansettelseinfo',
            component: SisteAnsettelseInfo,
            type: 'PD'
          },
          { label: t('el:option-mainform-utbetaling'), value: 'utbetaling', component: Utbetaling, type: 'PD' },
          { label: t('el:option-mainform-dagpenger'), value: 'dagpenger', component: Dagpenger, type: 'PD' },
          {
            label: t('el:option-mainform-retttildagpenger'),
            value: 'retttildagpenger',
            component: RettTilDagpenger,
            type: 'PD'
          },
          { label: t('el:option-mainform-avsender'), value: 'avsender', component: Avsender, type: 'PD' },
          { label: t('el:option-mainform-coverletter'), value: 'coverletter', component: CoverLetter, type: 'PD' }
        ]}
        replySed={pdu1}
        setReplySed={setPdu1}
        updateReplySed={updatePdu1}
        viewValidation={view}
      />
      <VerticalSeparatorDiv size='2' />
      <PreviewPDU1 />
      <VerticalSeparatorDiv size='2' />
      <ValidationBox heading={t('validation:feiloppsummering')} validation={validation} />
      <VerticalSeparatorDiv size='2' />
      <FlexDiv>
        <div>
          <Button
            variant='primary'
            data-amplitude='pdu1.editor.opprett'
            onClick={jornalførePdu1Clicked}
            disabled={completingPdu1 || !_.isEmpty(jornalførePdu1Response)}
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
