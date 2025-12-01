import { Alert, Button, Loader, Panel } from '@navikt/ds-react'
import { Container, Content, FlexDiv, HorizontalSeparatorDiv, Margin, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { alertReset } from 'actions/alert'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import {
  cleanUpSvarSed,
  createSed, editSed, querySaks,
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
import MottakAvSoknad from 'applications/SvarSed/MottakAvSoknad/MottakAvSoknad'
import Motregning from 'applications/SvarSed/Motregning/Motregning'
import Nasjonaliteter from 'applications/SvarSed/Nasjonaliteter/Nasjonaliteter'
import PeriodeForDagpenger from 'applications/SvarSed/PeriodeForDagpenger/PeriodeForDagpenger'
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
import {F002Sed, F027Sed, FSed, ReplySed} from 'declarations/sed'
import { CreateSedResponse, Sak, Sed, Validation } from 'declarations/types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import { getFnr } from 'utils/fnr'
import performValidation from 'utils/performValidation'
import {
  cleanReplySed,
  isF001Sed,
  isF002Sed,
  isF003Sed,
  isF026Sed,
  isF027Sed,
  isFSed,
  isH002Sed,
  isPreviewableSed,
  isS040Sed,
  isS046Sed,
  isSed,
  isXSed
} from 'utils/sed'
import { validateSEDEdit, ValidationSEDEditProps } from './mainValidation'
import Attachments from "applications/Vedlegg/Attachments/Attachments";
import {JoarkBrowserItem} from "declarations/attachments";
import VedtakForF003 from 'applications/SvarSed/VedtakForF003/VedtakForF003'
import YtterligereInfo from "applications/SvarSed/YtterligereInfo/YtterligereInfo";
import RettTilYtelserFSED from 'applications/SvarSed/RettTilYtelserFSED/RettTilYtelserFSED'
import FamilieRelasjonF003 from "applications/SvarSed/FamilieRelasjonF003/FamilieRelasjonF003";
import EtterspurtInformasjon from "applications/SvarSed/EtterspurtInformasjon/EtterspurtInformasjon";
import SvarPaaAnmodningOmInformasjon from "applications/SvarSed/SvarPaaAnmodningOmInformasjon/SvarPaaAnmodningOmInformasjon";
import SvarPaaForespoerselOmAdopsjon from "applications/SvarSed/SvarPaaForespoerselOmAdopsjon/SvarPaaForespoerselOmAdopsjon";
import SvarPaaAnmodningOmInntekt from "applications/SvarSed/SvarPaaAnmodningOmInntekt/SvarPaaAnmodningOmInntekt";
import IdentifiseringAvDenAvdoede from "applications/SvarSed/SvarPaaAnmodningOmBarnepensjon/IdentifiseringAvDenAvdoede";
import IdentifiseringAvDeBeroerteBarna
  from "../../applications/SvarSed/SvarPaaAnmodningOmBarnepensjon/IdentifiseringAvDeBeroerteBarna";
import IdentifiseringAvAnnenPerson
  from "../../applications/SvarSed/SvarPaaAnmodningOmBarnepensjon/IdentifiseringAvAnnenPerson";
import DenForeldreloesesBarnetsBosted
  from "../../applications/SvarSed/SvarPaaAnmodningOmBarnepensjon/DenForeldreloesesBarnetsBosted";
import RelasjonForeldreloeseBarnetOgAvdoede
  from "../../applications/SvarSed/SvarPaaAnmodningOmBarnepensjon/RelasjonForeldreloeseBarnetOgAvdoede/RelasjonForeldreloeseBarnetOgAvdoede";
import RelasjonAnnenPersonOgAvdoede
  from "../../applications/SvarSed/SvarPaaAnmodningOmBarnepensjon/RelasjonAnnenPersonOgAvdoede/RelasjonAnnenPersonOgAvdoede";
import BarnetFritekst from "../../applications/SvarSed/SvarPaaAnmodningOmBarnepensjon/BarnetFritekst";
import InntektForeldreloeseBarnet
  from "../../applications/SvarSed/SvarPaaAnmodningOmBarnepensjon/InntektForeldreloeseBarnet";
import AnnenInformasjonOmBarnetFritekst
  from "../../applications/SvarSed/SvarPaaAnmodningOmAnnenInformasjonOmBarnet/AnnenInformasjonOmBarnetFritekst";
import ErBarnetAdoptert from "../../applications/SvarSed/SvarPaaAnmodningOmAnnenInformasjonOmBarnet/ErBarnetAdoptert";
import ForsoergesAvDetOffentlige
  from "../../applications/SvarSed/SvarPaaAnmodningOmAnnenInformasjonOmBarnet/ForsoergesAvDetOffentlige";
import InformasjonOmBarnehage
  from "../../applications/SvarSed/SvarPaaAnmodningOmAnnenInformasjonOmBarnet/InformasjonOmBarnehage";
import BarnetsSivilstand from "../../applications/SvarSed/SvarPaaAnmodningOmAnnenInformasjonOmBarnet/BarnetsSivilstand";
import DatoEndredeForhold
  from "../../applications/SvarSed/SvarPaaAnmodningOmAnnenInformasjonOmBarnet/DatoEndredeForhold";
import SvarOmFremmoeteUtdanning from "../../applications/SvarSed/SvarOmFremmoeteUtdanning/SvarOmFremmoeteUtdanning";
import Forespoersel from "../../applications/SvarSed/Forespoersel/Forespoersel";
import AktivitetOgTrygdeperioder from "../../applications/SvarSed/AktivitetOgTrygdeperioder/AktivitetOgTrygdeperioder";
import InformasjonOmUtbetaling from "../../applications/SvarSed/InformasjonOmUtbetaling/InformasjonOmUtbetaling";

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
  deselectedMenu: string | undefined
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
  textFieldDirty: state.ui.textFieldDirty,
  deselectedMenu: state.svarsed.deselectedMenu
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
    textFieldDirty,
    deselectedMenu
  } = useAppSelector(mapState)
  const namespace = 'editor'

  const [_sendButtonClicked, _setSendButtonClicked] = useState<boolean>(false)
  const [_viewSendSedModal, setViewSendSedModal] = useState<boolean>(false)
  const fnr = getFnr(replySed, 'bruker')
  const showAttachments: boolean = !isXSed(replySed)

  const showMainForm = (): boolean => isSed(replySed)
  const showBottomForm = (): boolean =>
    isFSed(replySed) && (
      (replySed as F002Sed)?.formaal?.indexOf('motregning') >= 0 ||
      (replySed as F002Sed)?.formaal?.indexOf('vedtak') >= 0 ||
      (replySed as F002Sed)?.formaal?.indexOf('prosedyre_ved_uenighet') >= 0 ||
      (replySed as F002Sed)?.formaal?.indexOf('refusjon_ihht_artikkel_58_i_forordning') >= 0 ||
      (replySed as F002Sed)?.formaal?.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0
    )

  const saveReplySed = (): void => {
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
      }
    }
  }

  const onSendSedClick = () => {
    if (replySed) {
      const newReplySed: ReplySed = cleanReplySed(replySed)
      const clonedValidation = _.cloneDeep(validation)
      const hasErrors = performValidation<ValidationSEDEditProps>(clonedValidation, '', validateSEDEdit, {
        replySed: newReplySed
      })
      dispatch(setValidation(clonedValidation))

      if (!hasErrors && replySed?.sak?.sakId && replySed?.sed?.sedId) {
        _setSendButtonClicked(true)
        dispatch(sendSedInRina(replySed.sak!.sakId!, replySed?.sed?.sedId!))
      }
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
    let controller = new AbortController();
    const signal = controller.signal;

    if (_.isUndefined(currentSak) && _.isUndefined(replySed)) {
      if (sakId) {
        dispatch(querySaks(sakId, 'refresh', false, signal))
      }
    }

    return () => {
      if(controller){
        controller.abort();
      }
    }
  }, [])

  useEffect(() => {
    if (!_.isEmpty(currentSak) && _.isUndefined(replySed) && sedId!=="new") {
      const currentSed = _.filter(currentSak.sedListe, (sed) => sed.sedId === sedId)
      dispatch(editSed(currentSed[0] as Sed, currentSak as Sak))
    } else if (_.isUndefined(replySed) && sedId==="new") {
      const params: URLSearchParams = new URLSearchParams(window.location.search)
      const q = params.get('q')
      const search = (q ? '?q=' + q : '')
      navigate({
        pathname: '/svarsed/view/sak/' + sakId,
        search
      })
    }
  }, [currentSak])

  useEffect(() => {
    if (sedCreatedResponse) {
      const isNewSed = window.location.pathname.indexOf("/sed/new") > 0
      if(isNewSed && sedCreatedResponse.sedId){
        window.history.replaceState(null, "", "/svarsed/edit/sak/" + sakId + "/sed/" + sedCreatedResponse.sedId)
      }
    }
  }, [sedCreatedResponse])

  // after successful SED send, go back to SED list
  useEffect(() => {
    if (_sendButtonClicked && !_.isNil(sedSendResponse)) {
      const sakId = replySed?.sak?.sakId
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

  const formaalToMenuMap: any = {
    "vedtak": {
      menu: "vedtak",
      menuOption: "beløpnavnogvaluta"
    },
    "motregning": {
      menu: "motregning",
      menuOption: undefined
    },
    "prosedyre_ved_uenighet": {
      menu: "prosedyre_ved_uenighet",
      menuOption: undefined
    },
    "refusjon_i_henhold_til_artikkel_58_i_forordningen": {
      menu: "refusjon_i_henhold_til_artikkel_58_i_forordningen",
      menuOption: undefined
    },
    "refusjon_ihht_artikkel_58_i_forordning": {
      menu: "refusjon_ihht_artikkel_58_i_forordning",
      menuOption: undefined
    }
  }

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
        {(isF001Sed(replySed) || isF002Sed(replySed)) && (
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
        {isF003Sed(replySed) && (
          <>
            <MainForm
              type='onelevel'
              namespace='mottakavsoknad'
              loggingNamespace='mottakavsoknadmanager'
              forms={[
                { label: t('el:option-mainform-mottak-av-soknad'), value: 'mottakavsoknad', component: MottakAvSoknad },
              ]}
              replySed={replySed}
              updateReplySed={updateReplySed}
              setReplySed={setReplySed}
            />
            <VerticalSeparatorDiv size='2' />
          </>
        )}
        {isF027Sed(replySed) && (
          <>
            <MainForm
              type='onelevel'
              namespace='svarpaaanmodningominformasjon'
              loggingNamespace='svarpaaanmodningominformasjonmanager'
              forms={[
                { label: t('el:option-mainform-svarpaaanmodningominformasjon'), value: 'svarpaaanmodningominformasjon', component: SvarPaaAnmodningOmInformasjon },
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
              deselectedMenuOption={deselectedMenu && formaalToMenuMap[deselectedMenu] ? formaalToMenuMap[deselectedMenu].menuOption : undefined}
              forms={[
                { label: t('el:option-mainform-personopplyninger'), value: 'personopplysninger', component: PersonOpplysninger, type: ['F', 'U', 'H', 'S'], adult: true, barn: true },
                { label: t('el:option-mainform-person'), value: 'personlight', component: PersonLight, type: 'X' },
                { label: t('el:option-mainform-nasjonaliteter'), value: 'nasjonaliteter', component: Nasjonaliteter, type: ['F', 'U', 'H', 'S'], adult: true, barn: true },
                { label: t('el:option-mainform-adresser'), value: 'adresser', component: Adresser, type: ['F', 'H'], adult: true, barn: true },
                { label: t('el:option-mainform-adresse'), value: 'adresse', component: Adresser, type: ['S'], options: {singleAdress: true}},
                { label: t('el:option-mainform-kontakt'), value: 'kontaktinformasjon', component: Kontaktinformasjon, type: 'F', adult: true },
                { label: t('el:option-mainform-ytterligereinformasjon'), value: 'ytterligereInfo', component: YtterligereInfo, type: 'F003', spouse: true },
                { label: t('el:option-mainform-trygdeordninger'), value: 'trygdeordning', component: Trygdeordning, type: ['F026', 'F027'], adult: true },
                { label: t('el:option-mainform-aktivitetogtrygdeperioder'), value: 'aktivitetogtrygdeperioder', component: AktivitetOgTrygdeperioder, type: ['F001', 'F002'], adult: true },
                { label: t('el:option-mainform-familierelasjon'), value: 'familierelasjon', component: Familierelasjon, type: ['F001', 'F002'], adult: true },
                { label: t('el:option-mainform-familierelasjon'), value: 'familierelasjonf003', component: FamilieRelasjonF003, type: 'F003', other: true },
                { label: t('el:option-mainform-retttilytelser'), value: 'retttilytelserfsed', component: RettTilYtelserFSED, type: ['F003'], user: true },
                { label: t('el:option-mainform-relasjon'), value: 'relasjon', component: Relasjon, type: ['F001', 'F002'], adult: false, barn: true },
                { label: t('el:option-mainform-grunnlagforbosetting'), value: 'grunnlagforbosetting', component: GrunnlagForBosetting, type: ['F001', 'F002'], adult: true, barn: true },
                { label: t('el:option-mainform-beløpnavnogvaluta'), value: 'beløpnavnogvaluta', component: BeløpNavnOgValuta, type: ['F001', 'F002'], adult: false, barn: true, condition: () => (replySed as FSed)?.formaal?.indexOf('vedtak') >= 0 },
                { label: t('el:option-mainform-familieytelser'), value: 'familieytelser', component: BeløpNavnOgValuta, type: ['F001', 'F002'], adult: false, family: true },
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
              deselectedMenu={deselectedMenu && formaalToMenuMap[deselectedMenu] ? formaalToMenuMap[deselectedMenu].menu : undefined}
              forms={[
                {
                  label: t('el:option-mainform-vedtak'),
                  value: 'vedtak',
                  component: Vedtak,
                  condition: () => (replySed as FSed)?.formaal?.indexOf('vedtak') >= 0
                },
                {
                  label: t('el:option-mainform-motregning'),
                  value: 'motregning',
                  component: Motregning,
                  condition: () => (replySed as FSed)?.formaal?.indexOf('motregning') >= 0
                },
                {
                  label: t('el:option-mainform-prosedyre'),
                  value: 'prosedyre_ved_uenighet',
                  component: ProsedyreVedUenighet,
                  condition: () => (replySed as FSed)?.formaal?.indexOf('prosedyre_ved_uenighet') >= 0
                },
                {
                  label: t('el:option-mainform-refusjon'),
                  value: 'refusjon_ihht_artikkel_58_i_forordning',
                  component: KravOmRefusjon,
                  condition: () => (replySed as FSed)?.formaal?.indexOf('refusjon_ihht_artikkel_58_i_forordning') >= 0
                },
                {
                  label: t('el:option-mainform-refusjon'),
                  value: 'refusjon_i_henhold_til_artikkel_58_i_forordningen',
                  component: KravOmRefusjon,
                  condition: () => (replySed as FSed)?.formaal?.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0
                },
                {
                  label: t('el:option-mainform-kontoopplysninger'),
                  value: 'kontoopplysninger',
                  component: Kontoopplysning,
                  condition: () => (replySed as FSed)?.formaal?.indexOf('motregning') >= 0 || (replySed as FSed)?.formaal?.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0 || (replySed as FSed)?.formaal?.indexOf('refusjon_ihht_artikkel_58_i_forordning') >= 0
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
        {isF003Sed(replySed) &&
          <>
            <MainForm
              type='onelevel'
              menuDefaultClosed={true}
              namespace='vedtak'
              forms={[
                {
                  label: t('el:option-mainform-vedtak'),
                  value: 'vedtak',
                  component: VedtakForF003,
                }
              ]}
              replySed={replySed}
              updateReplySed={updateReplySed}
              setReplySed={setReplySed}
              loggingNamespace='vedtakmanager'
            />
            <VerticalSeparatorDiv size='2' />
          </>
        }
        {isF026Sed(replySed) &&
          <>
            <MainForm
              type='onelevel'
              menuDefaultClosed={true}
              namespace='etterspurtinformasjon'
              forms={[
                {
                  label: t('el:option-mainform-etterspurtinformasjon'),
                  value: 'etterspurtinformasjon',
                  component: EtterspurtInformasjon,
                }
              ]}
              replySed={replySed}
              updateReplySed={updateReplySed}
              setReplySed={setReplySed}
              loggingNamespace='etterspurtinfomanager'
            />
            <VerticalSeparatorDiv size='2' />
          </>
        }
        {isF027Sed(replySed) &&
          <>
            <MainForm
              type='menuitems'
              menuDefaultClosed={true}
              namespace='svarpaaanmodningominformasjon'
              deselectedMenu={deselectedMenu}
              menuItems={[
                {key: "adopsjon", label:t('label:svar-på-anmodning-om-adopsjon') , condition: () => (replySed as F027Sed).anmodningOmMerInformasjon?.svar?.adopsjon},
                {key: "inntekt", label:t('label:svar-på-anmodning-om-inntekt'), condition: () => (replySed as F027Sed).anmodningOmMerInformasjon?.svar?.inntekt},
                {key: "ytelsetilforeldreloese", label:t('label:svar-på-anmodning-om-barnepensjon'), condition: () => (replySed as F027Sed).anmodningOmMerInformasjon?.svar?.ytelseTilForeldreloese},
                {key: "anneninformasjonbarnet", label:t('label:svar-på-anmodning-om-annen-informasjon-om-barnet'), condition: () => (replySed as F027Sed).anmodningOmMerInformasjon?.svar?.annenInformasjonBarnet},
                {key: "utdanning", label:t('label:svar-om-fremmøte-skole-høyskole-opplæring-arbeidsledighet'), condition: () => (replySed as F027Sed).anmodningOmMerInformasjon?.svar?.utdanning || (replySed as F027Sed).anmodningOmMerInformasjon?.svar?.deltakelsePaaUtdanning},
              ]}
              forms={[
                {label: t('el:option-mainform-svarpaaforespoerselomadopsjon'), value: 'adopsjon', component: SvarPaaForespoerselOmAdopsjon, type: ['adopsjon']},
                {label: t('el:option-mainform-svarpaaanmodningominntekt'), value: 'inntekt', component: SvarPaaAnmodningOmInntekt, type: ['inntekt']},

                {label: t('el:option-mainform-svarpaaanmodningombarnepensjon-identifisering-av-den-avdoede'), value: 'identifisering-av-den-avdoede', component: IdentifiseringAvDenAvdoede, type:['ytelsetilforeldreloese'], options: {cdmVersjon: (replySed as F027Sed).sak?.cdmVersjon}},
                {label: t('el:option-mainform-svarpaaanmodningombarnepensjon-identifisering-av-de-beroerte-barna'), value: 'identifisering-av-de-beroerte-barna', component: IdentifiseringAvDeBeroerteBarna, type:['ytelsetilforeldreloese'], options: {cdmVersjon: (replySed as F027Sed).sak?.cdmVersjon}},
                {label: t('el:option-mainform-svarpaaanmodningombarnepensjon-identifikasjon-av-andre-personer'), value: 'identifikasjon-av-andre-personer', component: IdentifiseringAvAnnenPerson, type:['ytelsetilforeldreloese'], options: {cdmVersjon: (replySed as F027Sed).sak?.cdmVersjon}},
                {label: t('el:option-mainform-svarpaaanmodningombarnepensjon-den-foreldreloeses-barnets-bosted'), value: 'den-foreldreloeses-barnets-bosted', component: DenForeldreloesesBarnetsBosted, type:['ytelsetilforeldreloese'], options: {cdmVersjon: (replySed as F027Sed).sak?.cdmVersjon}},
                {label: t('el:option-mainform-svarpaaanmodningombarnepensjon-relasjonen-mellom-den-foreldreloese-barnet-og-avdoede'), value: 'relasjonen-mellom-den-foreldreloese-barnet-og-avdoede', component: RelasjonForeldreloeseBarnetOgAvdoede, type:['ytelsetilforeldreloese'], options: {cdmVersjon: (replySed as F027Sed).sak?.cdmVersjon}},
                {label: t('el:option-mainform-svarpaaanmodningombarnepensjon-relasjon-mellom-annen-person-og-avdoede'), value: 'relasjon-mellom-annen-person-og-avdoede', component: RelasjonAnnenPersonOgAvdoede, type:['ytelsetilforeldreloese'], options: {cdmVersjon: (replySed as F027Sed).sak?.cdmVersjon}},
                {label: t('el:option-mainform-svarpaaanmodningombarnepensjon-den-foreldreloeses-barnets-aktivitet'), value: 'barnet-aktivitet', component: BarnetFritekst, type:['ytelsetilforeldreloese'], options: {fieldname: 'aktivitet'}},
                {label: t('el:option-mainform-svarpaaanmodningombarnepensjon-skole'), value: 'barnet-skole', component: BarnetFritekst, type:['ytelsetilforeldreloese'], options: {fieldname: 'skole'}},
                {label: t('el:option-mainform-svarpaaanmodningombarnepensjon-opplaering'), value: 'barnet-opplaering', component: BarnetFritekst, type:['ytelsetilforeldreloese'], options: {fieldname: 'opplaering'}},
                {label: t('el:option-mainform-svarpaaanmodningombarnepensjon-ufoerhet'), value: 'barnet-ufoerhet', component: BarnetFritekst, type:['ytelsetilforeldreloese'], options: {fieldname: 'ufoerhet'}},
                {label: t('el:option-mainform-svarpaaanmodningombarnepensjon-arbeidsledighet'), value: 'barnet-arbeidsledighet', component: BarnetFritekst, type:['ytelsetilforeldreloese'], options: {fieldname: 'arbeidsledighet'}},
                {label: t('el:option-mainform-svarpaaanmodningombarnepensjon-inntekt-til-den-foreldreloese-barnet'), value: 'inntekt-til-den-foreldreloese-barnet', component: InntektForeldreloeseBarnet, type:['ytelsetilforeldreloese'], options: {cdmVersjon: (replySed as F027Sed).sak?.cdmVersjon}},
                {label: t('el:option-mainform-svarpaaanmodningombarnepensjon-svar-paa-anmodning-om-ytelser-til-foreldreloese'), value: 'barnet-ytelser', component: BarnetFritekst, type:['ytelsetilforeldreloese'], options: {fieldname: 'ytelser'}},

                {label: t('el:option-mainform-svarpaaanmodningomanneninformasjonombarnet-daglig-omsorg'), value: 'dagligOmsorg', component: AnnenInformasjonOmBarnetFritekst, type:['anneninformasjonbarnet'], options: {fieldname: 'dagligOmsorg'}},
                {label: t('el:option-mainform-svarpaaanmodningomanneninformasjonombarnet-foreldreansvar'), value: 'foreldreansvar', component: AnnenInformasjonOmBarnetFritekst, type:['anneninformasjonbarnet'], options: {fieldname: 'foreldreansvar'}},
                {label: t('el:option-mainform-svarpaaanmodningomanneninformasjonombarnet-er-barnet-adoptert'), value: 'er-adoptert', component: ErBarnetAdoptert, type:['anneninformasjonbarnet'], options: {cdmVersjon: (replySed as F027Sed).sak?.cdmVersjon}},
                {label: t('el:option-mainform-svarpaaanmodningomanneninformasjonombarnet-forsoerges-av-det-offentlige'), value: 'forsoerges-av-det-offentlige', component: ForsoergesAvDetOffentlige, type:['anneninformasjonbarnet'], options: {cdmVersjon: (replySed as F027Sed).sak?.cdmVersjon}},
                {label: t('el:option-mainform-svarpaaanmodningomanneninformasjonombarnet-informasjon-om-barnehage'), value: 'informasjon-om-barnehage', component: InformasjonOmBarnehage, type:['anneninformasjonbarnet'], options: {cdmVersjon: (replySed as F027Sed).sak?.cdmVersjon}},
                {label: t('el:option-mainform-svarpaaanmodningomanneninformasjonombarnet-barnets-sivilstand'), value: 'barnets-sivilstand', component: BarnetsSivilstand, type:['anneninformasjonbarnet'], options: {cdmVersjon: (replySed as F027Sed).sak?.cdmVersjon}},
                {label: t('el:option-mainform-svarpaaanmodningomanneninformasjonombarnet-dato-for-endrede-forhold'), value: 'dato-for-endrede-forhold', component: DatoEndredeForhold, type:['anneninformasjonbarnet']},
                {label: t('el:option-mainform-svarpaaanmodningombarnepensjon-svar-paa-anmodning-om-annen-informasjon-angaaende-barnet'), value: 'ytterligereInformasjon', component: AnnenInformasjonOmBarnetFritekst, type:['anneninformasjonbarnet'], options: {fieldname: 'ytterligereInformasjon'}},

                {label: t('el:option-mainform-svaromfremmoeteutdanning'), value: 'utdanning', component: SvarOmFremmoeteUtdanning, type: ['utdanning']},
              ]}
              replySed={replySed}
              updateReplySed={updateReplySed}
              setReplySed={setReplySed}
              loggingNamespace='svarpaaetterspurtinformasjonmanager'
            />
            <VerticalSeparatorDiv size='2' />
          </>
        }
        {isS040Sed(replySed) &&
          <>
            <MainForm
              type='onelevel'
              menuDefaultClosed={false}
              namespace='forespoersel'
              forms={[
                {
                  label: t('el:option-mainform-forespoersel'),
                  value: 'forespoersel',
                  component: Forespoersel,
                }
              ]}
              replySed={replySed}
              updateReplySed={updateReplySed}
              setReplySed={setReplySed}
              loggingNamespace='forespoerselmanager'
            />
            <VerticalSeparatorDiv size='2' />
          </>
        }
        {isS046Sed(replySed) &&
          <>
            <MainForm
              type='onelevel'
              menuDefaultClosed={false}
              namespace='informasjonOmUtbetaling'
              forms={[
                {
                  label: t('el:option-mainform-vedtak'),
                  value: 'informasjonOmUtbetaling',
                  component: InformasjonOmUtbetaling,
                }
              ]}
              replySed={replySed}
              updateReplySed={updateReplySed}
              setReplySed={setReplySed}
              loggingNamespace='informasjonomutbetalingmanager'
            />
            <VerticalSeparatorDiv size='2' />
          </>
        }
        {(isF001Sed(replySed) || isF002Sed(replySed) || isF026Sed(replySed) || isF027Sed(replySed) || isH002Sed(replySed) || isS040Sed(replySed) || isS046Sed(replySed)) && (
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
                title={t('message:help-send-sed')}
                disabled={disableSend}
                onClick={onSendSedClick}
              >
                {sendingSed ? t('message:loading-sending-sed') : t('el:button-send-sed')}
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
