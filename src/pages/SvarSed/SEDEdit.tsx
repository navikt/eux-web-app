import { Sight, BackFilled } from '@navikt/ds-icons'
import { Loader, Button, Heading, Alert } from '@navikt/ds-react'
import { alertClear } from 'actions/alert'
import { resetCurrentEntry, saveEntry } from 'actions/localStorage'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import {
  createSed,
  getPreviewFile,
  resetPreviewPdu1,
  sendSedInRina,
  setReplySed,
  updateReplySed
} from 'actions/svarsed'
import { resetAllValidation, resetValidation, viewValidation } from 'actions/validation'
import Formaal from 'applications/SvarSed/Formaal/Formaal'
import FormålManager from 'applications/SvarSed/Formaal/FormålManager'
import SEDType from 'applications/SvarSed/Formaal/SEDType'
import Tema from 'applications/SvarSed/Formaal/Tema'
import Adresser from 'applications/SvarSed/PersonManager/Adresser/Adresser'
import Arbeidsperioder from 'applications/SvarSed/PersonManager/Arbeidsperioder/Arbeidsperioder'
import BeløpNavnOgValuta from 'applications/SvarSed/PersonManager/BeløpNavnOgValuta/BeløpNavnOgValuta'
import Familierelasjon from 'applications/SvarSed/PersonManager/Familierelasjon/Familierelasjon'
import Forsikring from 'applications/SvarSed/PersonManager/Forsikring/Forsikring'
import GrunnlagForBosetting from 'applications/SvarSed/PersonManager/GrunnlagForBosetting/GrunnlagForBosetting'
import GrunnTilOpphør from 'applications/SvarSed/PersonManager/GrunnTilOpphør/GrunnTilOpphør'
import InntektForm from 'applications/SvarSed/PersonManager/InntektForm/InntektForm'
import Kontaktinformasjon from 'applications/SvarSed/PersonManager/Kontaktinformasjon/Kontaktinformasjon'
import Nasjonaliteter from 'applications/SvarSed/PersonManager/Nasjonaliteter/Nasjonaliteter'
import PeriodeForDagpenger from 'applications/SvarSed/PersonManager/PeriodeForDagpenger/PeriodeForDagpenger'
import PersonensStatus from 'applications/SvarSed/PersonManager/PersonensStatus/PersonensStatus'
import PersonManager from 'applications/SvarSed/PersonManager/PersonManager'
import PersonOpplysninger from 'applications/SvarSed/PersonManager/PersonOpplysninger/PersonOpplysninger'
import Referanseperiode from 'applications/SvarSed/PersonManager/Referanseperiode/Referanseperiode'
import Relasjon from 'applications/SvarSed/PersonManager/Relasjon/Relasjon'
import RettTilYtelser from 'applications/SvarSed/PersonManager/RettTilYtelser/RettTilYtelser'
import SisteAnsettelsesForhold from 'applications/SvarSed/PersonManager/SisteAnsettelsesForhold/SisteAnsettelsesForhold'
import SvarPåForespørsel from 'applications/SvarSed/PersonManager/SvarPåForespørsel/SvarPåForespørsel'
import Trygdeordning from 'applications/SvarSed/PersonManager/Trygdeordning/Trygdeordning'
import SaveSEDModal from 'applications/SvarSed/SaveSEDModal/SaveSEDModal'
import SendSEDModal from 'applications/SvarSed/SendSEDModal/SendSEDModal'
import Attachments from 'applications/Vedlegg/Attachments/Attachments'

import TextArea from 'components/Forms/TextArea'
import Modal from 'components/Modal/Modal'
import { TextAreaDiv } from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { JoarkBrowserItems } from 'declarations/attachments'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import { Barn, F002Sed, FSed, HSed, ReplySed } from 'declarations/sed'
import { CreateSedResponse, LocalStorageEntry, Validation } from 'declarations/types'
import FileFC, { File } from 'forhandsvisningsfil'
import useGlobalValidation from 'hooks/useGlobalValidation'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import {
  Column,
  FlexCenterSpacedDiv,
  FlexDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import ValidationBox from 'pages/SvarSed/ValidationBox'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { blobToBase64 } from 'utils/blob'
import { getFnr } from 'utils/fnr'
import { isFSed, isHSed, isSed, isUSed } from 'utils/sed'
import { validateSEDEdit, ValidationSEDEditProps } from './mainValidation'

export interface SEDEditSelector {
  alertType: string | undefined
  alertMessage: JSX.Element | string | undefined
  creatingSvarSed: boolean
  gettingPreviewFile: boolean
  previewFile: any,
  replySed: ReplySed | null | undefined
  currentEntry: LocalStorageEntry<ReplySed> | undefined
  savingSed: boolean
  sendingSed: boolean
  sedCreatedResponse: CreateSedResponse
  sedSendResponse: any
  validation: Validation
  view: boolean
}

export interface SEDEditProps {
  changeMode: (mode: string, from: string, callback?: () => void) => void
}

const mapState = (state: State): any => ({
  alertType: state.alert.type,
  alertMessage: state.alert.stripeMessage,
  creatingSvarSed: state.loading.creatingSvarSed,
  gettingPreviewFile: state.loading.gettingPreviewFile,
  previewFile: state.svarsed.previewFile,
  replySed: state.svarsed.replySed,
  savingSed: state.loading.savingSed,
  sendingSed: state.loading.sendingSed,
  sedCreatedResponse: state.svarsed.sedCreatedResponse,
  sedSendResponse: state.svarsed.sedSendResponse,
  validation: state.validation.status,
  view: state.validation.view
})

const SEDEdit: React.FC<SEDEditProps> = ({
  changeMode
}: SEDEditProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    alertType,
    alertMessage,
    creatingSvarSed,
    gettingPreviewFile,
    previewFile,
    replySed,
    savingSed,
    sendingSed,
    sedCreatedResponse,
    sedSendResponse,
    validation,
    view
  }: SEDEditSelector = useSelector<State, SEDEditSelector>(mapState)

  const currentEntry = useSelector<State, LocalStorageEntry<ReplySed> | undefined>(
    (state) => state.localStorage.svarsed.currentEntry)

  const fnr = getFnr(replySed, 'bruker')
  const namespace = 'editor'

  const [_attachments, setAttachments] = useState<JoarkBrowserItems | undefined>(undefined)
  const [_modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_viewSendSedModal, setViewSendSedModal] = useState<boolean>(false)
  const [_viewSaveSedModal, setViewSaveSedModal] = useState<boolean>(false)
  const [_sendButtonClicked, _setSendButtonClicked] = useState<boolean>(false)
  const performValidation = useGlobalValidation<ValidationSEDEditProps>(validateSEDEdit)

  const showPersonManager = (): boolean => isSed(replySed)
  const showFormålManager = (): boolean =>
    (replySed as F002Sed)?.formaal?.indexOf('motregning') >= 0 ||
    (replySed as F002Sed)?.formaal?.indexOf('vedtak') >= 0 ||
    (replySed as F002Sed)?.formaal?.indexOf('prosedyre_ved_uenighet') >= 0 ||
    (replySed as F002Sed)?.formaal?.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0

  const cleanReplySed = (replySed: ReplySed): ReplySed => {
    const newReplySed = _.cloneDeep(replySed)
    // if we do not have vedtak, do not have ytelse in barna
    if (Object.prototype.hasOwnProperty.call(replySed, 'formaal') && (replySed as FSed)?.formaal.indexOf('vedtak') < 0) {
      (newReplySed as F002Sed).barn?.forEach((b: Barn, i: number) => {
        if (Object.prototype.hasOwnProperty.call((newReplySed as F002Sed).barn?.[i], 'ytelser')) {
          delete (newReplySed as F002Sed).barn?.[i].ytelser
        }
      })
    }
    return newReplySed
  }

  const sendReplySed = (e: any): void => {
    if (replySed) {
      const newReplySed: ReplySed = cleanReplySed(replySed)
      const valid = performValidation({
        replySed: newReplySed
      })
      dispatch(viewValidation())
      if (valid) {
        setViewSendSedModal(true)
        cleanReplySed(newReplySed)
        dispatch(createSed(newReplySed))
        dispatch(resetAllValidation())
        buttonLogger(e)
      }
    }
  }

  const onSaveSedClick = () => {
    if (_.isNil(currentEntry)) {
      setViewSaveSedModal(true)
    } else {
      const newCurrentEntry: LocalStorageEntry<ReplySed> = _.cloneDeep(currentEntry)
      newCurrentEntry.content = _.cloneDeep(replySed!)
      dispatch(saveEntry('svarsed', newCurrentEntry))
    }
  }

  const resetPreview = () => {
    dispatch(resetPreviewPdu1())
    setModal(undefined)
  }

  const onSendSedClick = () => {
    _setSendButtonClicked(true)
    dispatch(sendSedInRina(replySed?.saksnummer, sedCreatedResponse?.sedId))
    standardLogger('svarsed.editor.sendsvarsed.button', { type: 'editor' })
  }

  const showPreviewModal = (previewFile: Blob) => {
    blobToBase64(previewFile).then((base64: any) => {
      const file: File = {
        id: '' + new Date().getTime(),
        size: previewFile.size,
        name: '',
        mimetype: 'application/pdf',
        content: {
          base64: base64.replaceAll('octet-stream', 'pdf')
        }
      }

      setModal({
        closeButton: true,
        modalContent: (
          <div
            style={{ cursor: 'pointer' }}
          >
            <FileFC
              file={{
                ...file,
                mimetype: 'application/pdf'
              }}
              width={600}
              height={800}
              tema='simple'
              viewOnePage={false}
              onContentClick={resetPreview}
            />
          </div>
        )
      })
    })
  }

  const onPreviewSed = (e: any) => {
    if (replySed) {
      const newReplySed = _.cloneDeep(replySed)
      cleanReplySed(newReplySed)
      const rinaSakId = newReplySed.saksnummer
      delete newReplySed.saksnummer
      delete newReplySed.sakUrl
      dispatch(getPreviewFile(rinaSakId!, newReplySed))
      buttonLogger(e)
    }
  }

  const onGoBackClick = () => {
    changeMode('A', 'back')
    dispatch(resetCurrentEntry('svarsed'))
    document.dispatchEvent(new CustomEvent('tilbake', { detail: {} }))
  }

  const setComment = (comment: string) => {
    if (isHSed(replySed)) {
      dispatch(updateReplySed('ytterligereInfo', comment))
    } else {
      dispatch(updateReplySed('bruker.ytterligereInfo', comment))
    }
    if (validation[namespace + '-ytterligereInfo']) {
      dispatch(resetValidation(namespace + '-ytterligereInfo'))
    }
  }

  useEffect(() => {
    if (!_modal && !_.isNil(previewFile)) {
      showPreviewModal(previewFile)
    }
  }, [previewFile])

  useEffect(() => {
    dispatch(startPageStatistic('editor'))
    return () => {
      dispatch(finishPageStatistic('editor'))
    }
  }, [])

  return (
    <PaddedDiv size='0.5'>
      <Modal
        open={!_.isNil(_modal)}
        modal={_modal}
        onModalClose={resetPreview}
      />
      {_viewSendSedModal && (
        <SendSEDModal
          fnr={fnr!}
          open={_viewSendSedModal}
          goToRinaUrl={replySed?.sakUrl}
          attachments={_attachments}
          replySed={replySed}
          onModalClose={() => setViewSendSedModal(false)}
        />
      )}
      <SaveSEDModal
        open={_viewSaveSedModal}
        replySed={replySed!}
        onModalClose={() => setViewSaveSedModal(false)}
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
      <Row>
        <Column flex='2'>
          <Heading size='medium'>
            {replySed?.sedType} - {t('buc:' + replySed?.sedType)}
          </Heading>
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
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv size='3' />
      {showPersonManager() && (
        <>
          <Heading size='small'>
            {t('label:personmanager')}
          </Heading>
          <VerticalSeparatorDiv />
          <PersonManager
            forms={[
              { label: t('el:option-personmanager-personopplyninger'), value: 'personopplysninger', component: PersonOpplysninger, type: 'F', barn: true },
              { label: t('el:option-personmanager-person'), value: 'person_h', component: PersonOpplysninger, type: ['U', 'H'] },
              { label: t('el:option-personmanager-nasjonaliteter'), value: 'nasjonaliteter', component: Nasjonaliteter, type: ['F'], barn: true },
              { label: t('el:option-personmanager-adresser'), value: 'adresser', component: Adresser, type: ['F', 'H'], barn: true },
              { label: t('el:option-personmanager-kontakt'), value: 'kontaktinformasjon', component: Kontaktinformasjon, type: 'F' },
              { label: t('el:option-personmanager-trygdeordninger'), value: 'trygdeordninger', component: Trygdeordning, type: 'F' },
              { label: t('el:option-personmanager-familierelasjon'), value: 'familierelasjon', component: Familierelasjon, type: 'F' },
              { label: t('el:option-personmanager-personensstatus'), value: 'personensstatus', component: PersonensStatus, type: 'F' },
              { label: t('el:option-personmanager-relasjon'), value: 'relasjon', component: Relasjon, type: 'F', barn: true },
              { label: t('el:option-personmanager-grunnlagforbosetting'), value: 'grunnlagforbosetting', component: GrunnlagForBosetting, type: 'F', barn: true },
              { label: t('el:option-personmanager-beløpnavnogvaluta'), value: 'beløpnavnogvaluta', component: BeløpNavnOgValuta, type: 'F', barn: true, condition: () => (replySed as FSed)?.formaal?.indexOf('vedtak') >= 0 ?? false },
              { label: t('el:option-personmanager-familieytelser'), value: 'familieytelser', component: BeløpNavnOgValuta, type: 'F', family: true },
              { label: t('el:option-personmanager-referanseperiode'), value: 'referanseperiode', component: Referanseperiode, type: 'U' },
              { label: t('el:option-personmanager-arbeidsperioder'), value: 'arbeidsperioder', component: Arbeidsperioder, type: 'U002' },
              { label: t('el:option-personmanager-inntekt'), value: 'inntekt', component: InntektForm, type: 'U004' },
              { label: t('el:option-personmanager-retttilytelser'), value: 'retttilytelser', component: RettTilYtelser, type: ['U017'] },
              { label: t('el:option-personmanager-forsikring'), value: 'forsikring', component: Forsikring, type: ['U002', 'U017'] },
              { label: t('el:option-personmanager-sisteansettelsesforhold'), value: 'sisteansettelsesforhold', component: SisteAnsettelsesForhold, type: ['U002', 'U017'] },
              { label: t('el:option-personmanager-grunntilopphør'), value: 'grunntilopphør', component: GrunnTilOpphør, type: ['U002', 'U017'] },
              { label: t('el:option-personmanager-periodefordagpenger'), value: 'periodefordagpenger', component: PeriodeForDagpenger, type: ['U002', 'U017'] },
              { label: t('el:option-personmanager-svarpåforespørsel'), value: 'svarpåforespørsel', component: SvarPåForespørsel, type: 'H' }
            ]}
            viewValidation={view}
            replySed={replySed}
            updateReplySed={updateReplySed}
            setReplySed={setReplySed}
          />
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      {isFSed(replySed) && showFormålManager() && (
        <>
          <FormålManager
            replySed={replySed}
            viewValidation={view}
            updateReplySed={updateReplySed}
            setReplySed={setReplySed}
          />
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      <VerticalSeparatorDiv />
      <Row>
        <Column flex='2'>
          <TextAreaDiv>
            <TextArea
              namespace={namespace}
              error={validation[namespace + '-ytterligereInfo']?.feilmelding}
              key={namespace + '-' + replySed?.sedType}
              id='ytterligereInfo'
              label={t('label:ytterligere-informasjon-til-sed')}
              onChanged={setComment}
              value={isHSed(replySed) ? (replySed as HSed)?.ytterligereInfo : replySed?.bruker?.ytterligereInfo}
            />
          </TextAreaDiv>
        </Column>
        <Column />
      </Row>
      <VerticalSeparatorDiv size='2' />
      <Attachments
        fnr={fnr}
        onAttachmentsChanged={(attachments) => setAttachments(attachments)}
      />
      <Button
        variant='tertiary'
        disabled={gettingPreviewFile}
        data-amplitude='svarsed.editor.preview'
        onClick={onPreviewSed}
      >
        <Sight />
        <HorizontalSeparatorDiv size='0.5' />
        {gettingPreviewFile ? t('label:laster-ned-filen') : t('el:button-preview-x', { x: 'SED' })}
        {gettingPreviewFile && <Loader />}
      </Button>
      <VerticalSeparatorDiv size='2' />
      <ValidationBox />
      <VerticalSeparatorDiv size='2' />
      <FlexDiv>
        <div>
          <Button
            variant='primary'
            data-amplitude={_.isEmpty(sedCreatedResponse) ? 'svarsed.editor.opprettsvarsed' : 'svarsed.editor.oppdattersvarsed'}
            onClick={sendReplySed}
            disabled={creatingSvarSed}
          >
            {_.isEmpty(sedCreatedResponse)
              ? creatingSvarSed
                  ? t('message:loading-opprette-svarsed')
                  : t('label:opprett-svarsed')
              : creatingSvarSed
                ? t('message:loading-oppdatering-svarsed')
                : t('label:oppdatere-svarsed')}
            {creatingSvarSed && <Loader />}
          </Button>
          <VerticalSeparatorDiv size='0.5' />
        </div>
        <HorizontalSeparatorDiv />
        {!_.isEmpty(sedCreatedResponse) && (
          <>
            <div>
              <Button
                variant='primary'
                // amplitude is dealt on SendSedClick
                title={t('message:help-send-sed')}
                disabled={sendingSed || !_.isNil(sedSendResponse)}
                onClick={onSendSedClick}
              >
                {sendingSed ? t('message:loading-sending-sed') : t('el:button-send-sed')}
              </Button>
            </div>
            <HorizontalSeparatorDiv />
          </>
        )}
        <div>
          <Button
            variant='secondary'
            data-amplitude={_.isNil(currentEntry) ? 'svarsed.editor.savedraft' : 'svarsed.editor.updatedraft'}
            onClick={onSaveSedClick}
            disabled={savingSed}
          >
            {_.isNil(currentEntry) ? t('el:button-save-draft-x', { x: 'svarSED' }) : t('el:button-update-draft-x', { x: 'svarSED' })}
            {savingSed && <Loader />}
          </Button>
          <VerticalSeparatorDiv size='0.5' />
        </div>
      </FlexDiv>
      <VerticalSeparatorDiv />
      {_sendButtonClicked && alertMessage &&
      (alertType === types.SVARSED_SED_SEND_SUCCESS || alertType === types.SVARSED_SED_SEND_FAILURE) && (
        <>
          <FlexDiv>
            <Alert
              variant={alertType === types.SVARSED_SED_SEND_FAILURE ? 'error' : 'info'}
            >
              {alertMessage!}
            </Alert>
            <Button
              variant='tertiary' onClick={() => {
                _setSendButtonClicked(false)
                dispatch(alertClear())
              }}
            >
              OK
            </Button>
          </FlexDiv>
          <VerticalSeparatorDiv />
        </>
      )}
    </PaddedDiv>
  )
}

export default SEDEdit
