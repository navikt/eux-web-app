import * as types from 'constants/actionTypes'
import {
  H001Sed,
  F002Sed,
  Kjoenn,
  ReplySed,
  X001Sed,
  X008Sed,
  X010Sed,
  X011Sed,
  X012Sed,
  XSed,
  Person
} from 'declarations/sed.d'
import {CreateSedResponse, Fagsaker, Institusjon, Motpart, Sak, Saks, Sed} from 'declarations/types.d'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import moment from 'moment'
import { AnyAction } from 'redux'
import {isUSed} from "../utils/sed";

export interface SvarsedState {
  fagsaker: Fagsaker | null | undefined
  deletedSak: any | null | undefined
  deletedSed: any | null | undefined
  deletedVedlegg: any | null | undefined
  savedVedlegg: any | null | undefined
  setVedleggSensitiv: any | null | undefined
  setRinaAttachmentSensitive: any | null | undefined
  attachmentRemoved: any | null | undefined
  institusjoner: Array<Institusjon> | undefined
  mottakere: any | undefined
  personRelatert: any
  previewFile: Blob | null | undefined
  replySed: ReplySed | null | undefined
  originalReplySed: ReplySed | null | undefined
  replySedChanged: boolean
  saks: Saks | null | undefined
  currentSak: Sak | undefined
  sedCreatedResponse: CreateSedResponse | null | undefined
  sedSendResponse: any | null | undefined
  sedStatus: {[k in string]: string | null}
  deselectedFormaal: string | undefined
}

export const initialSvarsedState: SvarsedState = {
  fagsaker: undefined,
  deletedSak: undefined,
  deletedSed: undefined,
  deletedVedlegg: undefined,
  savedVedlegg: undefined,
  setVedleggSensitiv: undefined,
  setRinaAttachmentSensitive: undefined,
  attachmentRemoved: undefined,
  institusjoner: undefined,
  mottakere: undefined,
  personRelatert: undefined,
  // binary PDF file for SED preview,
  previewFile: undefined,
  // the working reply sed
  replySed: undefined,
  // the original reply sed, to be restored when <nullstill> button is clicked
  originalReplySed: undefined,
  // keep tracking if reply sed has changed
  replySedChanged: false,
  saks: undefined,
  currentSak: undefined,
  sedCreatedResponse: undefined,
  sedSendResponse: undefined,
  sedStatus: {},
  deselectedFormaal: undefined
}

const createReplySedTemplate = <T>(sak: Sak, sedType: string): T => {
  const personInfo = {
    fornavn: sak.fornavn,
    etternavn: sak.etternavn,
    kjoenn: sak.kjoenn as Kjoenn,
    foedselsdato: sak.foedselsdato,
    ...(sak.fnr && sak.fnr !== "" &&
      {pin: [{
        land: 'NO',
        identifikator: sak.fnr
      }]})
  }

  const replySed = {
    sedVersjon: sak.cdmVersjon,
    sedType,
    sak,
    sed: {
      sedType,
      status: 'new'
    } as Sed,
    bruker: sedType.startsWith('X')
      ? personInfo
      : { personInfo }
  } as unknown as T

  //console.log("createReplySedTemplate", replySed)
  return replySed
}

const trimPin = (bruker:Person):Person => {
  let brukerWithTrimmedPin = bruker
  if(bruker && bruker.personInfo && bruker.personInfo.pin) {
    let personInfo = bruker.personInfo
    let trimmedPins = personInfo.pin.map((pin: any) => {
      return {
        ...pin,
        identifikator: pin.identifikator ? pin.identifikator.trim() : null
      }
    })

    brukerWithTrimmedPin = {
      ...bruker,
      personInfo: {
        ...personInfo,
        pin: trimmedPins
      }
    }
  }
  return brukerWithTrimmedPin
}

const svarsedReducer = (
  state: SvarsedState = initialSvarsedState,
  action: AnyAction
): SvarsedState => {
  switch (action.type) {
    case types.APP_RESET:
      return initialSvarsedState

    case types.SVARSED_RESET:
      return {
        ...state,
        replySed: undefined,
        originalReplySed: undefined,
        replySedChanged: false,
        sedSendResponse: undefined
      }

    case types.SVARSED_FAGSAKER_RESET:
    case types.SVARSED_FAGSAKER_REQUEST:
      return {
        ...state,
        fagsaker: undefined
      }

    case types.SVARSED_FAGSAKER_SUCCESS:
      return {
        ...state,
        fagsaker: (action as ActionWithPayload).payload
      }

    case types.SVARSED_FAGSAKER_FAILURE:
      return {
        ...state,
        fagsaker: null
      }

    case types.SVARSED_REPLYTOSED_REQUEST:
      return {
        ...state,
        sedCreatedResponse: undefined,
        sedSendResponse: undefined,
        replySedChanged: false,
        replySed: undefined,
        originalReplySed: undefined
      }

    case types.SVARSED_REPLYTOSED_SUCCESS: {
      const payload = (action as ActionWithPayload).payload
      let lokaleSakIder = payload.lokaleSakIder ? payload.lokaleSakIder : []

      // trim fnr - might contain whitespace if entered in RINA
      let bruker = trimPin(payload.bruker)

      if(isUSed(payload)){
        //Add Norsk Saksnummer for U-Seds - TEN-24
        const idParts = state.currentSak?.navinstitusjon.id.split(":")
        lokaleSakIder.push({
          saksnummer: state.currentSak?.fagsak?.nr ? state.currentSak?.fagsak?.nr : state.currentSak?.fagsak?.id,
          institusjonsnavn: state.currentSak?.navinstitusjon.navn,
          institusjonsid: state.currentSak?.navinstitusjon.id,
          land: idParts ? idParts[0] : ""
        })
      }

      const newReplySed: ReplySed | null | undefined = {
        ...payload,
        bruker,
        lokaleSakIder,
        sak: (action as ActionWithPayload).context.sak,
        sed: undefined // so we can signal this SED as a SED that needs to be created, not updated
      }

      return {
        ...state,
        replySed: newReplySed,
        originalReplySed: newReplySed,
        replySedChanged: false
      }
    }

    case types.SVARSED_REPLYTOSED_FAILURE:
      return {
        ...state,
        replySedChanged: false,
        replySed: null,
        originalReplySed: null
      }

    case types.SVARSED_EDIT_REQUEST:
      return {
        ...state,
        sedCreatedResponse: undefined,
        sedSendResponse: undefined
      }

    case types.SVARSED_EDIT_SUCCESS: {
      const payload = (action as ActionWithPayload).payload

      // trim fnr - might contain whitespace if entered in RINA
      let bruker = trimPin(payload.bruker)

      const newReplySed = {
        ...payload,
        bruker: {
          ...bruker,
          ...((action as ActionWithPayload).payload.sedType.startsWith('X') && {
            pin: [{
              land: 'NO',
              identifikator: (action as ActionWithPayload).context.sak.fnr
            }]})
        },
        sak: (action as ActionWithPayload).context.sak,
        sed: (action as ActionWithPayload).context.sed
      }

      return {
        ...state,
        replySed: newReplySed,
        originalReplySed: newReplySed,
        replySedChanged: false
      }
    }

    case types.SVARSED_EDIT_FAILURE:
      return {
        ...state,
        replySed: null,
        originalReplySed: null,
        replySedChanged: false
      }

    case types.SVARSED_MOTTAKERE_ADD_RESET:
      return {
        ...state,
        institusjoner: undefined,
        mottakere: undefined
      }

    case types.SVARSED_MOTTAKERE_ADD_SUCCESS:
      return {
        ...state,
        mottakere: {success: true},
        currentSak: {
          ...(state.currentSak as Sak),
          motpart: action.context.mottakere
        }
      }

    case types.SVARSED_PREVIEW_RESET:
      return {
        ...state,
        previewFile: undefined
      }

    case types.SVARSED_PREVIEW_FILE_SUCCESS:
      return {
        ...state,
        previewFile: (action as ActionWithPayload).payload
      }

    case types.SVARSED_PREVIEW_FILE_FAILURE:
      return {
        ...state,
        previewFile: null
      }

    case types.SVARSED_PREVIEW_FILE_REQUEST:
      return {
        ...state,
        previewFile: undefined
      }

    case types.SVARSED_CURRENTSAK_SET:
      return {
        ...state,
        currentSak: (action as ActionWithPayload).payload
      }

    case types.SVARSED_SAK_DELETE_REQUEST:
      return {
        ...state,
        deletedSak: undefined
      }

    case types.SVARSED_SAK_DELETE_SUCCESS:
      return {
        ...state,
        deletedSak: true,
        saks: undefined,
        currentSak: undefined
      }

    case types.SVARSED_SAK_DELETE_FAILURE:
      return {
        ...state,
        deletedSak: null
      }

    case types.SVARSED_SAKS_REQUEST:
    case types.SVARSED_SAKS_REFRESH_REQUEST:
      return {
        ...state,
        saks: undefined,
        deletedSak: undefined
      }

    case types.SVARSED_SAKS_FAILURE:
    case types.SVARSED_SAKS_REFRESH_FAILURE:
    case types.SVARSED_SAKS_TIMER_REFRESH_FAILURE:
      return {
        ...state,
        saks: null
      }

    case types.SVARSED_SAKS_SUCCESS: {
      let saks = _.isArray((action as ActionWithPayload).payload)
        ? (action as ActionWithPayload).payload
        : [(action as ActionWithPayload).payload]

      saks = saks.map((s: Sak) => {
        if (['K', 'M', 'U'].indexOf(s.kjoenn) >= 0) {
          return s
        }
        if (['k', 'm', 'u'].indexOf(s.kjoenn) >= 0) {
          s.kjoenn = s.kjoenn.toUpperCase()
          return s
        }
        if (s.kjoenn === 'f') {
          s.kjoenn = 'K'
          return s
        }
        s.kjoenn = 'U'
        return s
      })

      saks = saks.map((s: Sak) => {
        let motpart: Array<string> = []
        s.motparter?.forEach((m:Motpart) => {
          motpart.push(m.motpartNavn)
        })
        s.motpart = motpart
        return s
      })

      return {
        ...state,
        saks
      }
    }

    case types.SVARSED_SAKS_TIMER_REFRESH_SUCCESS:
    case types.SVARSED_SAKS_REFRESH_SUCCESS: {
      let saks = _.isArray((action as ActionWithPayload).payload)
        ? (action as ActionWithPayload).payload
        : [(action as ActionWithPayload).payload]

      saks = saks.map((s: Sak) => {
        if (['K', 'M', 'U'].indexOf(s.kjoenn) >= 0) {
          return s
        }
        if (['k', 'm', 'u'].indexOf(s.kjoenn) >= 0) {
          s.kjoenn = s.kjoenn.toUpperCase()
          return s
        }
        if (s.kjoenn === 'f') {
          s.kjoenn = 'K'
          return s
        }
        s.kjoenn = 'U'
        return s
      })

      saks = saks.map((s: Sak) => {
        let motpart: Array<string> = []
        s.motparter?.forEach((m:Motpart) => {
          motpart.push(m.motpartNavn)
        })
        s.motpart = motpart
        return s
      })

      return {
        ...state,
        saks,
        currentSak: saks[0]
      }
    }

    case types.SVARSED_SAKS_RESET: {
      return {
        ...state,
        saks: undefined
      }
    }

    case types.SVARSED_H001SED_CREATE: {
      const sak = (action as ActionWithPayload).payload.sak
      const replySed: H001Sed = createReplySedTemplate<H001Sed>(sak, 'H001')
      return {
        ...state,
        replySed
      }
    }

    case types.SVARSED_FSED_CREATE: {
      const sedType = (action as ActionWithPayload).payload.sedType
      const sak = (action as ActionWithPayload).payload.sak
      const replySed: F002Sed = createReplySedTemplate<any>(sak, sedType)
      return {
        ...state,
        replySed
      }
    }

    case types.SVARSED_XSED_CREATE: {
      const sedType = (action as ActionWithPayload).payload.sedType
      const sak = (action as ActionWithPayload).payload.sak
      const replySed: XSed = createReplySedTemplate<XSed>(sak, sedType)

      if (sedType === 'X001') {
        (replySed as X001Sed).avslutningDato = moment(new Date()).format('YYYY-MM-DD')
      }

      return {
        ...state,
        replySed
      }
    }

    case types.SVARSED_SED_INVALIDATE: {
      const { connectedSed, sak } = action.payload
      const replySed: X008Sed = createReplySedTemplate<X008Sed>(sak, 'X008')
      replySed.kansellerSedId = connectedSed.sedId
      replySed.utstedelsesdato = moment(connectedSed.sistEndretDato).format('YYYY-MM-DD')

      return {
        ...state,
        replySed
      }
    }

    case types.SVARSED_SED_REMIND: {
      const { sak } = action.payload
      const replySed: X010Sed = createReplySedTemplate<X010Sed>(sak, 'X010')
      return {
        ...state,
        replySed
      }
    }

    case types.SVARSED_SED_REJECT: {
      const { connectedSed, sak } = action.payload
      const replySed: X011Sed = createReplySedTemplate<X011Sed>(sak, 'X011')
      replySed.avvisSedId = connectedSed.sedId
      return {
        ...state,
        replySed
      }
    }

    case types.SVARSED_SED_CLARIFY: {
      const { sak } = action.payload
      const replySed: X012Sed = createReplySedTemplate<X012Sed>(sak, 'X012')
      return {
        ...state,
        replySed
      }
    }

    case types.SVARSED_SED_CREATE_SUCCESS: {
      let sed = state.replySed?.sed
      if (_.isNil(sed)) {
        sed = {} as Sed
      }
      sed.sedId = (action as ActionWithPayload).payload.sedId

      standardLogger('svarsed.create.success', { type: (action as ActionWithPayload).context.sedType })
      const newReplySed = {
        ...state.replySed,
        sed
      } as ReplySed
      return {
        ...state,
        // now I can restore sedId to the replySed, so it can be updated later
        replySed: newReplySed,
        originalReplySed: newReplySed,
        sedCreatedResponse: (action as ActionWithPayload).payload,
        replySedChanged: false
      }
    }

    case types.SVARSED_SED_CREATE_FAILURE:
      standardLogger('svarsed.create.failure', { type: (action as ActionWithPayload).context.sedType })
      return {
        ...state,
        sedCreatedResponse: null
      }

    case types.SVARSED_SED_UPDATE_SUCCESS: {
      const sedType = (action as ActionWithPayload).context.sedType
      const sedsThatCanBeResendAfterUpdate = ['H001']
      let sedSendResponse = _.cloneDeep(state.sedSendResponse)
      standardLogger('svarsed.update.success', { type: (action as ActionWithPayload).context.sedType })
      if (sedsThatCanBeResendAfterUpdate.indexOf(sedType) >= 0) {
        // remove the previous send response so we can resend it
        sedSendResponse = undefined
      }

      return {
        ...state,
        sedSendResponse,
        sedCreatedResponse: (action as ActionWithPayload).payload,
        replySedChanged: false
      }
    }

    case types.SVARSED_SED_UPDATE_FAILURE:
      standardLogger('svarsed.update.failure', { type: (action as ActionWithPayload).context.sedType })
      return {
        ...state,
        sedCreatedResponse: null
      }

    case types.SVARSED_SED_CREATE_REQUEST:
      standardLogger('svarsed.create.request')
      return {
        ...state,
        sedCreatedResponse: undefined
      }

    case types.SVARSED_SED_UPDATE_REQUEST:
      standardLogger('svarsed.update.request')
      return {
        ...state,
        sedCreatedResponse: undefined
      }

    case types.SVARSED_SED_STATUS_SUCCESS: {
      const sedId: string = (action as ActionWithPayload).context.sedId
      const newSedStatus = _.cloneDeep(state.sedStatus)
      newSedStatus[sedId] = (action as ActionWithPayload).payload.status
      return {
        ...state,
        sedStatus: newSedStatus
      }
    }

    case types.SVARSED_SED_STATUS_FAILURE: {
      const sedId: string = (action as ActionWithPayload).context.sedId
      const newSedStatus = _.cloneDeep(state.sedStatus)
      newSedStatus[sedId] = null
      return {
        ...state,
        sedStatus: newSedStatus
      }
    }

    case types.SVARSED_SED_STATUS_REQUEST: {
      const sedId: string = (action as ActionWithPayload).context.sedId
      const newSedStatus = _.cloneDeep(state.sedStatus)
      delete newSedStatus[sedId]
      return {
        ...state,
        sedStatus: newSedStatus
      }
    }

    case types.SVARSED_SED_SEND_REQUEST:
      return {
        ...state,
        sedSendResponse: undefined
      }

    case types.SVARSED_SED_SEND_FAILURE:
      return {
        ...state,
        sedSendResponse: null
      }

    case types.SVARSED_SED_SEND_SUCCESS: {
      const newReplySed: ReplySed = _.cloneDeep(state.replySed) as ReplySed
      if (_.isNil(newReplySed.sed)) {
        newReplySed.sed = {} as Sed
      }
      newReplySed.sed.status = 'sent'
      return {
        ...state,
        replySed: newReplySed,
        sedSendResponse: { success: true }
      }
    }

    case types.SVARSED_REPLYSED_LOAD:
      return {
        ...state,
        replySed: (action as ActionWithPayload).payload,
        originalReplySed: (action as ActionWithPayload).payload,
        replySedChanged: false
      }

    case types.SVARSED_REPLYSED_SET:
      return {
        ...state,
        replySed: (action as ActionWithPayload).payload,
        replySedChanged: true
      }

    case types.SVARSED_REPLYSED_UPDATE: {
      let newReplySed: ReplySed | null | undefined = _.cloneDeep(state.replySed)
      if (!newReplySed) {
        newReplySed = {} as ReplySed
      }
      _.set(newReplySed,
        (action as ActionWithPayload).payload.needle,
        (action as ActionWithPayload).payload.value
      )

      return {
        ...state,
        replySed: newReplySed,
        replySedChanged: true
      }
    }

    case types.SVARSED_SED_DELETE_REQUEST:
      return {
        ...state,
        deletedSed: undefined
      }

    case types.SVARSED_SED_DELETE_SUCCESS:
      const sedIdDeleted = (action as ActionWithPayload).context.sedId
      let sedListeWithoutDeletedSed = state.currentSak ? _.filter(state.currentSak.sedListe, (sed: Sed) => {
        return sed.sedId !== sedIdDeleted
      }) : []
      return {
        ...state,
        deletedSed: true,
        currentSak: {
          ...(state.currentSak as Sak),
          sedListe: sedListeWithoutDeletedSed
        }
      }

    case types.SVARSED_SED_DELETE_FAILURE:
      return {
        ...state,
        deletedSed: null
      }

    case types.SVARSED_ATTACHMENT_DELETE_REQUEST:
      return {
        ...state,
        deletedVedlegg: undefined
      }

    case types.SVARSED_ATTACHMENT_DELETE_SUCCESS:
      const attachmentIdDeleted = (action as ActionWithPayload).context.vedleggId
      const updatedVedleggList = _.filter(state.replySed?.sed?.vedlegg, v => v.id !== attachmentIdDeleted)
      return {
        ...state,
        deletedVedlegg: true,
        replySed: {
          ...(state.replySed as ReplySed),
          sed: {
            ...(state.replySed?.sed as Sed),
            vedlegg: updatedVedleggList
          }
        }
      }


    case types.SVARSED_ATTACHMENT_DELETE_FAILURE:
      return {
        ...state,
        deletedVedlegg: null
      }

    case types.SVARSED_ATTACHMENT_SENSITIVE_REQUEST:
      return {
        ...state,
        setRinaAttachmentSensitive: undefined
      }

    case types.SVARSED_ATTACHMENT_SENSITIVE_SUCCESS:
      const vId = (action as ActionWithPayload).context.vedleggId
      const updatedVedleggListWithSensitive = state.replySed?.sed?.vedlegg?.map((v) => {
        if(v.id === vId){
          return {
            ...v,
            sensitivt: (action as ActionWithPayload).context.sensitivt
          }
        } else {
          return v
        }
      })

      return {
        ...state,
        setRinaAttachmentSensitive: true,
        replySed: {
          ...(state.replySed as ReplySed),
          sed: {
            ...(state.replySed?.sed as Sed),
            vedlegg: updatedVedleggListWithSensitive
          }
        }
      }


    case types.SVARSED_ATTACHMENT_SENSITIVE_FAILURE:
      return {
        ...state,
        setRinaAttachmentSensitive: null
      }

    case types.ATTACHMENT_SEND_SUCCESS: {
      let updatedVedleggList = state.replySed?.sed?.vedlegg ? _.cloneDeep(state.replySed?.sed?.vedlegg) : []
      const responsePayload = (action as ActionWithPayload).payload
      updatedVedleggList?.push({
        id: responsePayload.vedleggId,
        navn: responsePayload.filnavn,
        sensitivt: responsePayload.sensitivt
      })
      return {
        ...state,
        savedVedlegg: (action as ActionWithPayload).context.joarkBrowserItem,
        replySed: {
          ...(state.replySed as ReplySed),
          sed: {
            ...(state.replySed?.sed as Sed),
            vedlegg: updatedVedleggList
          }
        }

      }
    }

    case types.SVARSED_REPLYSED_ATTACHMENTS_SENSITIVT_UPDATE:
      let updatedAttachmentsList = _.cloneDeep(state.replySed?.attachments)
      const newAttachments = updatedAttachmentsList?.map((att) => {
        if(att.key === (action as ActionWithPayload).payload.attachmentKey){
          return {
            ...att,
            sensitivt: (action as ActionWithPayload).payload.sensitivt
          }
        } else {
          return att
        }
      })

      return {
        ...state,
        setVedleggSensitiv: (action as ActionWithPayload).payload,
        replySed: {
          ...(state.replySed as ReplySed),
          attachments: newAttachments
        }
      }

    case types.SVARSED_REPLYSED_ATTACHMENTS_REMOVE:
      const attachmentsAfterRemove = _.reject(state.replySed?.attachments, (att) => att.key === (action as ActionWithPayload).payload.key)
      return {
        ...state,
        attachmentRemoved: (action as ActionWithPayload).payload,
        replySed: {
          ...(state.replySed as ReplySed),
          attachments: attachmentsAfterRemove
        }
      }

    case types.SVARSED_DESELECTED_FORMAAL_SET:
      const deselectedFormaal = (action as ActionWithPayload).payload
      return {
        ...state,
        deselectedFormaal
      }

    default:
      return state
  }
}

export default svarsedReducer
