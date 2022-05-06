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
import { resetValidation, setValidation } from 'actions/validation'
import Adresser from 'applications/SvarSed/Adresser/Adresser'
import Anmodning from 'applications/SvarSed/Anmodning/Anmodning'
import ArbeidsperioderOversikt from 'applications/SvarSed/ArbeidsperioderOversikt/ArbeidsperioderOversikt'
import BeløpNavnOgValuta from 'applications/SvarSed/BeløpNavnOgValuta/BeløpNavnOgValuta'
import EndredeForhold from 'applications/SvarSed/EndredeForhold/EndredeForhold'
import Familierelasjon from 'applications/SvarSed/Familierelasjon/Familierelasjon'
import Formål from 'applications/SvarSed/Formål/Formål'
import Forsikring from 'applications/SvarSed/Forsikring/Forsikring'
import GrunnlagForBosetting from 'applications/SvarSed/GrunnlagForBosetting/GrunnlagForBosetting'
import GrunnTilOpphør from 'applications/SvarSed/GrunnTilOpphør/GrunnTilOpphør'
import InntektForm from 'applications/SvarSed/InntektForm/InntektForm'
import Kontaktinformasjon from 'applications/SvarSed/Kontaktinformasjon/Kontaktinformasjon'
import Kontoopplysning from 'applications/SvarSed/Kontoopplysning/Kontoopplysning'
import KravOmRefusjon from 'applications/SvarSed/KravOmRefusjon/KravOmRefusjon'
import Motregning from 'applications/SvarSed/Motregning/Motregning'
import Nasjonaliteter from 'applications/SvarSed/Nasjonaliteter/Nasjonaliteter'
import AnmodningsPeriode from 'applications/SvarSed/AnmodningsPeriode/AnmodningsPeriode'
import PeriodeForDagpenger from 'applications/SvarSed/PeriodeForDagpenger/PeriodeForDagpenger'
import PersonensStatus from 'applications/SvarSed/PersonensStatus/PersonensStatus'
import PersonOpplysninger from 'applications/SvarSed/PersonOpplysninger/PersonOpplysninger'
import ProsedyreVedUenighet from 'applications/SvarSed/ProsedyreVedUenighet/ProsedyreVedUenighet'
import Referanseperiode from 'applications/SvarSed/Referanseperiode/Referanseperiode'
import Relasjon from 'applications/SvarSed/Relasjon/Relasjon'
import RettTilYtelser from 'applications/SvarSed/RettTilYtelser/RettTilYtelser'
import SisteAnsettelseInfo from 'applications/SvarSed/SisteAnsettelseInfo/SisteAnsettelseInfo'
import SvarPåForespørsel from 'applications/SvarSed/SvarPåForespørsel/SvarPåForespørsel'
import Trygdeordning from 'applications/SvarSed/Trygdeordning/Trygdeordning'
import Vedtak from 'applications/SvarSed/Vedtak/Vedtak'
import SendSEDModal from 'applications/SvarSed/SendSEDModal/SendSEDModal'
import MainForm from 'applications/SvarSed/MainForm'
import TextArea from 'components/Forms/TextArea'
import Modal from 'components/Modal/Modal'
import { TextAreaDiv } from 'components/StyledComponents'
import ValidationBox from 'components/ValidationBox/ValidationBox'
import * as types from 'constants/actionTypes'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import { Barn, F002Sed, FSed, H002Sed, ReplySed } from 'declarations/sed'
import { CreateSedResponse, Validation } from 'declarations/types'
import performValidation from 'utils/performValidation'
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
  validation: state.validation.status
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
    validation
  }: SEDEditSelector = useAppSelector(mapState)
  const namespace = 'editor'

  const [_modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_sendButtonClicked, _setSendButtonClicked] = useState<boolean>(false)
  const [_viewSendSedModal, setViewSendSedModal] = useState<boolean>(false)
  const fnr = getFnr(replySed, 'bruker')

  const showTopForm = (): boolean => isFSed(replySed)
  const showMainForm = (): boolean => isSed(replySed)
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
      const [valid, newValidation] = performValidation<ValidationSEDEditProps>(validation, '', validateSEDEdit, {
        replySed: newReplySed
      })
      dispatch(setValidation(newValidation))
      if (valid) {
        setViewSendSedModal(true)
        if (!_.isEmpty(newReplySed?.sed)) {
          dispatch(updateSed(newReplySed))
        } else {
          dispatch(createSed(newReplySed))
        }
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
          <MainForm
            type='onelevel'
            namespace='formål1'
            loggingNamespace='formalmanager'
            forms={[
              { label: t('el:option-mainform-formål'), value: 'formål', component: Formål },
              { label: t('el:option-mainform-periode'), value: 'anmodningsperiode', component: AnmodningsPeriode }
            ]}
            replySed={replySed}
            updateReplySed={updateReplySed}
            setReplySed={setReplySed}
          />
          <VerticalSeparatorDiv size='2' />
        </>
      )}

      {showMainForm() && (
        <>
          <MainForm<ReplySed>
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
            replySed={replySed}
            updateReplySed={updateReplySed}
            setReplySed={setReplySed}
          />
          <VerticalSeparatorDiv size='2' />
        </>
      )}
      {showBottomForm() && (
        <>
          <MainForm
            type='onelevel'
            namespace='formål2'
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
              title={t('message:help-restore-sed')}
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
