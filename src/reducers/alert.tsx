import ExternalLink from 'assets/icons/Logout'
import * as types from 'constants/actionTypes'
import i18n from 'i18n'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { FlexDiv, HighContrastLink, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { Action } from 'redux'

export interface AlertState {
  clientErrorStatus: string | undefined
  clientErrorMessage: JSX.Element | string | undefined
  serverErrorMessage: string | undefined
  uuid: string | undefined
  error: any | undefined
  type: string | undefined
}

export const initialAlertState: AlertState = {
  clientErrorStatus: undefined,
  clientErrorMessage: undefined,
  serverErrorMessage: undefined,
  uuid: undefined,
  error: undefined,
  type: undefined
}

const alertReducer = (state: AlertState = initialAlertState, action: Action | ActionWithPayload = { type: '' }): AlertState => {
  let clientErrorMessage: JSX.Element | string | undefined, serverErrorMessage: string, clientErrorStatus: string

  if (
    action.type === types.ALERT_CLIENT_CLEAR ||
    action.type === types.APP_CLEAN_DATA ||
    action.type === types.SAK_PERSON_RELATERT_RESET ||
    action.type === types.SAK_PERSON_GET_REQUEST ||
    action.type === types.SAK_PERSON_RELATERT_SEARCH_REQUEST ||
    action.type === types.SAK_ABROADPERSON_ADD_SUCCESS ||
    action.type === types.SAK_TPSPERSON_ADD_SUCCESS) {
    return initialAlertState
  }

  if (_.endsWith(action.type, '/ERROR')) {
    switch (action.type) {
      case types.SERVER_INTERNAL_ERROR:
        serverErrorMessage = i18n.t('message:error-serverInternalError')
        break

      case types.SERVER_UNAUTHORIZED_ERROR:
        serverErrorMessage = i18n.t('message:error-serverAuthenticationError')
        break

      default:
        serverErrorMessage = (action as ActionWithPayload).payload.message || i18n.t('message:error-serverInternalError')
        break
    }

    return {
      ...state,
      type: action.type,
      serverErrorMessage: serverErrorMessage,
      error: (action as ActionWithPayload).payload
        ? _.isString((action as ActionWithPayload).payload.error)
            ? (action as ActionWithPayload).payload.error
            : (action as ActionWithPayload).payload.error?.message
        : undefined,
      uuid: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.uuid : undefined
    }
  }

  if (_.endsWith(action.type, '/FAILURE')) {
    clientErrorStatus = 'ERROR'

    switch (action.type) {
      case types.SAK_PERSON_GET_FAILURE:
        clientErrorMessage = i18n.t('message:error-person-notFound')
        break

      case types.SAK_PERSON_RELATERT_SEARCH_FAILURE:
        clientErrorMessage = i18n.t('message:error-personRelated-notFound')
        break

      case types.SAK_ABROADPERSON_ADD_FAILURE:
        clientErrorMessage = i18n.t('message:error-abroadperson-exists')
        break

      case types.SAK_TPSPERSON_ADD_FAILURE:
        clientErrorMessage = i18n.t('message:error-tpsperson-exists')
        break

      case types.SVARPASED_SED_CREATE_FAILURE:
        if ((action as ActionWithPayload).status === 409) {
          const url = (action as ActionWithPayload).context.sakUrl
          clientErrorMessage = (
            <FlexDiv>
              <span>{i18n.t('message:error-svarPaSed-failure-duplicate')}</span>
              <HorizontalSeparatorDiv size='0.5' />
              <HighContrastLink target='_blank' href={url}>
                <span>
                  {i18n.t('message:error-svarPaSed-failure-duplicate-2')}
                </span>
                <HorizontalSeparatorDiv size='0.35' />
                <ExternalLink />
              </HighContrastLink>
            </FlexDiv>
          )
        } else {
          clientErrorMessage = i18n.t('message:error-svarPaSed-failure')
        }
        break

      default:
        if ((action as ActionWithPayload).payload && (action as ActionWithPayload).payload.error) {
          clientErrorMessage = _.isString((action as ActionWithPayload).payload.error)
            ? (action as ActionWithPayload).payload.error
            : (action as ActionWithPayload).payload.error?.message
        } else {
          clientErrorMessage = i18n.t('ui:error')
        }
        break
    }

    return {
      ...state,
      type: action.type,
      clientErrorStatus: clientErrorMessage ? clientErrorStatus : undefined,
      clientErrorMessage: clientErrorMessage,
      error: (action as ActionWithPayload).payload
        ? _.isString((action as ActionWithPayload).payload.error)
            ? (action as ActionWithPayload).payload.error
            : (action as ActionWithPayload).payload.error?.message
        : undefined,
      uuid: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.uuid : undefined
    }
  }

  if (action.type === types.LOCALSTORAGE_ENTRY_SAVE) {
    clientErrorMessage = i18n.t('message:success-svarPaSed-localstorage-save')
  }
  if (action.type === types.SVARPASED_REPLYSED_SET) {
    clientErrorMessage = undefined
  }

  if (!clientErrorMessage) {
    return state
  }

  return {
    ...state,
    type: action.type,
    clientErrorStatus: 'OK',
    clientErrorMessage: clientErrorMessage,
    uuid: undefined,
    error: undefined
  }
}

export default alertReducer
