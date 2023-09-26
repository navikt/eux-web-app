import { Alert, Button, Loader, Panel } from '@navikt/ds-react'
import { Container, Content, FlexDiv, HorizontalSeparatorDiv, Margin, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { alertReset } from 'actions/alert'
import { resetCurrentEntry } from 'actions/localStorage'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import {
  cleanUpSvarSed,
  createSed, editSed, querySaks,
  restoreReplySed,
  sendSedInRina,
  setReplySed, updateAttachmentsSensitivt,
  updateReplySed,
  updateSed
} from 'actions/svarsed'
import { resetValidation, setValidation } from 'actions/validation'
import Adresser from 'applications/SvarSed/Adresser/Adresser'
import Anmodning from 'applications/SvarSed/Anmodning/Anmodning'
import AnmodningsPeriode from 'applications/SvarSed/AnmodningsPeriode/AnmodningsPeriode'
import ArbeidsperioderOversikt from 'applications/SvarSed/ArbeidsperioderOversikt/ArbeidsperioderOversikt'
import Avslutning from 'applications/SvarSed/Avslutning/Avslutning'
import Avvis from 'applications/SvarSed/Avvis/Avvis'
import BeløpNavnOgValuta from 'applications/SvarSed/BeløpNavnOgValuta/BeløpNavnOgValuta'
import EndredeForhold from 'applications/SvarSed/EndredeForhold/EndredeForhold'
import Familierelasjon from 'applications/SvarSed/Familierelasjon/Familierelasjon'
import Formål from 'applications/SvarSed/Formål/Formål'
import Forsikring from 'applications/SvarSed/Forsikring/Forsikring'
import GrunnlagForBosetting from 'applications/SvarSed/GrunnlagForBosetting/GrunnlagForBosetting'
import GrunnTilOpphør from 'applications/SvarSed/GrunnTilOpphør/GrunnTilOpphør'
import InntektForm from 'applications/SvarSed/InntektForm/InntektForm'
import Klargjør from 'applications/SvarSed/Klargjør/Klargjør'
import Kontaktinformasjon from 'applications/SvarSed/Kontaktinformasjon/Kontaktinformasjon'
import Kontoopplysning from 'applications/SvarSed/Kontoopplysning/Kontoopplysning'
import KravOmRefusjon from 'applications/SvarSed/KravOmRefusjon/KravOmRefusjon'
import MainForm from 'applications/SvarSed/MainForm'
import Motregning from 'applications/SvarSed/Motregning/Motregning'
import Nasjonaliteter from 'applications/SvarSed/Nasjonaliteter/Nasjonaliteter'
import PeriodeForDagpenger from 'applications/SvarSed/PeriodeForDagpenger/PeriodeForDagpenger'
import PersonensStatus from 'applications/SvarSed/PersonensStatus/PersonensStatus'
import PersonLight from 'applications/SvarSed/PersonLight/PersonLight'
import PersonOpplysninger from 'applications/SvarSed/PersonOpplysninger/PersonOpplysninger'
import PreviewSED from 'applications/SvarSed/PreviewSED/PreviewSED'
import ProsedyreVedUenighet from 'applications/SvarSed/ProsedyreVedUenighet/ProsedyreVedUenighet'
import Påminnelse from 'applications/SvarSed/Påminnelse/Påminnelse'
import Referanseperiode from 'applications/SvarSed/Referanseperiode/Referanseperiode'
import Relasjon from 'applications/SvarSed/Relasjon/Relasjon'
import RettTilYtelser from 'applications/SvarSed/RettTilYtelser/RettTilYtelser'
import SEDDetails from 'applications/SvarSed/SEDDetails/SEDDetails'
import SendSEDModal from 'applications/SvarSed/SendSEDModal/SendSEDModal'
import SisteAnsettelseInfo from 'applications/SvarSed/SisteAnsettelseInfo/SisteAnsettelseInfo'
import SvarPåForespørsel from 'applications/SvarSed/SvarPåForespørsel/SvarPåForespørsel'
import SvarPåminnelse from 'applications/SvarSed/SvarPåminnelse/SvarPåminnelse'
import Trygdeordning from 'applications/SvarSed/Trygdeordning/Trygdeordning'
import Ugyldiggjøre from 'applications/SvarSed/Ugyldiggjøre/Ugyldiggjøre'
import Vedtak from 'applications/SvarSed/Vedtak/Vedtak'
import TextArea from 'components/Forms/TextArea'
import { TextAreaDiv } from 'components/StyledComponents'
import ValidationBox from 'components/ValidationBox/ValidationBox'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as types from 'constants/actionTypes'
import { State } from 'declarations/reducers'
import { F002Sed, FSed, ReplySed } from 'declarations/sed'
import { CreateSedResponse, Sak, Sed, Validation } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import { getFnr } from 'utils/fnr'
import performValidation from 'utils/performValidation'
import { cleanReplySed, isFSed, isH002Sed, isPreviewableSed, isSed, isXSed } from 'utils/sed'
import { validateSEDEdit, ValidationSEDEditProps } from './mainValidation'
import Attachments from "../../applications/Vedlegg/Attachments/Attachments";
import {JoarkBrowserItem} from "../../declarations/attachments";

export interface SEDEditSelector {
  alertType: string | undefined
  alertMessage: JSX.Element | string | undefined
  creatingSvarSed: boolean
  updatingSvarSed: boolean
  currentSak: Sak | undefined
  replySed: ReplySed | null | undefined
  replySedChanged: boolean
  sendingSed: boolean
  sedCreatedResponse: CreateSedResponse | null | undefined
  sedSendResponse: any
  validation: Validation
  savedVedlegg: JoarkBrowserItem | null | undefined
  setVedleggSensitiv: any | null | undefined
  attachmentRemoved: JoarkBrowserItem | null | undefined
  textAreaDirty: boolean
  textFieldDirty: boolean
}

const mapState = (state: State): SEDEditSelector => ({
  alertType: state.alert.type,
  alertMessage: state.alert.stripeMessage,
  creatingSvarSed: state.loading.creatingSvarSed,
  updatingSvarSed: state.loading.updatingSvarSed,
  currentSak: state.svarsed.currentSak,
  replySed: state.svarsed.replySed,
  replySedChanged: state.svarsed.replySedChanged,
  sendingSed: state.loading.sendingSed,
  sedCreatedResponse: state.svarsed.sedCreatedResponse,
  sedSendResponse: state.svarsed.sedSendResponse,
  validation: state.validation.status,
  savedVedlegg: state.svarsed.savedVedlegg,
  setVedleggSensitiv: state.svarsed.setVedleggSensitiv,
  attachmentRemoved: state.svarsed.attachmentRemoved,
  textAreaDirty: state.ui.textAreaDirty,
  textFieldDirty: state.ui.textFieldDirty
})

const SEDEdit = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { sedId, sakId } = useParams()
  const {
    alertType,
    alertMessage,
    creatingSvarSed,
    updatingSvarSed,
    currentSak,
    replySed,
    replySedChanged,
    sendingSed,
    sedCreatedResponse,
    sedSendResponse,
    validation,
    savedVedlegg,
    attachmentRemoved,
    setVedleggSensitiv,
    textAreaDirty,
    textFieldDirty
  } = useAppSelector(mapState)
  const namespace = 'editor'

  const [_sendButtonClicked, _setSendButtonClicked] = useState<boolean>(false)
  const [_viewSendSedModal, setViewSendSedModal] = useState<boolean>(false)
  const fnr = getFnr(replySed, 'bruker')
  const showAttachments: boolean = !isXSed(replySed)

  const showTopForm = (): boolean => isFSed(replySed)
  const showMainForm = (): boolean => isSed(replySed)
  const showBottomForm = (): boolean =>
    isFSed(replySed) && (
      (replySed as F002Sed)?.formaal?.indexOf('motregning') >= 0 ||
      (replySed as F002Sed)?.formaal?.indexOf('vedtak') >= 0 ||
      (replySed as F002Sed)?.formaal?.indexOf('prosedyre_ved_uenighet') >= 0 ||
      (replySed as F002Sed)?.formaal?.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0
    )

  const saveReplySed = (e: any): void => {
    if (replySed) {
      const newReplySed: ReplySed = cleanReplySed(replySed)
      const clonedValidation = _.cloneDeep(validation)
      const hasErrors = performValidation<ValidationSEDEditProps>(clonedValidation, '', validateSEDEdit, {
        replySed: newReplySed
      })
      dispatch(setValidation(clonedValidation))
      if (!hasErrors) {
        setViewSendSedModal(true)
        if (replySed?.sed?.sedId) {
          dispatch(updateSed(newReplySed))
        } else {
          dispatch(createSed(newReplySed))
        }
        buttonLogger(e)
      }
    }
  }

  const onSendSedClick = () => {
    if (replySed?.sak?.sakId && replySed?.sed?.sedId) {
      _setSendButtonClicked(true)
      dispatch(sendSedInRina(replySed.sak!.sakId!, replySed?.sed?.sedId!))
      standardLogger('svarsed.editor.sendsvarsed.button', { type: 'editor' })
    }
  }

  const onRestoreSedClick = () => {
    if (window.confirm(t('label:er-du-sikker'))) {
      dispatch(restoreReplySed())
    }
  }

  const setComment = (comment: string) => {
    dispatch(updateReplySed('ytterligereInfo', comment))
    if (validation[namespace + '-ytterligereInfo']) {
      dispatch(resetValidation(namespace + '-ytterligereInfo'))
    }
  }

  useEffect(() => {
    dispatch(startPageStatistic('editor'))
    return () => {
      dispatch(finishPageStatistic('editor'))
    }
  }, [])

  useEffect(() => {
    if (_.isUndefined(currentSak) && _.isUndefined(replySed)) {
      if (sakId) {
        dispatch(querySaks(sakId, 'refresh'))
      }
    }
  }, [])

  useEffect(() => {
    if (!_.isEmpty(currentSak) && _.isUndefined(replySed)) {
      const currentSed = _.filter(currentSak.sedListe, (sed) => sed.sedId === sedId)
      dispatch(editSed(currentSed[0] as Sed, currentSak as Sak))
    }
  }, [currentSak])

  // after successful SED send, go back to SED list
  useEffect(() => {
    if (_sendButtonClicked && !_.isNil(sedSendResponse)) {
      const sakId = replySed?.sak?.sakId
      dispatch(resetCurrentEntry('svarsed'))
      setTimeout(() =>
        dispatch(cleanUpSvarSed())
      , 200)
      const params: URLSearchParams = new URLSearchParams(window.location.search)
      const q = params.get('q')
      const search = '?refresh=true' + (q ? '&q=' + q : '')
      navigate({
        pathname: '/svarsed/view/sak/' + sakId,
        search
      })
    }
  }, [_sendButtonClicked, sedSendResponse])


  if (!replySed) {
    return <WaitingPanel />
  }

  const disableSave = !textFieldDirty && !textAreaDirty && ((!replySedChanged && !!replySed.sed?.sedId) || creatingSvarSed || updatingSvarSed);
  const disableSend  = textFieldDirty || textAreaDirty || sendingSed || !replySed?.sed?.sedId || (replySed?.sed?.status === "sent" &&_.isEmpty(sedCreatedResponse)) || !_.isEmpty(sedSendResponse) || !disableSave;

  return (
    <Container>
      <Margin />
      <Content style={{ flex: 6 }}>
        <SendSEDModal
          fnr={fnr!}
          open={_viewSendSedModal}
          replySed={replySed}
          onModalClose={() => {
            dispatch(alertReset())
            setViewSendSedModal(false)
          }}
          onSendSedClicked={() => {
            onSendSedClick();
            setViewSendSedModal(false)
          }}
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
              firstForm={isXSed(replySed) ? 'personlight' : 'personopplysninger'}
              forms={[
                { label: t('el:option-mainform-personopplyninger'), value: 'personopplysninger', component: PersonOpplysninger, type: ['F', 'U', 'H'], adult: true, barn: true },
                { label: t('el:option-mainform-person'), value: 'personlight', component: PersonLight, type: 'X' },
                { label: t('el:option-mainform-nasjonaliteter'), value: 'nasjonaliteter', component: Nasjonaliteter, type: ['F', 'U', 'H'], adult: true, barn: true },
                { label: t('el:option-mainform-adresser'), value: 'adresser', component: Adresser, type: ['F', 'H'], adult: true, barn: true },
                { label: t('el:option-mainform-kontakt'), value: 'kontaktinformasjon', component: Kontaktinformasjon, type: 'F', adult: true },
                { label: t('el:option-mainform-trygdeordninger'), value: 'trygdeordning', component: Trygdeordning, type: 'F', adult: true },
                { label: t('el:option-mainform-familierelasjon'), value: 'familierelasjon', component: Familierelasjon, type: 'F', adult: true },
                { label: t('el:option-mainform-personensstatus'), value: 'personensstatus', component: PersonensStatus, type: 'F', adult: true },
                { label: t('el:option-mainform-relasjon'), value: 'relasjon', component: Relasjon, type: 'F', adult: false, barn: true },
                { label: t('el:option-mainform-grunnlagforbosetting'), value: 'grunnlagforbosetting', component: GrunnlagForBosetting, type: 'F', adult: true, barn: true },
                { label: t('el:option-mainform-beløpnavnogvaluta'), value: 'beløpnavnogvaluta', component: BeløpNavnOgValuta, type: 'F', adult: false, barn: true, condition: () => (replySed as FSed)?.formaal?.indexOf('vedtak') >= 0 ?? false },
                { label: t('el:option-mainform-familieytelser'), value: 'familieytelser', component: BeløpNavnOgValuta, type: 'F', adult: false, family: true },
                { label: t('el:option-mainform-referanseperiode'), value: 'referanseperiode', component: Referanseperiode, type: 'U' },
                { label: t('el:option-mainform-inntekt'), value: 'inntekt', component: InntektForm, type: 'U004' },
                { label: t('el:option-mainform-retttilytelser'), value: 'retttilytelser', component: RettTilYtelser, type: ['U017'] },
                { label: t('el:option-mainform-arbeidsperioder'), value: 'arbeidsperioder', component: ArbeidsperioderOversikt, type: ['U002', 'U017'] },
                { label: t('el:option-mainform-forsikring'), value: 'forsikring', component: Forsikring, type: ['U002', 'U017'] },
                { label: t('el:option-mainform-sisteansettelseinfo'), value: 'sisteansettelseinfo', component: SisteAnsettelseInfo, type: ['U002', 'U017'] },
                { label: t('el:option-mainform-grunntilopphør'), value: 'grunntilopphør', component: GrunnTilOpphør, type: ['U002', 'U017'] },
                { label: t('el:option-mainform-periodefordagpenger'), value: 'periodefordagpenger', component: PeriodeForDagpenger, type: ['U002', 'U017'] },
                { label: t('el:option-mainform-svarpåforespørsel'), value: 'svarpåforespørsel', component: SvarPåForespørsel, type: 'H002' },
                { label: t('el:option-mainform-anmodning'), value: 'anmodning', component: Anmodning, type: 'H001' },
                { label: t('el:option-mainform-endredeforhold'), value: 'endredeforhold', component: EndredeForhold, type: 'H001' },
                { label: t('el:option-mainform-avslutning'), value: 'avslutning', component: Avslutning, type: 'X001' },
                { label: t('el:option-mainform-ugyldiggjøre'), value: 'ugyldiggjøre', component: Ugyldiggjøre, type: 'X008' },
                { label: t('el:option-mainform-påminnelse'), value: 'påminnelse', component: Påminnelse, type: 'X009' },
                { label: t('el:option-mainform-svarpåminnelse'), value: 'svarpåminnelse', component: SvarPåminnelse, type: 'X010' },
                { label: t('el:option-mainform-avvis'), value: 'avvis', component: Avvis, type: 'X011' },
                { label: t('el:option-mainform-klargjør'), value: 'klargjør', component: Klargjør, type: 'X012' }
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
        {(isFSed(replySed) || isH002Sed(replySed)) && (
          <>
            <VerticalSeparatorDiv />
            <TextAreaDiv>
              <TextArea
                namespace={namespace}
                error={validation[namespace + '-ytterligereInfo']?.feilmelding}
                id='ytterligereInfo'
                label={t('label:ytterligere-informasjon-til-sed')}
                onChanged={setComment}
                value={(replySed as FSed).ytterligereInfo}
              />
            </TextAreaDiv>
          </>
        )}
        {showAttachments && (
          <>
            <VerticalSeparatorDiv />
            <Attachments
              fnr={fnr}
              replySed={replySed}
              attachmentsFromRina={replySed.sed?.vedlegg}
              savedVedlegg={savedVedlegg}
              setVedleggSensitiv={setVedleggSensitiv}
              attachmentRemoved={attachmentRemoved}
              sedId={replySed.sed?.sedId}
              rinaSakId={currentSak ? currentSak?.sakId : replySed.sak?.sakId}
              onUpdateAttachmentSensitivt={(attachment, sensitivt) => {
                //console.log(attachment)
                dispatch(updateAttachmentsSensitivt(attachment.key, sensitivt))
              }}
              onAttachmentsChanged={(attachments) => {
                dispatch(setReplySed({
                  ...replySed,
                  attachments
                }))
              }}
            />
          </>
        )}
        <VerticalSeparatorDiv size='2' />
        <Panel border>
          {!!replySed && isPreviewableSed(replySed!.sedType) && (
            <>
              <PreviewSED replySed={replySed} />
              <VerticalSeparatorDiv />
            </>
          )}
          <ValidationBox heading={t('validation:feiloppsummering')} validation={validation} />
          <VerticalSeparatorDiv />
          <FlexDiv>
            <div>
              <Button
                variant='primary'
                data-amplitude='svarsed.editor.lagresvarsed'
                onClick={saveReplySed}
                disabled={disableSave}
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
                //amplitude is dealt on SendSedClick
                title={t('message:help-send-sed')}
                disabled={disableSend}
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
                //amplitude is dealt on SendSedClick
                title={t('message:help-restore-sed')}
                onClick={onRestoreSedClick}
              >
                {t('el:button-reset-form')}
              </Button>
              <VerticalSeparatorDiv size='0.5' />
            </div>
          </FlexDiv>
          {_sendButtonClicked && alertMessage && alertType === types.SVARSED_SED_SEND_FAILURE && (
            <>
              <VerticalSeparatorDiv />
              <FlexDiv>
                <Alert variant='error'>
                  {alertMessage!}
                </Alert>
                <Button
                  variant='tertiary' onClick={() => {
                    _setSendButtonClicked(false)
                    dispatch(alertReset())
                  }}
                >
                  OK
                </Button>
              </FlexDiv>
            </>
          )}
        </Panel>
      </Content>
      <Content style={{ flex: 2 }}>
        <SEDDetails/>
      </Content>
      <Margin />
    </Container>
  )
}

export default SEDEdit
