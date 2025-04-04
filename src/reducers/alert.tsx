import { ExternalLinkIcon } from '@navikt/aksel-icons'
import * as types from 'constants/actionTypes'
import i18n from 'i18n'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import { FlexDiv, HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { Link } from '@navikt/ds-react'
import React from 'react'
import { Action } from 'redux'

export interface AlertState {
  stripeStatus: string | undefined
  stripeMessage: JSX.Element | string | undefined
  bannerStatus: string | undefined
  bannerMessage: string | undefined
  uuid: string | undefined
  error: any | undefined
  type: string | undefined
}

export const initialAlertState: AlertState = {
  stripeStatus: undefined,
  stripeMessage: undefined,
  bannerStatus: undefined,
  bannerMessage: undefined,
  uuid: undefined,
  error: undefined,
  type: undefined
}

const alertReducer = (state: AlertState = initialAlertState, action: Action | ActionWithPayload = { type: '' }): AlertState => {
  let stripeMessage: JSX.Element | string | undefined
  let bannerMessage: string | undefined
  let stripeStatus: string
  let bannerStatus: string

  if (
    action.type === types.ALERT_RESET ||
    action.type === types.APP_RESET ||
    action.type === types.PERSON_SEARCH_REQUEST ||
    action.type === types.SAK_ABROADPERSON_ADD_SUCCESS ||
    action.type === types.SAK_TPSPERSON_ADD_SUCCESS ||
    action.type === types.JOURNALFOERING_ADD_RELATED_RINASAK_FAILURE)
  {
    return initialAlertState
  }

  if (action.type === types.ALERT_SUCCESS) {
    return {
      ...state,
      type: action.type,
      bannerMessage: (action as ActionWithPayload).payload.message,
      bannerStatus: 'success'
    }
  }

  if (action.type === types.ALERT_FAILURE) {
    return {
      ...state,
      type: action.type,
      bannerMessage: (action as ActionWithPayload).payload.error,
      bannerStatus: 'error',
      error: (action as ActionWithPayload).payload.error
    }
  }

  /**
   * All ERROR MESSAGES go here, to banner alert
   */
  if (_.endsWith(action.type, '/ERROR')) {
    bannerStatus = 'error'
    switch (action.type) {
      case types.SERVER_INTERNAL_ERROR:
        bannerMessage = i18n.t('message:error-serverInternalError')
        break

      default:
        bannerMessage = (action as ActionWithPayload).payload.message || i18n.t('message:error-serverInternalError')
        break
    }

    return {
      ...state,
      type: action.type,
      bannerMessage,
      bannerStatus,
      error: (action as ActionWithPayload).payload
        ? _.isString((action as ActionWithPayload).payload.error)
            ? (action as ActionWithPayload).payload.error
            : (action as ActionWithPayload).payload.error?.message
        : undefined,
      uuid: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.uuid : undefined
    }
  }

  /**
   * All FAILURE MESSAGES go here, to stripe alert
   */
  if (_.endsWith(action.type, '/FAILURE')) {
    stripeStatus = 'error'
    bannerStatus =  'error'
    switch (action.type) {
      case types.ATTACHMENT_SEND_FAILURE:
        stripeMessage = i18n.t('message:error-attachment-send-failed')
        break

      case types.PERSON_SEARCH_FAILURE:
        stripeMessage = i18n.t('message:error-person-notFound')
        break

      case types.SAK_ABROADPERSON_ADD_FAILURE:
        stripeMessage = i18n.t('message:error-abroadperson-exists')
        break

      case types.SAK_TPSPERSON_ADD_FAILURE:
        stripeMessage = i18n.t('message:error-tpsperson-exists')
        break

      case types.SAK_SEND_FAILURE:
        bannerMessage = i18n.t('message:error-opprett-sak-failure')
        break

      case types.SVARSED_MOTTAKERE_ADD_FAILURE:
        stripeMessage = i18n.t('message:error-mottakere-add')
        break

      case types.SVARSED_SED_CREATE_FAILURE:
      case types.SVARSED_SED_UPDATE_FAILURE:
        if ((action as ActionWithPayload).status === 409) {
          const url = (action as ActionWithPayload).context.sakUrl
          stripeMessage = (
            <FlexDiv>
              <span>{i18n.t('message:error-svarsed-failure-duplicate') as string}</span>
              <HorizontalSeparatorDiv size='0.5' />
              <Link target='_blank' href={url} rel='noreferrer'>
                <span>
                  {i18n.t('message:error-svarsed-failure-duplicate-2') as string}
                </span>
                <HorizontalSeparatorDiv size='0.35' />
                <ExternalLinkIcon />
              </Link>
            </FlexDiv>
          )
        } else {
          stripeMessage = i18n.t('message:error-svarsed-failure') + ((action as ActionWithPayload).payload.message ?? '')
        }
        break

      case types.JOURNALFOERING_PERSON_SEARCH_FAILURE:
        if ((action as ActionWithPayload).status === 404) {
          stripeMessage = i18n.t('message:error-person-notFound')
        } else {
          bannerMessage = _.isString((action as ActionWithPayload).payload.error)
            ? (action as ActionWithPayload).payload.error
            : (action as ActionWithPayload).payload.error?.message
        }
        break

      case types.JOURNALFOERING_FAGSAKER_FAILURE:
      case types.JOURNALFOERING_JOURNALFOER_SAK_FAILURE:
      case types.JOURNALFOERING_H001_CREATE_FAILURE:
      case types.JOURNALFOERING_H001_UPDATE_FAILURE:
      case types.JOURNALFOERING_H001_SEND_FAILURE:
      case types.JOURNALFOERING_H_BUC_01_CREATE_FAILURE:
      case types.JOURNALFOERING_FEILREGISTRER_JOURNALPOSTER_FAILURE:
        bannerMessage = _.isString((action as ActionWithPayload).payload.error)
          ? (action as ActionWithPayload).payload.error
          : (action as ActionWithPayload).payload.error?.message
        break

      default:
        console.log((action as ActionWithPayload).type)
        console.log((action as ActionWithPayload).status)
        console.log((action as ActionWithPayload).context)
        console.log((action as ActionWithPayload).payload)
        if ((action as ActionWithPayload).payload && (action as ActionWithPayload).payload.error) {
          stripeMessage = _.isString((action as ActionWithPayload).payload.error)
            ? (action as ActionWithPayload).payload.error
            : (action as ActionWithPayload).payload.error?.message
        } else {
          stripeMessage = i18n.t('label:error')
        }
        break
    }

    return {
      ...state,
      type: action.type,
      bannerStatus,
      bannerMessage,
      stripeStatus,
      stripeMessage,
      error: (action as ActionWithPayload).payload
        ? _.isString((action as ActionWithPayload).payload.error)
            ? (action as ActionWithPayload).payload.error
            : (action as ActionWithPayload).payload.error?.message
        : undefined,
      uuid: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.uuid : undefined
    }
  }

  /**
   * All OK MESSAGES for banner go here
   */
  let dealWithBanner = false

  if (action.type === types.SVARSED_SED_SEND_SUCCESS) {
    bannerMessage = i18n.t('message:success-sed-send')
    dealWithBanner = true
  }

  if (action.type === types.SVARSED_SAK_DELETE_SUCCESS) {
    bannerMessage = i18n.t('message:success-delete-sak')
    dealWithBanner = true
  }

  if (action.type === types.SVARSED_ATTACHMENT_SENSITIVE_SUCCESS) {
    const sensitivt = (action as ActionWithPayload).context.sensitivt
    bannerMessage = i18n.t('message:success-attachment-sensitiv', {sensitive: sensitivt ? "sensitivt" : "ikke sensitivt"})
    dealWithBanner = true
  }

  if (action.type === types.SVARSED_ATTACHMENT_DELETE_SUCCESS) {
    bannerMessage = i18n.t('message:success-attachment-deleted')
    dealWithBanner = true
  }

  if (dealWithBanner) {
    return {
      ...state,
      type: action.type,
      bannerStatus: 'success',
      bannerMessage,
      uuid: undefined,
      error: undefined
    }
  }

  /**
   * All OK MESSAGES for stripe go here
   */

  stripeStatus = 'success'

  if (action.type === types.SVARSED_REPLYSED_SET) {
    stripeMessage = undefined
  }

  if (!stripeMessage) {
    return state
  }

  return {
    ...state,
    type: action.type,
    stripeStatus,
    stripeMessage,
    uuid: undefined,
    error: undefined
  }
}

export default alertReducer
