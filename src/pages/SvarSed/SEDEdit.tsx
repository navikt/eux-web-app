import { Sight } from '@navikt/ds-icons'
import { Alert, Button, Loader, Panel } from '@navikt/ds-react'
import FileFC, { File } from '@navikt/forhandsvisningsfil'
import { FlexDiv, HorizontalSeparatorDiv, PaddedDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { alertClear } from 'actions/alert'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import {
  createSed,
  getPreviewFile,
  resetPreviewSvarSed, restoreReplySed,
  sendSedInRina,
  setReplySed,
  updateReplySed,
  updateSed
} from 'actions/svarsed'
import { resetAllValidation, resetValidation, viewValidation } from 'actions/validation'
import Adresser from 'applications/SvarSed/MainForm/Adresser/Adresser'
import Anmodning from 'applications/SvarSed/MainForm/Anmodning/Anmodning'
import ArbeidsperioderOversikt from 'applications/SvarSed/MainForm/ArbeidsperioderOversikt/ArbeidsperioderOversikt'
import BeløpNavnOgValuta from 'applications/SvarSed/MainForm/BeløpNavnOgValuta/BeløpNavnOgValuta'
import EndredeForhold from 'applications/SvarSed/MainForm/EndredeForhold/EndredeForhold'
import Familierelasjon from 'applications/SvarSed/MainForm/Familierelasjon/Familierelasjon'
import Formål from 'applications/SvarSed/MainForm/Formål/Formål'
import Forsikring from 'applications/SvarSed/MainForm/Forsikring/Forsikring'
import GrunnlagForBosetting from 'applications/SvarSed/MainForm/GrunnlagForBosetting/GrunnlagForBosetting'
import GrunnTilOpphør from 'applications/SvarSed/MainForm/GrunnTilOpphør/GrunnTilOpphør'
import InntektForm from 'applications/SvarSed/MainForm/InntektForm/InntektForm'
import Kontaktinformasjon from 'applications/SvarSed/MainForm/Kontaktinformasjon/Kontaktinformasjon'
import Kontoopplysning from 'applications/SvarSed/MainForm/Kontoopplysning/Kontoopplysning'
import KravOmRefusjon from 'applications/SvarSed/MainForm/KravOmRefusjon/KravOmRefusjon'
import Motregning from 'applications/SvarSed/MainForm/Motregning/Motregning'
import Nasjonaliteter from 'applications/SvarSed/MainForm/Nasjonaliteter/Nasjonaliteter'
import Periode from 'applications/SvarSed/MainForm/Periode/Periode'
import PeriodeForDagpenger from 'applications/SvarSed/MainForm/PeriodeForDagpenger/PeriodeForDagpenger'
import PersonensStatus from 'applications/SvarSed/MainForm/PersonensStatus/PersonensStatus'
import PersonOpplysninger from 'applications/SvarSed/MainForm/PersonOpplysninger/PersonOpplysninger'
import ProsedyreVedUenighet from 'applications/SvarSed/MainForm/ProsedyreVedUenighet/ProsedyreVedUenighet'
import Referanseperiode from 'applications/SvarSed/MainForm/Referanseperiode/Referanseperiode'
import Relasjon from 'applications/SvarSed/MainForm/Relasjon/Relasjon'
import RettTilYtelser from 'applications/SvarSed/MainForm/RettTilYtelser/RettTilYtelser'
import SisteAnsettelseInfo from 'applications/SvarSed/MainForm/SisteAnsettelseInfo/SisteAnsettelseInfo'
import SvarPåForespørsel from 'applications/SvarSed/MainForm/SvarPåForespørsel/SvarPåForespørsel'
import Trygdeordning from 'applications/SvarSed/MainForm/Trygdeordning/Trygdeordning'
import Vedtak from 'applications/SvarSed/MainForm/Vedtak/Vedtak'
import SendSEDModal from 'applications/SvarSed/SendSEDModal/SendSEDModal'
import TwoLevelForm from 'applications/SvarSed/TwoLevelForm'
import TextArea from 'components/Forms/TextArea'
import Modal from 'components/Modal/Modal'
import { TextAreaDiv } from 'components/StyledComponents'
import ValidationBox from 'components/ValidationBox/ValidationBox'
import * as types from 'constants/actionTypes'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import { Barn, F002Sed, FSed, H002Sed, ReplySed } from 'declarations/sed'
import { CreateSedResponse, Validation } from 'declarations/types'
import useGlobalValidation from 'hooks/useGlobalValidation'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { blobToBase64 } from 'utils/blob'
import { getFnr } from 'utils/fnr'
import { isFSed, isH001Sed, isH002Sed, isHSed, isSed } from 'utils/sed'
import { validateSEDEdit, ValidationSEDEditProps } from './mainValidation'

export interface SEDEditSelector {
  alertType: string | undefined
  alertMessage: JSX.Element | string | undefined
  creatingSvarSed: boolean
  updatingSvarSed: boolean
  gettingPreviewFile: boolean
  previewFile: any,
  replySed: ReplySed | null | undefined
  sendingSed: boolean
  sedCreatedResponse: CreateSedResponse
  sedSendResponse: any
  validation: Validation
  view: boolean
}

const mapState = (state: State): any => ({
  alertType: state.alert.type,
  alertMessage: state.alert.stripeMessage,
  creatingSvarSed: state.loading.creatingSvarSed,
  updatingSvarSed: state.loading.updatingSvarSed,
  gettingPreviewFile: state.loading.gettingPreviewFile,
  previewFile: state.svarsed.previewFile,
  replySed: state.svarsed.replySed,
  sendingSed: state.loading.sendingSed,
  sedCreatedResponse: state.svarsed.sedCreatedResponse,
  sedSendResponse: state.svarsed.sedSendResponse,
  validation: state.validation.status,
  view: state.validation.view
})

const SEDEdit: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const {
    alertType,
    alertMessage,
    creatingSvarSed,
    updatingSvarSed,
    gettingPreviewFile,
    previewFile,
    replySed,
    sendingSed,
    sedCreatedResponse,
    sedSendResponse,
    validation,
    view
  }: SEDEditSelector = useAppSelector(mapState)
  const namespace = 'editor'

  const [_modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_sendButtonClicked, _setSendButtonClicked] = useState<boolean>(false)
  const [_viewSendSedModal, setViewSendSedModal] = useState<boolean>(false)
  const performValidation = useGlobalValidation<ValidationSEDEditProps>(validateSEDEdit)
  const fnr = getFnr(replySed, 'bruker')

  const showTopForm = (): boolean => isFSed(replySed)
  const showTwoLevelForm = (): boolean => isSed(replySed)
  const showBottomForm = (): boolean =>
    isFSed(replySed) && (
      (replySed as F002Sed)?.formaal?.indexOf('motregning') >= 0 ||
      (replySed as F002Sed)?.formaal?.indexOf('vedtak') >= 0 ||
      (replySed as F002Sed)?.formaal?.indexOf('prosedyre_ved_uenighet') >= 0 ||
      (replySed as F002Sed)?.formaal?.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0
    )

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
        if (!_.isEmpty(newReplySed?.sed)) {
          dispatch(updateSed(newReplySed))
        } else {
          dispatch(createSed(newReplySed))
        }
        dispatch(resetAllValidation())
        buttonLogger(e)
      }
    }
  }

  const resetPreview = () => {
    dispatch(resetPreviewSvarSed())
    setModal(undefined)
  }

  const onSendSedClick = () => {
    if (replySed?.sak?.sakId && sedCreatedResponse?.sedId) {
      _setSendButtonClicked(true)
      dispatch(sendSedInRina(replySed.sak!.sakId!, sedCreatedResponse.sedId!))
      standardLogger('svarsed.editor.sendsvarsed.button', { type: 'editor' })
    }
  }

  const onRestoreSedClick = () => {
    if (window.confirm(t('label:er-du-sikker'))) {
      dispatch(restoreReplySed())
    }
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
              height={1200}
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
      const rinaSakId = newReplySed.sak!.sakId
      delete newReplySed.sak
      delete newReplySed.sed
      delete newReplySed.attachments
      dispatch(getPreviewFile(rinaSakId!, newReplySed))
      buttonLogger(e)
    }
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
      <SendSEDModal
        fnr={fnr!}
        open={_viewSendSedModal}
        goToRinaUrl={replySed?.sak?.sakUrl}
        replySed={replySed}
        onModalClose={() => setViewSendSedModal(false)}
      />
      {showTopForm() && (
        <>
          <TwoLevelForm
            type='onelevel'
            namespace='formål'
            loggingNamespace='formalmanager'
            forms={[
              { label: t('el:option-mainform-formål'), value: 'formål', component: Formål },
              { label: t('el:option-mainform-motregning'), value: 'periode', component: Periode }
            ]}
            replySed={replySed}
            viewValidation={view}
            updateReplySed={updateReplySed}
            setReplySed={setReplySed}
          />
          <VerticalSeparatorDiv size='2' />
        </>
      )}

      {showTwoLevelForm() && (
        <>
          <TwoLevelForm<ReplySed>
            type='twolevel'
            namespace='svarsed'
            loggingNamespace='personmanager'
            firstForm='personopplysninger'
            forms={[
              { label: t('el:option-mainform-personopplyninger'), value: 'personopplysninger', component: PersonOpplysninger, type: ['F', 'U', 'H'], barn: true },
              { label: t('el:option-mainform-nasjonaliteter'), value: 'nasjonaliteter', component: Nasjonaliteter, type: ['F'], barn: true },
              { label: t('el:option-mainform-adresser'), value: 'adresser', component: Adresser, type: ['F', 'H'], barn: true },
              { label: t('el:option-mainform-kontakt'), value: 'kontaktinformasjon', component: Kontaktinformasjon, type: 'F' },
              { label: t('el:option-mainform-trygdeordninger'), value: 'trygdeordninger', component: Trygdeordning, type: 'F' },
              { label: t('el:option-mainform-familierelasjon'), value: 'familierelasjon', component: Familierelasjon, type: 'F' },
              { label: t('el:option-mainform-personensstatus'), value: 'personensstatus', component: PersonensStatus, type: 'F' },
              { label: t('el:option-mainform-relasjon'), value: 'relasjon', component: Relasjon, type: 'F', barn: true },
              { label: t('el:option-mainform-grunnlagforbosetting'), value: 'grunnlagforbosetting', component: GrunnlagForBosetting, type: 'F', barn: true },
              { label: t('el:option-mainform-beløpnavnogvaluta'), value: 'beløpnavnogvaluta', component: BeløpNavnOgValuta, type: 'F', barn: true, condition: () => (replySed as FSed)?.formaal?.indexOf('vedtak') >= 0 ?? false },
              { label: t('el:option-mainform-familieytelser'), value: 'familieytelser', component: BeløpNavnOgValuta, type: 'F', family: true },
              { label: t('el:option-mainform-referanseperiode'), value: 'referanseperiode', component: Referanseperiode, type: 'U' },
              { label: t('el:option-mainform-arbeidsperioder'), value: 'arbeidsperioder', component: ArbeidsperioderOversikt, type: 'U002' },
              { label: t('el:option-mainform-inntekt'), value: 'inntekt', component: InntektForm, type: 'U004' },
              { label: t('el:option-mainform-retttilytelser'), value: 'retttilytelser', component: RettTilYtelser, type: ['U017'] },
              { label: t('el:option-mainform-forsikring'), value: 'forsikring', component: Forsikring, type: ['U002', 'U017'] },
              { label: t('el:option-mainform-sisteansettelseinfo'), value: 'sisteansettelseinfo', component: SisteAnsettelseInfo, type: ['U002', 'U017'] },
              { label: t('el:option-mainform-grunntilopphør'), value: 'grunntilopphør', component: GrunnTilOpphør, type: ['U002', 'U017'] },
              { label: t('el:option-mainform-periodefordagpenger'), value: 'periodefordagpenger', component: PeriodeForDagpenger, type: ['U002', 'U017'] },
              { label: t('el:option-mainform-svarpåforespørsel'), value: 'svarpåforespørsel', component: SvarPåForespørsel, type: 'H002' },
              { label: t('el:option-mainform-anmodning'), value: 'anmodning', component: Anmodning, type: 'H001' },
              { label: t('el:option-mainform-endredeforhold'), value: 'endredeforhold', component: EndredeForhold, type: 'H001' }
            ]}
            viewValidation={view}
            replySed={replySed}
            updateReplySed={updateReplySed}
            setReplySed={setReplySed}
          />
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      {showBottomForm() && (
        <>
          <TwoLevelForm
            type='onelevel'
            namespace='formål'
            forms={[
              {
                label: t('el:option-mainform-vedtak'),
                value: 'vedtak',
                component: Vedtak,
                condition: () => (replySed as FSed)?.formaal?.indexOf('vedtak') >= 0 ?? false
              },
              {
                label: t('el:option-mainform-motregning'),
                value: 'motregning',
                component: Motregning,
                condition: () => (replySed as FSed)?.formaal?.indexOf('motregning') >= 0 ?? false
              },
              {
                label: t('el:option-mainform-prosedyre'),
                value: 'prosedyre_ved_uenighet',
                component: ProsedyreVedUenighet,
                condition: () => (replySed as FSed)?.formaal?.indexOf('prosedyre_ved_uenighet') >= 0 ?? false
              },
              {
                label: t('el:option-mainform-refusjon'),
                value: 'refusjon_i_henhold_til_artikkel_58_i_forordningen',
                component: KravOmRefusjon,
                condition: () => (replySed as FSed)?.formaal?.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0 ?? false
              },
              {
                label: t('el:option-mainform-kontoopplysninger'),
                value: 'kontoopplysninger',
                component: Kontoopplysning,
                condition: () => (replySed as FSed)?.formaal?.indexOf('motregning') >= 0 || (replySed as FSed)?.formaal?.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0
              }
            ]}
            replySed={replySed}
            viewValidation={view}
            updateReplySed={updateReplySed}
            setReplySed={setReplySed}
            loggingNamespace='formalmanager'
          />
          <VerticalSeparatorDiv size='2' />
        </>
      )}

      {!isH001Sed(replySed) && (
        <>
          <VerticalSeparatorDiv />
          <TextAreaDiv>
            <TextArea
              namespace={namespace}
              error={validation[namespace + '-ytterligereInfo']?.feilmelding}
              key={namespace + '-' + replySed?.sedType}
              id='ytterligereInfo'
              label={t('label:ytterligere-informasjon-til-sed')}
              onChanged={setComment}
              value={isH002Sed(replySed) ? (replySed as H002Sed)?.ytterligereInfo : replySed?.bruker?.ytterligereInfo}
            />
          </TextAreaDiv>
        </>
      )}
      <VerticalSeparatorDiv size='2' />
      <Panel border>
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
        <VerticalSeparatorDiv />
        <ValidationBox heading={t('validation:feiloppsummering')} validation={validation} />
        <VerticalSeparatorDiv />
        <FlexDiv>
          <div>
            <Button
              variant='primary'
              data-amplitude='svarsed.editor.lagresvarsed'
              onClick={sendReplySed}
              disabled={creatingSvarSed || updatingSvarSed}
            >
              {creatingSvarSed
                ? t('message:loading-opprette-sed')
                : updatingSvarSed
                  ? t('message:loading-oppdatering-sed')
                  : t('label:lagre-sed')}
              {(creatingSvarSed || updatingSvarSed) && <Loader />}
            </Button>
            <VerticalSeparatorDiv size='0.5' />
          </div>
          <HorizontalSeparatorDiv />
          <div>
            <Button
              variant='primary'
              // amplitude is dealt on SendSedClick
              title={t('message:help-send-sed')}
              disabled={sendingSed || _.isEmpty(sedCreatedResponse) || !_.isEmpty(sedSendResponse)}
              onClick={onSendSedClick}
            >
              {sendingSed ? t('message:loading-sending-sed') : t('el:button-send-sed')}
            </Button>
            <VerticalSeparatorDiv size='0.5' />
          </div>
          <HorizontalSeparatorDiv />
          <div>
            <Button
              variant='tertiary'
              // amplitude is dealt on SendSedClick
              title={t('message:help-reset-sed')}
              onClick={onRestoreSedClick}
            >
              {t('el:button-reset-form')}
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
      </Panel>
    </PaddedDiv>
  )
}

export default SEDEdit
